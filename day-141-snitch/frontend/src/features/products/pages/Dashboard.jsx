import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/useProduct'

const Dashboard = () => {
  const products = useSelector(state => state.product.sellerProducts) || []
  const { handleGetSellerProduct } = useProduct()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError('')
    try {
      await handleGetSellerProduct()
    } catch (err) {
      console.error(err)
      setError('Failed to load your products. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Currency symbol formatter
  const formatPrice = (amount, currency) => {
    if (amount == null) return ''
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' }
    return `${symbols[currency] || ''}${Number(amount).toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-30 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-gold/10 px-5 sm:px-8 py-4">
        <div className="max-w-350 mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 font-inter text-[12px] text-[#666] hover:text-gold transition-colors duration-200 group">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Home
          </Link>
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Velora" className="h-6 w-auto object-contain opacity-90 drop-shadow-md" />
            <span className="font-bodoni text-[16px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
          </div>
          
          <Link to="/seller/create-product" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-gold hover:text-white transition-colors duration-200">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Product
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-350 mx-auto px-5 sm:px-8 py-10 sm:py-14">
        
        {/* Page heading */}
        <div className="relative mb-12 animate-[fadeInUp_0.5s_ease_both]">
          <div className="absolute -top-6 -left-6 w-64 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-3 py-1.25 mb-5">
                <span className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
                <span className="font-inter text-[9px] font-bold tracking-[0.14em] text-gold uppercase">Seller Dashboard</span>
              </div>
              <h1 className="font-bodoni text-[36px] sm:text-[44px] font-bold tracking-tight text-white leading-[1.1]">
                Your Collection
              </h1>
              <p className="font-inter text-sm text-[#777] mt-2.5 leading-relaxed">
                Manage and view all the products you have listed on Velora.
              </p>
            </div>
            
            {/* Mobile Add Product Button */}
            <Link to="/seller/create-product" className="sm:hidden inline-flex items-center justify-center gap-2 w-full rounded-lg py-3.5 font-inter font-bold text-[11px] tracking-[0.18em] uppercase text-[#0a0a0a] bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold transition-all duration-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* ── Content States ── */}
        {error ? (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-400/25 rounded-lg px-5 py-4 animate-[fadeIn_0.5s_ease_both]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <h3 className="font-inter text-[13px] font-bold text-red-300 mb-1">Error Loading Products</h3>
              <p className="font-inter text-[12px] text-red-300/80">{error}</p>
            </div>
          </div>
        ) : isLoading ? (
          /* Loading Skeleton Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse bg-[#111] border border-white/5 rounded-xl overflow-hidden">
                <div className="aspect-3/4 bg-[#1a1a1a]" />
                <div className="p-5">
                  <div className="h-5 bg-[#1a1a1a] rounded w-3/4 mb-3" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-full mb-2" />
                  <div className="h-3 bg-[#1a1a1a] rounded w-2/3 mb-4" />
                  <div className="h-4 bg-gold/10 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center bg-[#111] border border-white/5 rounded-2xl py-24 px-6 text-center animate-[fadeIn_0.5s_ease_both]">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6 border border-white/5">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#555]">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </div>
            <h3 className="font-bodoni text-[28px] font-bold text-white mb-2">No Products Yet</h3>
            <p className="font-inter text-sm text-[#777] max-w-md mb-8 leading-relaxed">
              You haven't added any items to your Velora collection. Start building your digital catalog now.
            </p>
            <Link to="/seller/create-product" className="inline-flex items-center gap-2 rounded-lg px-8 py-3.5 font-inter font-bold text-[11px] tracking-[0.18em] uppercase text-[#0a0a0a] bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold transition-all duration-200">
              Create First Product
            </Link>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.1s]">
            {products.map((product) => {
              const coverImg = product.images?.[0]?.url
              return (
                <div onClick={() => {navigate(`/seller/product/${product._id}`)}} key={product._id} className="group relative bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/5 flex flex-col cursor-pointer">
                  
                  {/* Image Area */}
                  <div className="relative aspect-3/4 w-full bg-[#0e0e0e] overflow-hidden">
                    {coverImg ? (
                      <img 
                        src={coverImg} 
                        alt={product.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#333]">
                        No Image
                      </div>
                    )}
                    
                    {/* Top badging */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <div className="bg-black/60 backdrop-blur-md rounded px-2 py-1 border border-white/10">
                        <span className="font-bodoni text-[10px] font-bold text-white/90 tracking-widest uppercase">
                          VELORA
                        </span>
                      </div>
                    </div>
                    
                    {/* Image count badge */}
                    {product.images?.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md rounded px-2 py-1 flex items-center gap-1.5 border border-white/10">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span className="font-inter text-[9px] font-bold text-white/90">
                          {product.images.length}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bodoni text-[20px] font-bold text-white leading-tight tracking-tight mb-2 line-clamp-1 group-hover:text-gold transition-colors duration-200">
                      {product.title}
                    </h3>
                    
                    <p className="font-inter text-[12px] text-[#777] leading-relaxed mb-4 line-clamp-2 flex-1">
                      {product.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <span className="font-inter text-[9px] text-[#555] font-bold tracking-widest uppercase block mb-1">
                          Price
                        </span>
                        <p className="font-inter text-[16px] font-medium text-gold">
                          {formatPrice(product.price?.amount, product.price?.currency)}
                        </p>
                      </div>
                      
                      {/* Date added (optional formatting, showing short date) */}
                      <div className="text-right">
                        <span className="font-inter text-[9px] text-[#444] block">
                          Added
                        </span>
                        <span className="font-inter text-[10px] text-[#666]">
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )
            })}
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard
