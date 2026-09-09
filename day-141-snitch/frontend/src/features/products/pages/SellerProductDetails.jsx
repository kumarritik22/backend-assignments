import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProduct } from '../hooks/useProduct.js';
import { Pencil, Trash2, X, Plus } from "lucide-react";

const SellerProductDetails = () => {

    const { productId } = useParams();
    const { handleGetProductById, handleAddProductVariant, handleDeleteProduct, handleUpdateProduct, handleDeleteProductVariant } = useProduct();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null)
    const [isDeletingVariant, setIsDeletingVariant] = useState(false)
    
    // --- Edit Product States ---
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [editNewImages, setEditNewImages] = useState([]);
    const [editExistingImages, setEditExistingImages] = useState([])
    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: ""
    });

    async function fetchProductDetails() {
        const data = await handleGetProductById(productId);
        setProduct(data);
    }

    const onConfirmDelete = async () => {
        setIsDeleting(true);
        const res = await handleDeleteProduct(productId);
        if (res?.success) {
            return navigate("/seller/dashboard");
        }
        setIsDeleting(false);
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    const onConfirmDeleteVariant = async () => {
        if (!variantToDelete) return;

        setIsDeletingVariant(true)
        const updatedProduct = await handleDeleteProductVariant(productId, variantToDelete._id);
        if (updatedProduct) {
            setProduct(updatedProduct);
            setVariantToDelete(null)
        }
        setIsDeletingVariant(false);
    };

    const formatPrice = (amount, currency) => {
        if (amount == null) return "";
        const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
        return `${symbols[currency] || ''}${Number(amount).toLocaleString()}`;
    }

    // --- Edit Product Handlers ---
    const handleStartEditing = () => {
        setEditFormData({
            title: product?.title || "",
            description: product?.description || "",
            priceAmount: product?.price?.amount || "",
            priceCurrency: product?.price?.currency || "USD"
        });
        setEditExistingImages(product?.images || []);
        setEditNewImages([]);
        setIsEditing(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (files.length > 7) {
            return alert('You can select a maximum of 7 images at once.');
        }

        // 1. Build the complete unified timeline: [old existing -> previously selected new -> freshly selected new]
        const allImagesTimeline = [...editExistingImages, ...editNewImages, ...files];

        // 2. Keep ONLY the last 7 images (Oldest at the beginning are dropped first!)
        const final7 = allImagesTimeline.slice(-7);

        // 3. Separate the final 7 back into existing saved images vs new File objects
        const keptExisting = final7.filter((item) => !(item instanceof File) && item.url);
        const keptNew = final7.filter((item) => item instanceof File || !item.url);

        setEditExistingImages(keptExisting);
        setEditNewImages(keptNew);

        // Reset input so selecting the same files again still triggers onChange
        e.target.value = '';
    };

    const handleRemoveEditNewImage = (index) => {
        setEditNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExistingImage = (index) => {
        setEditExistingImages((prev) => prev.filter((_, i) => i !== index))
    };

    const handleSaveProductEdit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const formData = new FormData();
        formData.append("title", editFormData.title);
        formData.append("description", editFormData.description);
        formData.append("priceAmount", editFormData.priceAmount);
        formData.append("priceCurrency", editFormData.priceCurrency);
        formData.append("existingImages", JSON.stringify(editExistingImages));

        editNewImages.forEach((imageFile) => {
            formData.append("images", imageFile);
        });

        const updatedProduct = await handleUpdateProduct(productId, formData);

        if (updatedProduct) {
            setProduct(updatedProduct);
            setIsEditing(false);
            setEditNewImages([]);
            setEditExistingImages([]);
        }

        setIsUpdating(false);
    };

    // --- State for Product Overview (Buyer View Mockup) ---
    const [activeImage, setActiveImage] = useState(0);

    const nextImage = () => {
        if (product?.images?.length > 1) {
            setActiveImage((prev) => (prev + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product?.images?.length > 1) {
            setActiveImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
        }
    };

    // --- State for Add Variant Form ---
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [newAttributes, setNewAttributes] = useState([{ key: '', value: '' }]);
    const [newStock, setNewStock] = useState(0);
    const [newPriceAmount, setNewPriceAmount] = useState('');
    const [newImages, setNewImages] = useState([]);
    const [newPriceCurrency, setNewPriceCurrency] = useState("");

    const handleStartAddingVariant = () => {
        setNewPriceCurrency(product?.price?.currency || "");
        setIsAddingVariant(true);
    };

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
            images: newImages.map(file => ({ file }))
        };

        const updatedProduct = await handleAddProductVariant(productId, variantData);
        setProduct(updatedProduct);
        
        setNewAttributes([{ key: '', value: '' }]);
        setNewStock(0);
        setNewPriceAmount('');
        setNewImages([]);
        setIsAddingVariant(false);
    };

    return (
        <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30 pb-20">

            <main className="max-w-350 mx-auto px-5 sm:px-8 py-6 sm:py-8 animate-[fadeInUp_0.5s_ease_both]">
                
                {/* ── 1. Buyer View (Product Preview) ── */}
                <div className="mb-12 pb-10 border-b border-white/10">
                    <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                        {/* Left: Image Gallery */}
                        <div className="w-full lg:w-[45%] xl:w-[42%] flex flex-col sm:flex-row gap-3 sm:gap-4 h-110 sm:h-120 lg:h-125">
                            
                            {/* Thumbnails Strip (Desktop Only) */}
                            {product?.images && product.images.length > 1 && (
                                <div className="hidden sm:flex flex-col gap-2 w-16 xl:w-20 shrink-0 h-full">
                                    {product.images.map((img, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-full flex-1 min-h-0 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
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
                            <div className="w-full h-full flex-1 bg-[#141414] rounded-2xl overflow-hidden border border-white/5 relative group">
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
                                {formatPrice(product?.price?.amount, product?.price?.currency)}
                            </div>
                            
                            <div className="w-full h-px bg-white/10 mb-8" />
                            
                            <div className="mb-6">
                                <h3 className="font-inter text-[11px] font-bold tracking-[0.2em] text-[#888] uppercase mb-4">Details</h3>
                                <p className="font-inter text-sm sm:text-base text-[#ccc] leading-relaxed font-light">
                                    {product?.description}
                                </p>
                            </div>

                            {/* Edit & Delete Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button 
                                    onClick={handleStartEditing}
                                    className="flex-1 flex items-center justify-center gap-2.5 bg-white hover:bg-gold text-[#0a0a0a] font-inter font-bold text-[11px] tracking-[0.2em] uppercase rounded-xl py-4 px-6 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(201,169,110,0.3)] cursor-pointer active:scale-[0.98]"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    <span>Edit Product</span>
                                </button>
                                <button 
                                    onClick={() => setShowDeleteModal(true)}
                                    className="flex-1 flex items-center justify-center gap-2.5 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 font-inter font-bold text-[11px] tracking-[0.2em] uppercase rounded-xl py-4 px-6 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Product</span>
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
                                                        {v.price ? formatPrice(v.price.amount, v.price.currency) : 'Base Price'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Actions (Mock) */}
                                        <div className="flex sm:flex-col justify-end gap-2 shrink-0">
                                            <button className="px-4 py-2 border border-white/10 rounded-lg font-inter text-[11px] uppercase tracking-widest hover:border-gold hover:text-gold transition-colors cursor-pointer">Edit</button>
                                            <button 
                                                type='button'
                                                onClick={() => setVariantToDelete(v)}
                                                className="px-4 py-2 border border-red-500/20 text-red-400 rounded-lg font-inter text-[11px] uppercase tracking-widest hover:bg-red-500/10 transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease_both]">
                    <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-[fadeInUp_0.3s_ease_both] text-center">

                        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <h3 className="font-bodoni text-2xl font-bold text-white mb-2 tracking-tight">Delete Product?</h3>
                        <p className="font-inter text-xs sm:text-sm text-[#888] leading-relaxed mb-8">Are you sure you want to permanently delete this product and all its variants? This action cannot be undone.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button 
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3.5 px-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 text-[#ccc] hover:text-white font-inter text-[11px] font-semibold uppercase tracking-widest transition-all cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button 
                                type="button"
                                onClick={onConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-inter text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                { isDeleting ? "Deleting..." : "Delete Product" }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Variant Delete Confirmation Modal */}
            {variantToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease_both]">
                    <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-[fadeInUp_0.3s_ease_both] text-center">

                        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <h3 className="font-bodoni text-2xl font-bold text-white mb-2 tracking-tight">Delete Variant?</h3>
                        <p className="font-inter text-xs sm:text-sm text-[#888] leading-relaxed mb-8">
                            Are you sure you want to permanently delete this variant? This action cannot be undone.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button 
                                type="button"
                                onClick={() => setVariantToDelete(null)}
                                className="flex-1 py-3.5 px-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 text-[#ccc] hover:text-white font-inter text-[11px] font-semibold uppercase tracking-widest transition-all cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button 
                                type="button"
                                onClick={onConfirmDeleteVariant}
                                disabled={isDeletingVariant}
                                className="flex-1 py-3.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-inter text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                { isDeletingVariant ? "Deleting..." : "Delete Variant" }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Product Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease_both]">
                    <div className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                        <form onSubmit={handleSaveProductEdit} className="flex flex-col gap-6">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                <h2 className="font-bodoni text-2xl font-bold text-white">Edit Product</h2>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditNewImages([]);
                                    }}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-gold mb-2">Title</label>
                                <input 
                                    type="text" 
                                    name="title" 
                                    value={editFormData.title} 
                                    onChange={handleEditInputChange} 
                                    required
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-gold focus:outline-none transition-colors" 
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-gold mb-2">Description</label>
                                <textarea 
                                    rows={4} 
                                    name="description" 
                                    value={editFormData.description} 
                                    onChange={handleEditInputChange} 
                                    required
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-gold focus:outline-none resize-none transition-colors"
                                />
                            </div>

                            {/* Price & Currency */}
                            <div>
                                <label className="block font-inter text-[11px] font-bold uppercase tracking-widest text-gold mb-2">Base Price</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <input 
                                        type="number" 
                                        min="0" 
                                        name="priceAmount" 
                                        value={editFormData.priceAmount} 
                                        onChange={handleEditInputChange} 
                                        required
                                        className="sm:col-span-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-gold focus:outline-none"
                                    />

                                    <select 
                                        name="priceCurrency" 
                                        value={editFormData.priceCurrency} 
                                        onChange={handleEditInputChange}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-gold focus:outline-none cursor-pointer"
                                    >
                                        <option value="USD">USD</option>
                                        <option value="INR">INR</option>
                                        <option value="EUR">EUR</option>
                                        <option value="GBP">GBP</option>
                                        <option value="JPY">JPY</option>
                                    </select>
                                </div>
                            </div>

                            {/* Images Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="font-inter text-[11px] font-bold uppercase tracking-widest text-[#888]">
                                        Product Images (Max 7 Total)
                                    </label>
                                    <span className="font-inter text-[10px] text-gold">
                                        {editExistingImages.length + editNewImages.length} / 7
                                    </span>
                                </div>

                                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {/* Existing Saved Images */}
                                {editExistingImages.map((img, idx) => (
                                    <div key={`existing-${idx}`} className="relative shrink-0 w-24 h-24 rounded-xl bg-[#1a1a1a] border border-white/10 overflow-hidden group">
                                        <img 
                                            src={img.url} 
                                            alt="existing" 
                                            className="w-full h-full object-cover" 
                                        />
                                        <span className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-inter text-[#aaa] uppercase group-hover:opacity-0 transition-opacity">
                                            Saved
                                        </span>
                                        <button 
                                            type='button' 
                                            onClick={() => handleRemoveExistingImage(idx)}
                                            className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                                                <X className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                ))}

                                {/* Newly Selected Images */}
                                {editNewImages.map((file, idx) => (
                                    <div key={`new-${idx}`} className="relative shrink-0 w-24 h-24 rounded-xl bg-[#1a1a1a] border border-gold/40 overflow-hidden group">
                                        <img src={URL.createObjectURL(file)} alt="new preview" className="w-full h-full object-cover" />
                                        <span className="absolute bottom-1 left-1 bg-gold/90 text-[#0a0a0a] px-1.5 py-0.5 rounded text-[8px] font-inter font-bold uppercase group-hover:opacity-0 transition-opacity">
                                            New
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveEditNewImage(idx)}
                                            className="absolute inset-0 z-10 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                                                <X className="w-4 h-4" />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                                
                                {/* Add Photo Button (ALWAYS visible so you can upload to replace anytime!) */}
                                <label className="shrink-0 w-24 h-24 rounded-xl border border-dashed border-white/20 hover:border-gold/50 hover:bg-gold/5 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all text-[#888] hover:text-gold">
                                    <Plus className="w-5 h-5" />
                                    <span className="font-inter text-[9px] uppercase tracking-wider font-bold">Add Photo</span>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={handleEditImageUpload} 
                                        className="hidden" 
                                    />
                                </label>
                            </div>
                        </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditNewImages([]);
                                    }}
                                    className="py-3 px-5 rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 text-[#ccc] hover:text-white font-inter text-[11px] font-semibold uppercase tracking-widest transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button 
                                    type="submit" 
                                    disabled={isUpdating} 
                                    className="py-3 px-6 rounded-xl bg-gold hover:bg-gold-light text-[#0a0a0a] font-inter font-bold text-[11px] tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(201,169,110,0.2)] hover:shadow-[0_0_20px_rgba(201,169,110,0.4)] cursor-pointer disabled:opacity-50"
                                >
                                    {isUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerProductDetails;