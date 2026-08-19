import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { Link, useNavigate } from 'react-router'
import { useCurrency, convertCurrency } from '../hooks/useCurrency.js'
import { useRazorpay } from "react-razorpay";

// --- Currency Config ---
const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY']
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }


const Cart = () => {

    const cart = useSelector(state => state.cart)
    const { handleGetCart, handleIncreaseCartItemQuantity, handleCreateCartOrder, handleVerifyCartOrder } = useCart()
    const { rates, ratesLoading, ratesError, handleFetchRates } = useCurrency()
    const { error, isLoading, Razorpay } = useRazorpay();

    const user = useSelector(state => state.user);

    const navigate = useNavigate();

    // User's chosen display currency (defaults to most common in cart)
    const [displayCurrency, setDisplayCurrency] = useState('USD')

    useEffect(() => {
        handleGetCart()
        handleFetchRates()
    }, [])

    // Once totalsByCurrency loads, default to the currency with the highest total amount
    useEffect(() => {
        if (cart.totalsByCurrency?.length > 0) {
            const dominant = cart.totalsByCurrency.reduce((prev, curr) =>
                curr.amount > prev.amount ? curr : prev
            )
            setDisplayCurrency(dominant.currency)
        }
    }, [cart.totalsByCurrency])

    const handleCheckout = async () => {
        const order = await handleCreateCartOrder()
        console.log(order);

        const options = {
            key: "rzp_test_TRAqlH9mR6sGGT",
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Velora",
            description: "Test Transaction",
            order_id: order.id, // Generate order_id on server
            handler: async (response) => {
                await handleVerifyCartOrder(response)
                
                if (isValid) {
                    Navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                }
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },
            theme: {
                color: "#F37254", 
            },
        };
            const razorpayInstance = new Razorpay(options);
            razorpayInstance.open();
    }

    // --- Helpers ---
    const formatDisplayPrice = (amount) => {
        if (amount == null) return ''
        const symbol = CURRENCY_SYMBOLS[displayCurrency] || displayCurrency
        const locale = displayCurrency === 'INR' ? 'en-IN' : 'en-US'
        const decimals = ['INR', 'JPY'].includes(displayCurrency) ? 0 : 2
        return `${symbol}${Number(amount).toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
    }

    const getDisplayImage = (item) => {
        const variant = item.product?.variants
        if (variant?.images?.length > 0) return variant.images[0].url
        if (item.product?.images?.length > 0) return item.product.images[0].url
        return null
    }

    // Original item price formatted in its own currency (shown on card)
    const formatOriginalPrice = (amount, currency) => {
        if (amount == null) return ''
        const symbol = CURRENCY_SYMBOLS[currency] || currency
        const locale = currency === 'INR' ? 'en-IN' : 'en-US'
        const decimals = ['INR', 'JPY'].includes(currency) ? 0 : 2
        return `${symbol}${Number(amount).toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
    }

    // Convert backend-computed currency totals to a single display-currency total.
    // The backend already sums per-currency (e.g. INR: 400, USD: 249).
    // We just convert each currency bucket and sum — at most 3-4 conversions, not N items.
    const convertedSubtotal = useMemo(() => {
        if (!rates || !cart.totalsByCurrency?.length) return null
        return cart.totalsByCurrency.reduce((sum, { currency, amount }) => {
            return sum + convertCurrency(amount, currency, displayCurrency, rates)
        }, 0)
    }, [cart.totalsByCurrency, displayCurrency, rates])

    // Mixed currencies = more than one currency bucket from the backend
    const hasMixedCurrencies = useMemo(() => {
        return (cart.totalsByCurrency?.length || 0) > 1
    }, [cart.totalsByCurrency])

    const isEmpty = cart.items.length === 0

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30">

            <main className="max-w-350 mx-auto px-5 sm:px-8 py-10 sm:py-16 animate-[fadeInUp_0.5s_ease_both]">

                {/* Empty Cart State */}
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center mb-2">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#444]">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bodoni text-[36px] sm:text-[48px] font-bold text-white mb-3">Your Cart is Empty</h1>
                            <p className="font-inter text-sm text-[#666] max-w-sm">Looks like you haven't added anything yet. Explore our collection and find something you love.</p>
                        </div>
                        <Link
                            to="/"
                            className="mt-4 inline-flex items-center gap-2 border border-white/20 hover:border-gold hover:text-gold text-white rounded-xl px-8 py-4 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start overflow-hidden">

                        {/* ── Left: Cart Items ── */}
                        <div className="min-w-0 w-full lg:flex-1 overflow-hidden">
                            <div className="flex items-baseline gap-4 mb-8">
                                <h1 className="font-bodoni text-[36px] sm:text-[42px] font-bold text-white leading-tight">Your Cart</h1>
                                <span className="font-inter text-sm text-[#555]">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</span>
                            </div>

                            <div className="flex flex-col">
                                {cart.items.map((item, index) => {
                                    const variant = item.product?.variants
                                    const displayImage = getDisplayImage(item)
                                    const itemPrice = item.price || variant?.price || item.product?.price
                                    const variantPrice = variant?.price 

                                    return (
                                        <div key={item._id || index}>
                                            <div className="flex gap-5 sm:gap-6 py-6 group min-w-0">

                                                {/* Product Image */}
                                                <Link
                                                    to={`/product/${item.product?._id}`}
                                                    className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#141414] border border-white/5 block"
                                                >
                                                    {displayImage ? (
                                                        <img src={displayImage} alt={item.product?.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[#333]">
                                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Product Info */}
                                                <div className="flex-1 flex flex-col justify-between min-w-0 overflow-hidden">
                                                    <div>
                                                        <Link to={`/product/${item.product?._id}`} className="hover:text-gold transition-colors duration-200">
                                                            <h3 className="font-inter font-semibold text-[15px] text-white leading-snug mb-2 truncate pr-4">
                                                                {item.product?.title}
                                                            </h3>
                                                        </Link>

                                                        {/* Variant Attributes */}
                                                        {variant?.attributes && Object.keys(variant.attributes).length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {Object.entries(variant.attributes).map(([key, val]) => (
                                                                    <span key={key} className="bg-white/5 border border-white/8 rounded-md px-2 py-1 font-inter text-[10px] text-[#888]">
                                                                        <span className="text-[#555]">{key}: </span>{val}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {/* Original Price (always show in item's own currency) */}
                                                        <div className="font-inter text-[16px] font-medium text-gold">
                                                            {formatOriginalPrice(itemPrice?.amount, itemPrice?.currency)}
                                                        </div>

                                                        {
                                                            itemPrice.amount !== variantPrice.amount && (
                                                                <>
                                                                    {itemPrice.amount > variantPrice.amount
                                                                        ? <p className="text-xs mt-2 mb-2 text-green-500 font-semibold" >Good news! Price dropped to {formatOriginalPrice(variantPrice.amount, variantPrice.currency)} - you save {formatOriginalPrice(Math.abs(itemPrice.amount - variantPrice.amount), itemPrice.currency)}.</p>
                                                                        : <p className="text-xs mt-2 mb-2 text-red-500 font-semibold">⚠️ Price increased to {formatOriginalPrice(variantPrice.amount, variantPrice.currency)} - you'll pay {formatOriginalPrice(Math.abs(variantPrice.amount - itemPrice.amount), itemPrice.currency)} more. </p>
                                                                    }
                                                                </>
                                                            )
                                                        }
                                                    </div>

                                                    {/* Quantity & Delete Row */}
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center gap-0 border border-white/10 rounded-lg overflow-hidden">
                                                            <button
                                                             className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                            <span className="w-10 h-9 flex items-center justify-center font-inter text-sm text-white border-l border-r border-white/10">
                                                                {item.quantity || 1}
                                                            </span>
                                                            <button 
                                                             onClick={() => handleIncreaseCartItemQuantity({productId: item.product?._id, variantId: item.variant})}
                                                             className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                        </div>

                                                        <button className="flex items-center gap-1.5 text-[#444] hover:text-red-400 transition-colors duration-200 cursor-pointer opacity-0 group-hover:opacity-100 font-inter text-[11px] uppercase tracking-wider">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6l-1 14H6L5 6" />
                                                                <path d="M10 11v6M14 11v6" />
                                                                <path d="M9 6V4h6v2" />
                                                            </svg>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {index < cart.items.length - 1 && (
                                                <div className="w-full h-px bg-white/5" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* ── Right: Order Summary ── */}
                        <div className="w-full lg:w-95 xl:w-105 shrink-0 lg:sticky lg:top-24">
                            <div className="bg-[#111] border border-white/8 rounded-2xl p-6 sm:p-8">

                                {/* Header + Currency Picker */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bodoni text-[24px] font-bold text-white">Order Summary</h2>

                                    {/* STEP 6: Currency Selector */}
                                    <div className="relative">
                                        <select
                                            value={displayCurrency}
                                            onChange={e => setDisplayCurrency(e.target.value)}
                                            disabled={ratesLoading || ratesError}
                                            className="appearance-none bg-[#1a1a1a] border border-white/10 rounded-lg pl-3 pr-7 py-1.5 font-inter text-[11px] font-bold text-white focus:border-gold focus:outline-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {SUPPORTED_CURRENCIES.map(c => (
                                                <option key={c} value={c}>{CURRENCY_SYMBOLS[c]} {c}</option>
                                            ))}
                                        </select>
                                        <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#555]" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                                    </div>
                                </div>

                                {/* Mixed currencies notice */}
                                {hasMixedCurrencies && (
                                    <div className="flex items-start gap-2 bg-gold/5 border border-gold/15 rounded-lg px-3 py-2.5 mb-5">
                                        <svg className="text-gold shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                        <p className="font-inter text-[10px] text-gold/80 leading-relaxed">
                                            Your cart has items in multiple currencies. Prices are converted using live exchange rates.
                                        </p>
                                    </div>
                                )}

                                {/* Line Items */}
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex items-center justify-between font-inter text-sm">
                                        <span className="text-[#888]">Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                                        <span className="text-white">
                                            {ratesLoading ? (
                                                <span className="w-16 h-4 bg-white/5 rounded animate-pulse inline-block" />
                                            ) : ratesError ? '—' : formatDisplayPrice(convertedSubtotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between font-inter text-sm">
                                        <span className="text-[#888]">Shipping</span>
                                        <span className="text-green-400 font-medium">Free</span>
                                    </div>
                                    <div className="flex items-center justify-between font-inter text-sm">
                                        <span className="text-[#888]">Taxes</span>
                                        <span className="text-[#888]">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-white/8 mb-6" />

                                {/* Total */}
                                <div className="flex items-center justify-between mb-8">
                                    <span className="font-inter text-base font-semibold text-white">Total</span>
                                    <div className="text-right">
                                        {ratesLoading ? (
                                            <span className="w-24 h-7 bg-white/5 rounded animate-pulse inline-block" />
                                        ) : ratesError ? (
                                            <span className="font-inter text-sm text-[#555]">Rate fetch failed</span>
                                        ) : (
                                            <span className="font-bodoni text-[24px] font-bold text-gold">
                                                {formatDisplayPrice(convertedSubtotal)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-white hover:bg-gold text-[#0a0a0a] rounded-xl py-4 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(201,169,110,0.2)] cursor-pointer mb-4">
                                    Proceed to Checkout
                                </button>

                                <Link
                                    to="/"
                                    className="block text-center font-inter text-[11px] text-[#555] hover:text-gold transition-colors duration-200 tracking-wider uppercase"
                                >
                                    Continue Shopping
                                </Link>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/5">
                                    <div className="flex flex-col items-center gap-1.5 text-[#444]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                        <span className="font-inter text-[9px] uppercase tracking-widest">Secure</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 text-[#444]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                        <span className="font-inter text-[9px] uppercase tracking-widest">Returns</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1.5 text-[#444]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        <span className="font-inter text-[9px] uppercase tracking-widest">24/7 Help</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}

export default Cart
