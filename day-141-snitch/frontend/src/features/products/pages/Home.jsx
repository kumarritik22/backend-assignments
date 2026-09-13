import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hooks/useProduct.js'
import { useTheme } from '../../shared/context/ThemeContext.jsx'

const Home = () => {
  const { products } = useSelector(state => state.product)
  const { handleGetAllProducts } = useProduct()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const { toggleTheme, isDark } = useTheme()

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
    <div className="min-h-screen bg-[#F6F5F2] dark:bg-[#0c0c0c] text-[#121212] dark:text-white selection:bg-gold/30 transition-colors duration-300">

      {/* ── Hero Section ── */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] pt-28 pb-20 sm:pt-32 sm:pb-24 flex items-center justify-center overflow-hidden border-b border-black/5 dark:border-white/5 bg-[#F6F5F2] dark:bg-[#0c0c0c] transition-colors duration-300">
        
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 bg-[#0c0c0c]">
          <img 
            src={isDark ? "/model-hero.png" : "/model-hero-light.png"}
            alt="Velora Collection" 
            className="w-full h-full object-cover object-top opacity-100 dark:opacity-85 scale-105 animate-[kenBurns_20s_ease-out_forwards] transition-opacity duration-500"
            onError={(e) => { e.target.src = '/login-model.png' }}
          />

          <div className="absolute inset-0 hidden dark:block bg-linear-to-b from-[#0c0c0c]/50 via-transparent to-transparent" />
          <div className="absolute inset-0 hidden dark:block bg-linear-to-r from-[#0c0c0c]/80 via-[#0c0c0c]/20 to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-10 sm:h-12 bg-linear-to-t from-[#F6F5F2] dark:from-[#0c0c0c] to-transparent pointer-events-none opacity-80" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-350 w-full mx-auto px-6 sm:px-12 lg:px-16 flex flex-col items-start text-left animate-[fadeInUp_1s_ease_both]">
          <div className="max-w-95 sm:max-w-110 lg:max-w-120">
            
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gold" />
              <span className="font-inter text-[10px] font-bold tracking-[0.25em] text-gold-dark uppercase">New Arrivals</span>
              <span className="w-8 h-px bg-gold" />
            </div>

            <h1 className="font-bodoni text-[36px] sm:text-[46px] lg:text-[54px] font-bold text-[#121212] dark:text-white leading-[1.08] tracking-tight mb-5 drop-shadow-[0_2px_15px_rgba(255,255,255,0.85)] dark:drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              Redefining<br />Modern Luxury.
            </h1>

            <p className="font-inter text-xs sm:text-sm text-[#121212] dark:text-white/90 max-w-sm leading-relaxed mb-8 font-medium drop-shadow-[0_1px_12px_rgba(255,255,255,0.9)] dark:drop-shadow-none">
              Discover curated fashion for those who refuse to blend in. The new season collection is here.
            </p>

            <button 
              onClick={() => document.getElementById('collection').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 rounded-full border border-black/30 dark:border-white/25 bg-white/40 dark:bg-transparent backdrop-blur-xs px-8 py-3.5 font-inter text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] dark:text-white hover:border-gold hover:bg-gold hover:text-black transition-all duration-300 cursor-pointer shadow-sm"
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
      <section id="collection" className="py-20 sm:py-32 px-5 sm:px-10 max-w-350 mx-auto bg-[#F6F5F2] dark:bg-[#0c0c0c] transition-colors duration-300">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-bodoni text-[32px] sm:text-[40px] font-bold text-[#121212] dark:text-white leading-tight mb-3">
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
                <p className="font-inter text-sm text-[#636059] dark:text-[#777] max-w-md leading-relaxed">
                  Hand-picked pieces designed to elevate your everyday aesthetic.
                </p>
              </>
            )}
          </div>
          
          <div className="flex gap-4">
            <span className="font-inter text-[11px] tracking-widest text-[#7A766F] dark:text-[#555] uppercase border-b border-gold/30 pb-1">
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
                <div key={product._id} className="group relative flex flex-col bg-white dark:bg-[#141414] border border-black/5 dark:border-white/5 rounded-xl p-3 hover:border-gold/30 hover:shadow-[0_10px_40px_rgba(201,169,110,0.08)] shadow-sm dark:shadow-none transition-all duration-300">
                  
                  {/* Image Container */}
                  <div className="relative aspect-3/4 w-full bg-white dark:bg-[#0e0e0e] rounded-lg overflow-hidden mb-5">
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
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center justify-center bg-black/70 backdrop-blur-md px-2 py-1.25 rounded-[3px] border border-gold/35">
                      <span className="font-inter text-[8.5px] font-bold text-gold uppercase tracking-[0.18em] leading-none pl-[0.18em]">
                        NEW
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-center px-2">
                    <h3 className="font-bodoni text-[17px] sm:text-[18px] font-bold text-[#121212] dark:text-white mb-1.5 line-clamp-2 leading-snug transition-colors group-hover:text-gold">
                      {product.title}
                    </h3>
                    <p className="font-inter text-[15px] font-semibold text-gold">
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
