import { useEffect, useState, useMemo } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router'
import { useProduct } from '../hooks/useProduct.js'
import { useCart } from '../../cart/hooks/useCart.js'
import { useSelector } from 'react-redux'

const ProductDetail = () => {

    const {productId} = useParams()

    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)

    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const location = useLocation()

    // Variant Selection State
    const [selectedAttributes, setSelectedAttributes] = useState({})

    const {handleGetProductById} = useProduct();

    const {handleAddItem} = useCart();

    const searchParams = new URLSearchParams(location.search);
    const targetVariantId = location.state?.variantId || searchParams.get("variant");

    async function fetchProductDetails() {
        setIsLoading(true)
        try {
            const data = await handleGetProductById(productId)
            setProduct(data);
            
            if (targetVariantId && data?.variants?.length > 0) {
                const matchedVariant = data.variants.find(
                    (v) => (v._id?.toString() || v.id?.toString()) === targetVariantId.toString()
                );
                if (matchedVariant) {
                    setSelectedAttributes(matchedVariant.attributes);
                } else {
                    setSelectedAttributes(data.variants[0].attributes);
                }
            } else if (location.state?.selectedAttributes) {
                setSelectedAttributes(location.state.selectedAttributes);
            } else if (data?.variants?.length > 0) {
                setSelectedAttributes(data.variants[0].attributes);
            }
            

        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
      fetchProductDetails()
    }, [productId])
    
    // --- Variant Computation Logic ---
    // Extract unique attribute keys and their possible values
    const attributeOptions = useMemo(() => {
        if (!product?.variants) return {};
        const options = {};
        product.variants.forEach(variant => {
            Object.entries(variant.attributes).forEach(([key, val]) => {
                if (!options[key]) options[key] = new Set();
                options[key].add(val);
            });
        });
        
        // Convert Sets to Arrays
        Object.keys(options).forEach(key => {
            options[key] = Array.from(options[key]);
        });
        return options;
    }, [product]);

    // Compute the active variant based on selected attributes
    const activeVariant = useMemo(() => {
        if (!product?.variants || Object.keys(selectedAttributes).length === 0) return null;
        return product.variants.find(variant => {
            return Object.entries(selectedAttributes).every(([key, val]) => variant.attributes[key] === val);
        });
    }, [product, selectedAttributes]);

    // Handle attribute selection (Option B: Auto-switch to valid combination)
    const handleAttributeSelect = (key, value) => {
        const newSelected = { ...selectedAttributes, [key]: value };
        
        // Check if this exact combination exists
        const combinationExists = product.variants.some(variant => 
            Object.entries(newSelected).every(([k, v]) => variant.attributes[k] === v)
        );

        if (!combinationExists) {
            // Find the first variant that has the newly selected value
            const fallbackVariant = product.variants.find(v => v.attributes[key] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
                setActiveImage(0); // Reset image index on variant change
                return;
            }
        }
        
        setSelectedAttributes(newSelected);
        setActiveImage(0); // Reset image index on variant change
    };

    // Determine Display Data (Variant fallback to Main Product)
    const displayPrice = activeVariant?.price || product?.price;
    const displayImages = (activeVariant?.images?.length > 0) ? activeVariant.images : product?.images;
    const displayStock = activeVariant ? activeVariant.stock : null;

    // Reset activeImage if it goes out of bounds when displayImages changes
    useEffect(() => {
        if (displayImages && activeImage >= displayImages.length) {
            setActiveImage(0);
        }
    }, [displayImages, activeImage]);

    const nextImage = () => {
        if (displayImages?.length > 1) {
            setActiveImage((prev) => (prev + 1) % displayImages.length)
        }
    }

    const prevImage = () => {
        if (displayImages?.length > 1) {
            setActiveImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
        }
    }

    // Currency symbol formatter
    const formatPrice = (amount, currency) => {
        if (amount == null) return ''
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }
        return `${symbols[currency] || ''}${Number(amount).toLocaleString()}`
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0c0c0c] text-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bodoni mb-4">Product Not Found</h1>
                <Link to="/" className="text-gold hover:underline">Return to Home</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30">
            
            {/* ── Main Content ── */}
            <main className="max-w-350 mx-auto px-5 sm:px-8 py-10 sm:py-16 animate-[fadeInUp_0.5s_ease_both]">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    
                    {/* Left: Image Gallery */}
                    <div className="w-full lg:w-[45%] xl:w-1/2 flex flex-col sm:flex-row gap-4 h-fit">
                        
                        {/* Thumbnails Strip (Desktop Only) */}
                        {displayImages && displayImages.length > 1 && (
                            <div className="hidden sm:flex flex-col gap-3 w-16 xl:w-20 shrink-0">
                                {displayImages.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-full aspect-4/5 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                                            activeImage === idx 
                                            ? 'border-gold opacity-100 shadow-[0_0_10px_rgba(201,169,110,0.2)]' 
                                            : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/20'
                                        }`}
                                    >
                                        <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image Viewer */}
                        <div className="w-full flex-1 aspect-4/5 bg-[#141414] rounded-2xl overflow-hidden border border-white/5 relative group">
                            {displayImages && displayImages.length > 0 ? (
                                <>
                                    <img 
                                        src={displayImages[activeImage]?.url} 
                                        alt={product.title} 
                                        className="w-full h-full object-cover object-center transition-transform duration-700"
                                    />
                                    
                                    {displayImages.length > 1 && (
                                        <>
                                            <button 
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 border border-white/10 cursor-pointer"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                                            </button>
                                            
                                            <button 
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 border border-white/10 cursor-pointer"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                                            </button>
                                            
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex sm:hidden gap-2">
                                                {displayImages.map((_, idx) => (
                                                    <button 
                                                        key={idx}
                                                        onClick={() => setActiveImage(idx)}
                                                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeImage === idx ? 'bg-gold w-4' : 'bg-white/40 hover:bg-white/80'}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#333] font-inter text-sm">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center">
                        
                        {/* Title & Badge */}
                        <div className="mb-6">
                            {displayStock !== null && (
                                <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1.5 mb-4 ${displayStock > 0 ? 'bg-gold/10 border-gold/25' : 'bg-red-500/10 border-red-500/25'}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${displayStock > 0 ? 'bg-gold animate-pulse' : 'bg-red-500'}`} />
                                    <span className={`font-inter text-[9px] font-bold tracking-[0.15em] uppercase ${displayStock > 0 ? 'text-gold' : 'text-red-500'}`}>
                                        {displayStock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                            )}
                            <h1 className="font-bodoni text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-md">
                                {product.title}
                            </h1>
                            <div className="font-inter text-[24px] sm:text-[28px] text-gold font-light">
                                {formatPrice(displayPrice?.amount, displayPrice?.currency)}
                            </div>
                        </div>
                        
                        <div className="w-full h-px bg-white/10 mb-8" />
                        
                        {/* Variant Attributes Selectors */}
                        {Object.keys(attributeOptions).length > 0 && (
                            <div className="mb-8 flex flex-col gap-6">
                                {Object.entries(attributeOptions).map(([attrKey, values]) => (
                                    <div key={attrKey}>
                                        <h3 className="font-inter text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase mb-3 flex items-center gap-2">
                                            {attrKey} 
                                            <span className="text-white font-medium capitalize border-l border-white/20 pl-2">
                                                {selectedAttributes[attrKey]}
                                            </span>
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {values.map(val => {
                                                const isSelected = selectedAttributes[attrKey] === val;
                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => handleAttributeSelect(attrKey, val)}
                                                        className={`px-5 py-2.5 border rounded-lg font-inter text-sm transition-all duration-300 cursor-pointer outline-none ${
                                                            isSelected 
                                                            ? 'border-gold text-gold bg-gold/5 shadow-[0_0_15px_rgba(201,169,110,0.1)]' 
                                                            : 'border-white/10 text-[#aaa] hover:border-white/30 hover:text-white bg-[#141414]'
                                                        }`}
                                                    >
                                                        {val}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                                
                                <div className="w-full h-px bg-white/10 mt-2" />
                            </div>
                        )}
                        
                        {/* Description */}
                        <div className="mb-12">
                            <h3 className="font-inter text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase mb-4">Details</h3>
                            <p className="font-inter text-sm sm:text-base text-[#ccc] leading-relaxed font-light whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>
                        
                        {/* Premium Stock Indicator (Only shows when stock is low but not 0) */}
                        {displayStock !== null && displayStock > 0 && displayStock <= 5 && (
                            <div className="flex items-center gap-2 mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shrink-0" />
                                <span className="font-inter text-[10px] font-bold tracking-[0.15em] uppercase text-gold">
                                    Limited Availability — Only {displayStock} remaining
                                </span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button 
                                onClick={async () => {
                                    if (!user) {
                                        return navigate("/login", { state : { from: location.pathname, selectedAttributes } })
                                    }

                                    await handleAddItem({ 
                                        productId: product._id, 
                                        variantId: activeVariant._id
                                    })
                                    navigate("/cart")
                                }}
                                disabled={displayStock === 0}
                                className={`flex-1 rounded-xl py-4.5 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 transform ${
                                    displayStock === 0 
                                    ? 'bg-white/10 text-[#555] cursor-not-allowed' 
                                    : 'bg-white hover:bg-gold text-[#0a0a0a] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(201,169,110,0.2)] cursor-pointer'
                                }`}
                            >
                                {displayStock === 0 ? 'Out of Stock' : 'Buy Now'}
                            </button>
                            <button 
                                disabled={displayStock === 0}
                                className={`flex-1 border rounded-xl py-4.5 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                                    displayStock === 0
                                    ? 'border-white/5 text-[#555] bg-transparent cursor-not-allowed'
                                    : 'border-white/20 hover:border-gold text-white hover:text-gold bg-transparent cursor-pointer'
                                }`}
                                onClick={ async () => {
                                    if (!user) {
                                        return navigate("/login", { state: { from: location.pathname, selectedAttributes } })
                                    }

                                    await handleAddItem({
                                        productId: product._id,
                                        variantId: activeVariant._id,
                                    })
                                    navigate("/cart")
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                        
                        {/* Value Props */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mt-12 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3 text-[#777]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                <span className="font-inter text-[11px] uppercase tracking-wider">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#777]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                <span className="font-inter text-[11px] uppercase tracking-wider">Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#777]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                                <span className="font-inter text-[11px] uppercase tracking-wider">Free Returns</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#777]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span className="font-inter text-[11px] uppercase tracking-wider">24/7 Support</span>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </main>
        </div>
    )
}

export default ProductDetail
