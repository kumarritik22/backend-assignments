import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useProduct } from '../hooks/useProduct'

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY']
const MAX_IMAGES = 7

// ── Tiny helpers ──
const SectionLabel = ({ children }) => (
  <p className="font-inter text-[10px] font-bold tracking-[0.16em] text-gold uppercase mb-5 flex items-center gap-3">
    <span className="w-6 h-px bg-gold/40 shrink-0" />
    {children}
  </p>
)

const Field = ({ id, label, error, children }) => (
  <div className="flex flex-col gap-1.75">
    {label && (
      <label htmlFor={id}
        className={`font-inter text-[11px] font-medium tracking-[0.04em] ${error ? 'text-red-400' : 'text-[#888]'}`}>
        {label}
      </label>
    )}
    {children}
    {error && <p className="font-inter text-[11px] text-red-400">{error}</p>}
  </div>
)

const inputBase = [
  'w-full bg-[#1a1a1a] border border-[#2d2d2d] rounded-lg font-inter text-sm text-white',
  'placeholder:text-[#444] outline-none transition-all duration-200',
  'focus:border-gold focus:ring-2 focus:ring-gold/10',
].join(' ')

const inputError = 'border-red-400/60 ring-2 ring-red-400/10'

// ── Live Preview Card ──
const LivePreview = ({ title, description, amount, currency, coverImage }) => {
  const formatPrice = () => {
    if (!amount) return null
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }
    return `${symbols[currency] || ''}${Number(amount).toLocaleString()}`
  }

  return (
    <div className="sticky top-18">
      {/* Label */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
        <span className="font-inter text-[9px] font-bold tracking-[0.16em] text-gold uppercase">Live Preview</span>
      </div>

      {/* Card */}
      <div className="rounded-xl overflow-hidden border border-white/10 bg-[#141414] shadow-2xl shadow-black/60">
        {/* Image area */}
        <div className="relative aspect-3/4 w-full bg-[#0e0e0e] overflow-hidden">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            // Placeholder — fashion mood texture
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-white/5 flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#333]">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="font-inter text-[10px] text-[#333] tracking-wide">No image yet</p>
            </div>
          )}

          {/* Velora badge overlay */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
            <span className="font-bodoni text-[10px] font-bold text-white/80 tracking-widest">VELORA</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className={`font-bodoni text-[18px] font-bold leading-tight tracking-tight mb-1.5 ${title ? 'text-white' : 'text-[#2a2a2a]'}`}>
            {title || 'Product title'}
          </h3>
          {description && (
            <p className="font-inter text-[11px] text-[#777] leading-relaxed mt-1 mb-2 line-clamp-3">
              {description}
            </p>
          )}
          {!description && (
            <p className="font-inter text-[11px] text-[#2a2a2a] mb-2">No description yet</p>
          )}
          {formatPrice() ? (
            <p className="font-inter text-[15px] font-medium text-gold">{formatPrice()}</p>
          ) : (
            <p className="font-inter text-[13px] text-[#2a2a2a]">Price not set</p>
          )}
        </div>
      </div>

      <p className="font-inter text-[10px] text-[#333] text-center mt-4 leading-relaxed">
        This is how your product will<br />appear in the Velora store.
      </p>
    </div>
  )
}


const CreateProduct = () => {
  const navigate = useNavigate()
  const { handleCreateProduct } = useProduct()
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging]   = useState(false)
  const [isLoading, setIsLoading]     = useState(false)
  const [apiError, setApiError]       = useState('')
  const [successMsg, setSuccessMsg]   = useState('')

  const [form, setForm] = useState({ title: '', description: '', amount: '', currency: 'INR' })
  const [images, setImages]   = useState([])  // { file, preview }[]
  const [errors, setErrors]   = useState({})

  // ── Form handlers ──
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
    setApiError('')
  }

  const addImages = (files) => {
    const accepted  = Array.from(files).filter(f => f.type.startsWith('image/'))
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) return
    const toAdd = accepted.slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages(p => [...p, ...toAdd])
    if (errors.images) setErrors(p => ({ ...p, images: '' }))
  }

  const removeImage = (idx) => {
    setImages(p => {
      URL.revokeObjectURL(p[idx].preview)
      return p.filter((_, i) => i !== idx)
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    addImages(e.dataTransfer.files)
  }

  // ── Validation ──
  const validate = () => {
    const err = {}
    if (!form.title.trim())        err.title       = 'Title is required'
    if (!form.description.trim())  err.description = 'Description is required'
    if (!form.amount)              err.amount      = 'Price is required'
    else if (isNaN(Number(form.amount)) || Number(form.amount) < 0)
                                   err.amount      = 'Enter a valid price'
    if (images.length === 0)       err.images      = 'Add at least one product image'
    return err
  }

  // ── API call ──
  const submitProduct = async () => {
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }

    setIsLoading(true)
    setApiError('')
    setSuccessMsg('')

    try {
      const fd = new FormData()
      fd.append('title',         form.title.trim())
      fd.append('description',   form.description.trim())
      fd.append('priceAmount',   form.amount)
      fd.append('priceCurrency', form.currency)
      images.forEach(img => fd.append('images', img.file))

      await handleCreateProduct(fd)

      setSuccessMsg('Product published successfully! 🎉')
      // Reset form
      setForm({ title: '', description: '', amount: '', currency: 'INR' })
      images.forEach(img => URL.revokeObjectURL(img.preview))
      setImages([])
      setErrors({})
      // Navigate to home after brief delay to show success message
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.error
        || 'Something went wrong. Please try again.'
      setApiError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const coverImage = images[0]?.preview || null

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-20 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-gold/10 px-5 sm:px-8 py-4">
        <div className="max-w-300 mx-auto flex items-center justify-between">
          <a href="/products"
            className="inline-flex items-center gap-2 font-inter text-[12px] text-[#666] hover:text-gold transition-colors duration-200 group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:-translate-x-0.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Products
          </a>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Velora" className="h-6 w-auto object-contain opacity-90 drop-shadow-md" />
            <span className="font-bodoni text-[16px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
          </div>
        </div>
      </header>

      {/* ── Main — Split Layout ─── */}
      <div className="max-w-300 mx-auto px-5 sm:px-8 py-10 sm:py-14 flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20">

        {/*  LEFT — Form */}
        <div className="flex-1 min-w-0">

          {/* Page heading — with ambient gold glow */}
          <div className="relative mb-10 animate-[fadeInUp_0.5s_ease_both]">
            {/* Subtle background glow */}
            <div className="absolute -top-6 -left-6 w-64 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-3 py-1.25 mb-5">
                <span className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
                <span className="font-inter text-[9px] font-bold tracking-[0.14em] text-gold uppercase">New Listing</span>
              </div>
              <h1 className="font-bodoni text-[36px] sm:text-[44px] font-bold tracking-tight text-white leading-[1.1]">
                Create Product
              </h1>
              <p className="font-inter text-sm text-[#777] mt-2.5 leading-relaxed">
                Add a new item to the Velora collection.
              </p>
            </div>
          </div>

          {/* ── Success / Error banners ── */}
          {successMsg && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-4 py-3.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 mt-0.5 shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="font-inter text-[13px] text-emerald-300">{successMsg}</p>
            </div>
          )}
          {apiError && (
            <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-400/25 rounded-lg px-4 py-3.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="font-inter text-[13px] text-red-300">{apiError}</p>
            </div>
          )}

              <section className="mb-9 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.07s] [animation-fill-mode:both] bg-[#111] border border-white/5 rounded-xl p-6">
            <SectionLabel>Product Details</SectionLabel>
            <div className="flex flex-col gap-5">
              <Field id="title" label="Title" error={errors.title}>
                <input id="title" name="title" type="text"
                  placeholder="e.g. Oversized Linen Shirt"
                  value={form.title} onChange={handleChange}
                  className={`${inputBase} px-4 py-3 ${errors.title ? inputError : ''}`}
                />
              </Field>
              <Field id="description" label="Description" error={errors.description}>
                <textarea id="description" name="description"
                  placeholder="Describe the product — fabric, fit, occasion, care instructions…"
                  value={form.description} onChange={handleChange}
                  rows={5}
                  className={`${inputBase} px-4 py-3 resize-none leading-relaxed ${errors.description ? inputError : ''}`}
                />
              </Field>
            </div>
          </section>

          {/* ── SECTION 2 — Pricing ── */}
          <section className="mb-9 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.14s] [animation-fill-mode:both] bg-[#111] border border-white/5 rounded-xl p-6">
            <SectionLabel>Pricing</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
              <Field id="amount" label="Amount" error={errors.amount}>
                <div className="relative">
                  <input id="amount" name="amount" type="number" min="0" step="0.01"
                    placeholder="0.00"
                    value={form.amount} onChange={handleChange}
                    className={`${inputBase} px-4 py-3 pr-16 ${errors.amount ? inputError : ''}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-inter text-[11px] font-medium text-[#555] pointer-events-none">
                    {form.currency}
                  </span>
                </div>
              </Field>
              <Field id="currency" label="Currency">
                <select id="currency" name="currency"
                  value={form.currency} onChange={handleChange}
                  className={`${inputBase} px-4 py-3 cursor-pointer appearance-none`}
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c} className="bg-[#141414]">{c}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* ── SECTION 3 — Images ── */}
          <section className="mb-10 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.21s] [animation-fill-mode:both] bg-[#111] border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <SectionLabel>Product Images</SectionLabel>
              <span className="font-inter text-[11px] text-[#444] -mt-5">
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {/* Drop zone */}
            {images.length < MAX_IMAGES && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={[
                  'flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl py-12 px-6 cursor-pointer transition-all duration-200',
                  isDragging
                    ? 'border-gold/60 bg-gold/5 scale-[1.01]'
                    : errors.images
                    ? 'border-red-400/40 bg-red-400/5 hover:border-red-400/60'
                    : 'border-[#252525] bg-[#0e0e0e] hover:border-gold/30 hover:bg-gold/3',
                ].join(' ')}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${isDragging ? 'bg-gold/15' : 'bg-[#1a1a1a]'}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                    className={isDragging ? 'text-gold' : 'text-[#555]'}>
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-inter text-sm font-medium text-[#bbb]">
                    {isDragging ? 'Drop to upload' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="font-inter text-[11px] text-[#444] mt-1">
                    Up to {MAX_IMAGES} images — JPG, PNG, WEBP · Max 5 MB each
                  </p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="sr-only"
                  onChange={e => addImages(e.target.files)} />
              </div>
            )}

            {errors.images && (
              <p className="font-inter text-[11px] text-red-400 mt-2">{errors.images}</p>
            )}

            {/* Preview grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-white/8">
                    <img src={img.preview} alt={`Product ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    <button type="button" onClick={() => removeImage(idx)}
                      aria-label={`Remove image ${idx + 1}`}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/80 hover:border-red-400">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-2 left-2 bg-gold/90 rounded-sm px-1.5 py-0.5">
                        <span className="font-inter text-[9px] font-bold text-[#0a0a0a] uppercase tracking-wide">Cover</span>
                      </div>
                    )}
                  </div>
                ))}
                {/* Add more tile */}
                {images.length < MAX_IMAGES && (
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-[#252525] bg-[#0e0e0e] hover:border-gold/30 hover:bg-gold/3 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 group">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.5" strokeLinecap="round" className="text-[#444] group-hover:text-gold transition-colors duration-200">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span className="font-inter text-[9px] text-[#444] group-hover:text-[#888] transition-colors">Add more</span>
                  </button>
                )}
              </div>
            )}
          </section>

          <div className="border-t border-white/5 mb-9" />

          {/* ── Actions ── */}
          <div className="flex flex-col gap-3 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.28s] [animation-fill-mode:both]">
            <button type="button" id="publish-product-btn" onClick={submitProduct} disabled={isLoading}
              className={[
                'w-full rounded-lg py-3.5 font-inter font-bold text-[11px] tracking-[0.18em] uppercase',
                'text-[#0a0a0a] bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold',
                'transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer',
              ].join(' ')}>
              {isLoading ? (
                <span className="inline-flex items-center gap-2 justify-center">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/>
                  </svg>
                  Publishing…
                </span>
              ) : 'Publish Product'}
            </button>
          </div>

          <div className="h-12" />
        </div>

        {/* RIGHT — Live Preview (lg+ only) */}
        <div className="hidden lg:block w-70 xl:w-75 shrink-0">
          <LivePreview
            title={form.title}
            description={form.description}
            amount={form.amount}
            currency={form.currency}
            coverImage={coverImage}
          />
        </div>

      </div>
    </div>
  )
}

export default CreateProduct
