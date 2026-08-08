import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/useProduct'

const Home = () => {
  const { products } = useSelector(state => state.product)
  const { user } = useSelector(state => state.auth)
  const { handleGetAllProducts } = useProduct()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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

      {/* ── Minimal Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0c0c0c]/80 backdrop-blur-md border-b border-gold/10 px-5 sm:px-10 py-4">
        <div className="max-w-350 mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Velora Logo" className="h-6 sm:h-7 w-auto object-contain opacity-90 drop-shadow-md" />
            <span className="font-bodoni text-[18px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
          </Link>
          
          {/* Auth/Profile Action Links */}
          {user ? (
            <div className="flex items-center gap-4 relative">
              <span className="font-inter text-[12px] font-medium text-[#ccc] hidden sm:block">
                {user.fullname || 'Profile'}
              </span>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-linear-to-tr from-gold to-gold-dark flex items-center justify-center text-[#0a0a0a] font-bold font-inter text-[13px] shadow-[0_0_15px_rgba(201,169,110,0.3)] hover:scale-105 transition-transform cursor-pointer"
              >
                {((user.fullname || 'U')[0]).toUpperCase()}
              </button>
              
              {user.role === 'seller' ? (
                <Link to="/seller/dashboard" className="hidden sm:inline-flex rounded-full border border-white/10 px-4 py-1.5 font-inter font-bold text-[10px] tracking-[0.15em] uppercase text-white hover:border-gold hover:text-gold transition-colors ml-2">
                  Dashboard
                </Link>
              ) : null}

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-64 bg-[#111] border border-white/10 rounded-xl shadow-2xl p-5 z-50 animate-[fadeIn_0.2s_ease_both]">
                  <div className="flex flex-col items-center mb-4 pb-4 border-b border-white/5">
                    <div className="w-12 h-12 rounded-full bg-linear-to-tr from-gold to-gold-dark flex items-center justify-center text-[#0a0a0a] font-bold font-inter text-[20px] mb-3">
                      {((user.fullname || 'U')[0]).toUpperCase()}
                    </div>
                    <h4 className="font-inter font-bold text-white text-[14px] text-center">{user.fullname}</h4>
                    <p className="font-inter text-[11px] text-gold uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                  <div className="flex flex-col gap-3 font-inter text-[12px]">
                    <div>
                      <span className="text-[#555] block text-[10px] uppercase tracking-wider mb-0.5">Email</span>
                      <span className="text-[#ccc] truncate block">{user.email}</span>
                    </div>
                    {user.contact && (
                      <div>
                        <span className="text-[#555] block text-[10px] uppercase tracking-wider mb-0.5">Contact</span>
                        <span className="text-[#ccc]">{user.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-6 sm:gap-8">
              <Link to="/login" className="font-inter text-[11px] font-medium tracking-widest uppercase text-[#888] hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="hidden sm:inline-flex rounded px-5 py-2 font-inter font-bold text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a] bg-gold hover:bg-gold-light shadow-[0_0_15px_rgba(201,169,110,0.2)] transition-colors">
                Join Velora
              </Link>
            </div>
          )}
        </div>
      </nav>

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
              Curated Selection
            </h2>
            <p className="font-inter text-sm text-[#777] max-w-md leading-relaxed">
              Hand-picked pieces designed to elevate your everyday aesthetic.
            </p>
          </div>
          
          <div className="flex gap-4">
            <span className="font-inter text-[11px] tracking-widest text-[#555] uppercase border-b border-gold/30 pb-1 pb">
              All Products ({products.length})
            </span>
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
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-32 border border-white/5 rounded-2xl bg-[#0e0e0e]">
            <h3 className="font-bodoni text-[28px] font-bold text-white mb-2">Coming Soon</h3>
            <p className="font-inter text-sm text-[#777]">Our curators are currently preparing the new collection.</p>
          </div>
        ) : (
          /* Public Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((product) => {
              const coverImg = product.images?.[0]?.url
              return (
                <div key={product._id} className="group relative flex flex-col cursor-pointer bg-[#141414] border border-white/5 rounded-xl p-3 hover:border-gold/30 hover:shadow-[0_10px_40px_rgba(201,169,110,0.05)] transition-all duration-300">
                  
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
                      <button className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-black px-8 py-3 rounded-full font-inter text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-gold hover:text-white">
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

      {/* ── Footer ── */}
      <footer className="border-t border-white/5 py-12 bg-[#050505]">
        <div className="max-w-350 mx-auto px-5 sm:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Velora" className="h-5 w-auto opacity-50 grayscale" />
          </div>
          <p className="font-inter text-[11px] text-[#555] uppercase tracking-widest">
            © {new Date().getFullYear()} Velora Studios. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Instagram', 'Twitter', 'Pinterest'].map(link => (
              <a key={link} href="#" className="font-inter text-[11px] text-[#555] hover:text-gold transition-colors uppercase tracking-widest">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Home
