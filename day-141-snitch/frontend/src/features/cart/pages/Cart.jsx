import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hooks/useCart'
import { Link, useNavigate } from 'react-router'
import { useCurrency, convertCurrency } from '../hooks/useCurrency.js'
import { useRazorpay } from "react-razorpay";
import { MapPin, ShieldCheck, Truck, Sparkles, AlertCircle } from "lucide-react";

// --- Currency Config ---
const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY']
const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }


const Cart = () => {

    const cart = useSelector(state => state.cart)
    const { handleGetCart, handleIncreaseCartItemQuantity, handleDecreaseCartItemQuantity, handleCreateCartOrder, handleVerifyCartOrder, handleFailCartOrder, handleDeleteCartItem } = useCart()
    const { rates, ratesLoading, ratesError, handleFetchRates, selectedCurrency, handleChangeCurrency } = useCurrency()
    const { error, isLoading, Razorpay } = useRazorpay();
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const displayCurrency = selectedCurrency

    const [shippingAddress, setShippingAddress] = useState({
        fullname: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
        contact: ""
    })
    const [addressError, setAddressError] = useState("")
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

    useEffect(() => {
        handleGetCart()
        handleFetchRates()
    }, [])

    useEffect(() => {
        if (user) {
            setShippingAddress(prev => ({
                ...prev,
                fullname: prev.fullname || user.fullname || "",
                contact: prev.contact || user.contact || ""
            }))
        }
    }, [user])

    useEffect(() => {
        if (isCheckoutOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isCheckoutOpen])
    

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }));
        if (addressError) setAddressError("");
    };

    const handleCheckout = async () => {
        // --- Delivery Address Validation ---
        if (!shippingAddress.fullname?.trim()) {
            setAddressError("Recipient full name is required.");
            return;
        }
        if (!shippingAddress.addressLine1?.trim()) {
            setAddressError("Street address is required.");
            return;
        }
        if (!shippingAddress.city?.trim()) {
            setAddressError("City is required.");
            return;
        }
        if (!shippingAddress.state?.trim()) {
            setAddressError("State is required.");
            return;
        }
        if (!shippingAddress.pinCode?.trim()) {
            setAddressError("Postal PIN code is required.");
            return;
        }
        if (!shippingAddress.contact?.trim()) {
            setAddressError("Contact number is required.");
            return;
        }
        if (!shippingAddress.country?.trim()) {
            setAddressError("Country is required.");
            return;
        }

        try {
            setAddressError("");
            // Step 1: Tell the backend currency & shipping address to create Razorpay order
            const order = await handleCreateCartOrder({ 
                currency: displayCurrency,
                shippingAddress: {
                    ...shippingAddress,
                    country: shippingAddress.country || "India"
                }
            })

            const options = {
                key: order.key,                // Public Razorpay key returned from backend
                amount: order.amount,          // Total in smallest unit (paise/cents) — set by backend
                currency: order.currency,      // The currency the user selected
                name: "Velora",
                description: "Premium Fashion by Velora",
                order_id: order.id,            // Razorpay order ID created by backend
                handler: async (response) => {
                    try {
                        // Step 2: After payment, verify the signature on backend to confirm it's genuine
                        const isValid = await handleVerifyCartOrder(response)

                        if (isValid) {
                            navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                        } else {
                            alert('Payment verification failed. Please contact support.')
                        }
                    } catch (err) {
                        console.error("Verification error:", err)
                        alert('Payment verification failed. Please contact support.')
                    }
                },
                prefill: {
                    name: shippingAddress.fullname || user?.fullname,
                    email: user?.email,
                    contact: shippingAddress.contact || user?.contact,
                },
                theme: {
                    color: "#C9A96E",
                },
            };

            const razorpayInstance = new Razorpay(options);
            
            // Listen for payment failures (e.g. user closes modal, bank decline)
            razorpayInstance.on('payment.failed', async function (response) {
                try {
                    await handleFailCartOrder({ razorpay_order_id: response.error.metadata.order_id })
                } catch (err) {
                    console.error("Failed to report payment failure to backend:", err)
                }
                alert('Payment failed: ' + response.error.description)
            });

            razorpayInstance.open();
        } catch (err) {
            console.error("Checkout error:", err)
            const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to initiate payment. Please try again.';
            setAddressError(errorMsg);
        }
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
                                                                onClick={() => 
                                                                    handleDecreaseCartItemQuantity({
                                                                        productId: item.product?._id,
                                                                        variantId: item.variant
                                                                    })
                                                                }
                                                                className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                            <span className="w-10 h-9 flex items-center justify-center font-inter text-sm text-white border-l border-r border-white/10">
                                                                {item.quantity || 1}
                                                            </span>
                                                            <button 
                                                                onClick={() => 
                                                                    handleIncreaseCartItemQuantity({
                                                                        productId: item.product?._id,
                                                                        variantId: item.variant
                                                                    })
                                                                }
                                                                className="w-9 h-9 flex items-center justify-center text-[#666] hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                                            </button>
                                                        </div>

                                                        <button 
                                                            onClick={() => 
                                                                handleDeleteCartItem({
                                                                    productId: item.product?._id,
                                                                    variantId: item.variant
                                                                })
                                                            }
                                                            className="flex items-center gap-1.5 text-[#444] hover:text-red-400 transition-colors duration-200 cursor-pointer opacity-0 group-hover:opacity-100 font-inter text-[11px] uppercase tracking-wider">
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
                                            onChange={e => handleChangeCurrency(e.target.value)}
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
                                    onClick={() => setIsCheckoutOpen(true)}
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

                {isCheckoutOpen && (
                    <div 
                        onClick={() => setIsCheckoutOpen(false)}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
                    >
                        <div 
                            onClick={(e) => e.stopPropagation()}
                            className="fixed right-0 top-0 h-screen z-50 w-full max-w-lg bg-[#111] p-6 sm:p-8 pb-16 sm:pb-20 overflow-y-auto overscroll-contain border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300"
                        >
                            {/* ── Delivery Destination Form Card ── */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="font-bodoni text-lg font-bold text-white">Delivery Destination</h3>
                                            <p className="font-inter text-xs text-[#888]">White-glove courier shipping location</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsCheckoutOpen(false)}
                                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#888] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {addressError && (
                                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-inter text-xs animate-fade-in">
                                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                                        <span>{addressError}</span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-inter">
                                    {/* Full Name */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">Recipient Full Name *</label>
                                        <input 
                                            type="text"
                                            name="fullname"
                                            value={shippingAddress.fullname}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. Ritik Kumar"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Address Line 1 */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">Street Address / House No. *</label>
                                        <input 
                                            type="text"
                                            name="addressLine1"
                                            value={shippingAddress.addressLine1}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. 142 Royal Atelier Boulevard, Suite 4B"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Address Line 2 (Optional) */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666]">Landmark / Building (Optional)</label>
                                        <input 
                                            type="text"
                                            name="addressLine2"
                                            value={shippingAddress.addressLine2}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. Near Grand Palais"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* City */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">City *</label>
                                        <input 
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. Mumbai"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* State */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">State *</label>
                                        <input 
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. Maharashtra"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* PIN Code */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">PIN Code *</label>
                                        <input 
                                            type="text"
                                            name="pinCode"
                                            value={shippingAddress.pinCode}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. 400001"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Contact Number */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">Contact Number *</label>
                                        <input 
                                            type="text"
                                            name="contact"
                                            value={shippingAddress.contact}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. 9876543210"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>

                                    {/* Country */}
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#888]">Country *</label>
                                        <input 
                                            type="text"
                                            name="country"
                                            value={shippingAddress.country}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. India"
                                            className="w-full bg-[#141414] border border-white/10 hover:border-white/20 focus:border-gold/50 focus:ring-1 focus:ring-gold/20 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#444] transition-all outline-none"
                                        />
                                    </div>
                                    <button  
                                        onClick={handleCheckout}
                                        className="sm:col-span-2 w-full bg-white hover:bg-gold text-[#0a0a0a] rounded-xl py-4 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(201,169,110,0.2)] cursor-pointer mt-2 mb-8"
                                    >
                                        CONFIRM & PAY
                                    </button>
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
