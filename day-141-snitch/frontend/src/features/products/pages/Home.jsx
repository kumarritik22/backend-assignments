import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/useProduct.js'

const Home = () => {
  const { products } = useSelector(state => state.product)
  const { user } = useSelector(state => state.auth)
  const { handleGetAllProducts } = useProduct()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const navigate = useNavigate()

  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get("search") || ""

  const filteredProducts = searchQuery ? products.filter((product) => {
    return product.title.toLowerCase().includes(searchQuery.toLowerCase())
  }) : products

  useEffect(() => {
    if (searchQuery) {
      const element = document.getElementById("collection")
      
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" }) 
        }, 100);

        return () => clearTimeout(timer)
      }
    }
  }, [searchQuery])
  


  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError('')
    try {
      await handleGetAllProducts()
    } catch (err) {
      console.error(err)
      setError('Unable to load the collection at this time.')
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
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30">

      {/* ── Hero Section ── */}
      <section className="relative w-full h-[70vh] min-h-125 flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0">
          <img 
            src="/model-hero.png" 
            alt="Velora Collection" 
            className="w-full h-full object-cover object-top opacity-70 scale-105 animate-[kenBurns_20s_ease-out_forwards]"
            onError={(e) => { e.target.src = '/login-model.png' }} // Fallback if model-hero missing
          />
          <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0c]/60 via-transparent to-[#0c0c0c]" />
          <div className="absolute inset-0 bg-linear-to-r from-[#0c0c0c]/80 via-[#0c0c0c]/20 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto animate-[fadeInUp_1s_ease_both]">
          {/* Subtle gold glow behind hero text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-8 h-px bg-gold/50" />
            <span className="font-inter text-[10px] font-bold tracking-[0.2em] text-gold uppercase">New Arrivals</span>
            <span className="w-8 h-px bg-gold/50" />
          </div>
          <h1 className="font-bodoni text-[50px] sm:text-[70px] lg:text-[85px] font-bold text-white leading-[1.05] tracking-tight mb-6 drop-shadow-2xl">
            Redefining<br className="hidden sm:block" /> Modern Luxury.
          </h1>
          <p className="font-inter text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed mb-10 font-light">
            Discover curated fashion for those who refuse to blend in. The new season collection is here.
          </p>
          <button 
            onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-3 rounded-full border border-white/20 px-8 py-4 font-inter text-[11px] font-bold tracking-[0.2em] uppercase text-white hover:border-gold hover:bg-gold/10 hover:text-gold transition-all duration-300"
          >
            Explore Collection
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </button>
          </div>
        </div>
      </section>

      {/* ── Featured Collection Grid ── */}
      <section id="collection" className="py-20 sm:py-32 px-5 sm:px-10 max-w-350 mx-auto bg-[#0c0c0c]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-bodoni text-[32px] sm:text-[40px] font-bold text-white leading-tight mb-3">
              {searchQuery ? `Search results for "${searchQuery}"` : "Curated Selection"}
            </h2>
            {searchQuery ? (
              <>
                <p className="font-inter text-sm text-[#777] max-w-md leading-relaxed">
                  Showing curated pieces matching your search query.
                </p>
              </>
            ) : (
              <>
                <p className="font-inter text-sm text-[#777] max-w-md leading-relaxed">
                  Hand-picked pieces designed to elevate your everyday aesthetic.
                </p>
              </>
            )}
          </div>
          
          <div className="flex gap-4">
            <span className="font-inter text-[11px] tracking-widest text-[#555] uppercase border-b border-gold/30 pb-1 pb">
              {searchQuery
                ? `${filteredProducts.length} RESULTS FOUND`
                : `All Products (${filteredProducts.length})`
              }
            </span>
            {searchQuery && (
              <button 
                onClick={() => navigate("/")}
                className="font-inter text-[10px] tracking-widest text-gold hover:text-white uppercase transition-all cursor-pointer bg-white/5 border border-gold/40 hover:border-gold hover:bg-gold/10 px-3.5 py-1 rounded-full flex items-center gap-1.5 active:scale-95"
              >
                Clear Search X
              </button>
            )}
          </div>
        </div>

        {/* ── Content States ── */}
        {error ? (
          <div className="flex items-center justify-center py-20">
            <p className="font-inter text-sm text-red-400">{error}</p>
          </div>
        ) : isLoading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse">
                <div className="aspect-3/4 bg-[#111] rounded-lg mb-4" />
                <div className="h-5 bg-[#111] rounded w-3/4 mb-2" />
                <div className="h-4 bg-[#111] rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 border border-white/5 rounded-2xl bg-[#0e0e0e]">
            {searchQuery ? (
              <>
                <h3 className="font-bodoni text-[28px] font-bold text-white mb-2">
                  No Pieces Found
                </h3>

                <p className="font-inter text-sm text-[#777] max-w-md mx-auto mb-6">
                  We couldn't find any items matching "{searchQuery}". Try searching
                  for another item or view our full collection.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gold text-[#0a0a0a] font-inter text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-[#b5955a] shadow-[0_0_15px_rgba(201,169,110,0.2)] transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-95"
                >
                  Explore All Pieces
                </button>
              </>
            ) : (
              <>
                <h3 className="font-bodoni text-[28px] font-bold text-white mb-2">
                  Coming Soon
                </h3>

                <p className="font-inter text-sm text-[#777]">
                  Our curators are currently preparing the new collection.
                </p>
              </>
            )}
          </div>
        ) : (
          /* Public Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => {
              const coverImg = product.images?.[0]?.url
              return (
                <div key={product._id} className="group relative flex flex-col bg-[#141414] border border-white/5 rounded-xl p-3 hover:border-gold/30 hover:shadow-[0_10px_40px_rgba(201,169,110,0.05)] transition-all duration-300">
                  
                  {/* Image Container */}
                  <div className="relative aspect-3/4 w-full bg-[#0e0e0e] rounded-lg overflow-hidden mb-5">
                    {coverImg ? (
                      <img 
                        src={coverImg} 
                        alt={product.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#333]">
                        Velora
                      </div>
                    )}
                    
                    {/* Hover Overlay — Quick Add */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                      <button onClick={() => navigate(`/product/${product._id}`)} 
                      className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-8 py-3 rounded-full font-inter text-[11px] font-bold tracking-[0.15em] uppercase cursor-pointer hover:bg-gold hover:text-white">
                        View Details
                      </button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded">
                      <span className="font-inter text-[9px] font-bold text-gold uppercase tracking-[0.2em]">
                        New
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-center px-2">
                    <h3 className="font-bodoni text-[18px] font-bold text-white mb-1.5 line-clamp-1 transition-colors group-hover:text-gold">
                      {product.title}
                    </h3>
                    <p className="font-inter text-[14px] font-medium text-[#888]">
                      {formatPrice(product.price?.amount, product.price?.currency)}
                    </p>
                  </div>
                  
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
