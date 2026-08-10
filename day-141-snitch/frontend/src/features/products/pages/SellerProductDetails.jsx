import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const SellerProductDetails = () => {

    const { productId } = useParams();

    const [product, setProduct] = useState(null)

    const {handleGetProductById, handleAddProductVariant} = useProduct()

    async function fetchProductDetails() {
        const data = await handleGetProductById(productId)
        setProduct(data)
    }

    useEffect(() => {
      fetchProductDetails()
    }, [productId])

    console.log(product);
    
    // --- State for Product Overview (Buyer View Mockup) ---
    const [activeImage, setActiveImage] = useState(0);

    const nextImage = () => {
        if (product?.images?.length > 1) {
            setActiveImage((prev) => (prev + 1) % product.images.length)
        }
    }

    const prevImage = () => {
        if (product?.images?.length > 1) {
            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
        }
    }

    // --- State for Add Variant Form ---
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    
    // Attributes built as an array of {key, value} for easy input mapping, converted to object later
    const [newAttributes, setNewAttributes] = useState([{ key: '', value: '' }]);
    const [newStock, setNewStock] = useState(0);
    const [newPriceAmount, setNewPriceAmount] = useState('');
    const [newImages, setNewImages] = useState([]); // Array of File objects for preview
    const [newPriceCurrency, setNewPriceCurrency] = useState("");

    const handleStartAddingVariant = () => {
        setNewPriceCurrency(product?.price?.currency || "")
        setIsAddingVariant(true)
    }
    

    // --- Handlers for dynamic attributes ---
    const handleAddAttributeField = () => {
        setNewAttributes([...newAttributes, { key: '', value: '' }]);
    };

    const handleAttributeChange = (index, field, val) => {
        const updated = [...newAttributes];
        updated[index][field] = val;
        setNewAttributes(updated);
    };

    const handleRemoveAttributeField = (index) => {
        const updated = newAttributes.filter((_, i) => i !== index);
        setNewAttributes(updated);
    };

    // --- Handlers for Image Upload ---
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (newImages.length + files.length > 7) {
            alert('You can only upload a maximum of 7 images per variant.');
            return;
        }
        setNewImages([...newImages, ...files]);
    };

    const handleRemoveImage = (index) => {
        const updated = newImages.filter((_, i) => i !== index);
        setNewImages(updated);
    };

    // Form submit mockup
    const handleSaveVariant = async (e) => {
        e.preventDefault();
        const attributesObj = {};
        let hasValidAttribute = false;
        newAttributes.forEach(attr => {
            if (attr.key.trim() && attr.value.trim()) {
                attributesObj[attr.key.trim()] = attr.value.trim();
                hasValidAttribute = true;
            }
        });

        if (!hasValidAttribute) {
            alert("At least one valid attribute (e.g. Size, Color) is required.");
            return;
        }

        const variantData = {
            attributes: attributesObj,
            stock: Number(newStock),
            price: newPriceAmount ? { amount: Number(newPriceAmount), currency: newPriceCurrency } : undefined,
            images: newImages.map(file => ({file}))
        };

        const updatedProduct = await handleAddProductVariant(productId, variantData)
        setProduct(updatedProduct);
        
        setNewAttributes([{ key: '', value: '' }]);
        setNewStock(0);
        setNewPriceAmount('');
        setNewImages([]);
        setIsAddingVariant(false);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30 pb-20">
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-gold/10 px-5 sm:px-8 py-4">
                <div className="max-w-350 mx-auto flex items-center justify-between">
                    <Link to="/seller/dashboard" className="inline-flex items-center gap-2 font-inter text-[12px] text-[#666] hover:text-gold transition-colors duration-200 group">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
                            <path d="M19 12H5M12 5l-7 7 7 7" />
                        </svg>
                        Dashboard
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <img src="/logo.png" alt="Velora" className="h-6 w-auto object-contain opacity-90 drop-shadow-md" />
                        <span className="font-bodoni text-[16px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
                    </div>
                    <div className="w-20"></div>
                </div>
            </header>

            <main className="max-w-350 mx-auto px-5 sm:px-8 py-10 sm:py-16 animate-[fadeInUp_0.5s_ease_both]">
                
                {/* ── 1. Buyer View (Product Preview) ── */}
                <div className="mb-20 pb-16 border-b border-white/10">
                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                        {/* Left: Image Gallery */}
                        <div className="w-full lg:w-[45%] xl:w-1/2 flex flex-col sm:flex-row gap-4 h-fit">
                            
                            {/* Thumbnails Strip (Desktop Only) */}
                            {product?.images && product.images.length > 1 && (
                                <div className="hidden sm:flex flex-col gap-3 w-16 xl:w-20 shrink-0">
                                    {product.images.map((img, idx) => (
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
                                {product?.images && product?.images.length > 0 ? (
                                    <>
                                        <img 
                                            src={product.images[activeImage]?.url} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover object-center transition-transform duration-700"
                                        />
                                        
                                        {/* Left/Right Navigation Arrows */}
                                        {product?.images.length > 1 && (
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
                                                
                                                {/* Dot Indicators */}
                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex sm:hidden gap-2">
                                                    {product.images.map((_, idx) => (
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
                            
                            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-3 py-1.5 mb-6 self-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 animate-pulse" />
                                <span className="font-inter text-[9px] font-bold tracking-[0.15em] text-gold uppercase">Preview Mode</span>
                            </div>
                            
                            <h1 className="font-bodoni text-[32px] sm:text-[42px] lg:text-[48px] font-bold text-white leading-[1.1] tracking-tight mb-4 drop-shadow-md">
                                {product?.title}
                            </h1>
                            
                            <div className="font-inter text-[24px] sm:text-[28px] text-gold font-light mb-8">
                                {product?.price?.amount} {product?.price?.currency}
                            </div>
                            
                            <div className="w-full h-px bg-white/10 mb-8" />
                            
                            <div className="mb-12">
                                <h3 className="font-inter text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase mb-4">Details</h3>
                                <p className="font-inter text-sm sm:text-base text-[#ccc] leading-relaxed font-light">
                                    {product?.description}
                                </p>
                            </div>
                            
                            {/* Disabled Buttons for Preview */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto opacity-50 pointer-events-none">
                                <button className="flex-1 bg-white hover:bg-gold text-[#0a0a0a] rounded-xl py-4.5 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300">
                                    Buy Now
                                </button>
                                <button className="flex-1 bg-transparent border border-white/20 hover:border-gold text-white hover:text-gold rounded-xl py-4.5 px-8 font-inter font-bold text-[11px] tracking-[0.2em] uppercase transition-all duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 2. Variant Management Section ── */}
                <div className="max-w-250 mx-auto">
                    <div className="mb-10">
                        <h2 className="font-bodoni text-[36px] font-bold text-white mb-2">Variant Management</h2>
                        <p className="font-inter text-sm text-[#777]">Add, edit, or remove product variants and control their stock levels.</p>
                    </div>

                    {/* ── Add Variant Button ── */}
                    {!isAddingVariant && (
                        <button 
                            onClick={handleStartAddingVariant}
                            className="w-full flex items-center justify-center gap-2 border border-dashed border-gold/30 rounded-xl py-6 hover:bg-gold/5 hover:border-gold/60 transition-colors duration-300 group mb-12 cursor-pointer"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold group-hover:scale-110 transition-transform"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span className="font-inter text-sm font-medium text-gold uppercase tracking-widest">Create New Variant</span>
                        </button>
                    )}

                    {/* ── Add Variant Form ── */}
                    {isAddingVariant && (
                        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sm:p-8 mb-12 animate-[fadeIn_0.3s_ease_both]">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-bodoni text-[24px] font-bold text-white">New Variant Details</h2>
                                <button onClick={() => setIsAddingVariant(false)} className="text-[#555] hover:text-white transition-colors cursor-pointer">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSaveVariant} className="flex flex-col gap-8">
                                
                                {/* Dynamic Attributes */}
                                <div>
                                    <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-gold mb-4">Attributes (Required)</label>
                                    <div className="flex flex-col gap-3">
                                        {newAttributes.map((attr, idx) => (
                                            <div key={idx} className="flex items-start gap-3">
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. Size, Color, Storage"
                                                    value={attr.key}
                                                    onChange={(e) => handleAttributeChange(idx, 'key', e.target.value)}
                                                    className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#444] focus:border-gold focus:outline-none"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="e.g. XL, Red, 256GB"
                                                    value={attr.value}
                                                    onChange={(e) => handleAttributeChange(idx, 'value', e.target.value)}
                                                    className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#444] focus:border-gold focus:outline-none"
                                                />
                                                {newAttributes.length > 1 && (
                                                    <button type="button" onClick={() => handleRemoveAttributeField(idx)} className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={handleAddAttributeField} className="self-start text-xs font-inter font-bold tracking-widest text-[#888] hover:text-white uppercase flex items-center gap-1 mt-2 cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                            Add Another Attribute
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Stock */}
                                    <div>
                                        <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-[#888] mb-3">Stock Quantity</label>
                                        <input 
                                            type="number" min="0"
                                            value={newStock}
                                            onChange={(e) => setNewStock(e.target.value)}
                                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                                        />
                                    </div>
                                    
                                    {/* Price Override */}
                                    <div>
                                        <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-[#888] mb-3">Price Override (Optional)</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" min="0" placeholder="Amount"
                                                value={newPriceAmount}
                                                onChange={(e) => setNewPriceAmount(e.target.value)}
                                                className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none"
                                            />
                                            <select 
                                                value={newPriceCurrency}
                                                onChange={(e) => setNewPriceCurrency(e.target.value)}
                                                className="w-24 bg-[#1a1a1a] border border-white/5 rounded-lg px-2 text-sm text-white focus:border-gold focus:outline-none"
                                            >
                                                <option value="USD">USD</option>
                                                <option value="INR">INR</option>
                                                <option value="EUR">EUR</option>
                                                <option value="GBP">GBP</option>
                                                <option value="JPY">JPY</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Images Upload */}
                                <div>
                                    <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-[#888] mb-3">Images (Max 7, Optional)</label>
                                    
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {newImages.map((file, idx) => (
                                            <div key={idx} className="relative shrink-0 w-24 h-24 rounded-lg bg-[#1a1a1a] border border-white/10 overflow-hidden group">
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                                </button>
                                            </div>
                                        ))}
                                        
                                        {newImages.length < 7 && (
                                            <label className="shrink-0 w-24 h-24 rounded-lg border border-dashed border-white/20 hover:border-gold/50 hover:bg-gold/5 cursor-pointer flex flex-col items-center justify-center gap-2 transition-all">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#666]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                                <span className="font-inter text-[9px] text-[#666] uppercase">Upload</span>
                                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                <button type="submit" className="w-full rounded-lg py-4 font-inter font-bold text-[11px] tracking-[0.2em] uppercase text-[#0a0a0a] bg-linear-to-tr from-gold to-gold-dark hover:from-gold-light hover:to-gold transition-all duration-300 mt-4 cursor-pointer">
                                    Save Variant
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── Existing Variants List ── */}
                    <div>
                        <h2 className="font-bodoni text-[24px] font-bold text-white mb-6">Existing Variants</h2>
                        
                        {!product?.variants || product.variants.length === 0 ? (
                            <p className="font-inter text-sm text-[#555]">No variants created yet.</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {product.variants.map((v, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row gap-6 p-5 bg-[#141414] border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                        
                                        {/* Variant Image */}
                                        <div className="w-full sm:w-24 h-32 sm:h-24 shrink-0 bg-[#0a0a0a] rounded-lg overflow-hidden border border-white/5">
                                            {v.images?.length > 0 ? (
                                                <img src={v.images[0]?.url} className="w-full h-full object-cover" alt="Variant" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#444] uppercase tracking-widest">No Img</div>
                                            )}
                                        </div>
                                        
                                        {/* Variant Info */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {Object.entries(v.attributes).map(([key, val]) => (
                                                    <span key={key} className="bg-white/5 border border-white/10 rounded-md px-2 py-1 font-inter text-[11px] text-[#ccc]">
                                                        <span className="text-[#777] mr-1">{key}:</span>{val}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-6 font-inter text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-[#666]">Stock</span>
                                                    <span className="text-white font-medium">{v.stock}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-[#666]">Price</span>
                                                    <span className="text-gold font-medium">
                                                        {v.price ? `${v.price.amount} ${v.price.currency}` : 'Base Price'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Actions (Mock) */}
                                        <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                                            <button className="px-4 py-2 border border-white/10 rounded-lg font-inter text-[11px] uppercase tracking-widest hover:border-gold hover:text-gold transition-colors cursor-pointer">Edit</button>
                                            <button className="px-4 py-2 border border-red-500/20 text-red-400 rounded-lg font-inter text-[11px] uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
};

export default SellerProductDetails;
