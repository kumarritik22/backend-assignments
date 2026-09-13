import { Link, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { ArrowLeft, Home } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const isSeller = user?.role === 'seller'

  return (
    <div className="min-h-[82vh] flex items-center justify-center relative py-16 sm:py-24 px-5 sm:px-8 overflow-hidden bg-[#F6F5F2] dark:bg-[#0c0c0c] text-[#121212] dark:text-white transition-colors duration-300">
      
      {/* Background ambient radial glow in crimson error tint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-125 lg:w-170 h-80 sm:h-125 lg:h-170 bg-red-500/10 dark:bg-red-500/5 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Overline Error Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 dark:border-red-500/40 bg-red-500/10 dark:bg-red-500/10 mb-5 backdrop-blur-sm animate-[fadeInUp_0.6s_ease_both]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-inter text-[10px] sm:text-[11px] tracking-[0.25em] font-semibold uppercase text-red-600 dark:text-red-400">
            Error 404 &bull; Page Not Found
          </span>
        </div>

        {/* Large Artistic 404 Display in Crimson Red */}
        <div className="relative select-none my-1 animate-[fadeInUp_0.8s_ease_both]">
          <h1 className="font-bodoni text-[95px] sm:text-[150px] lg:text-[185px] leading-none font-bold tracking-tighter bg-linear-to-b from-red-500 via-rose-600 to-red-700 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_0_40px_rgba(239,68,68,0.28)]">
            404
          </h1>
          {/* Hairline architectural separator */}
          <div className="w-16 sm:w-20 h-px bg-red-500/50 mx-auto mt-2 sm:mt-0 mb-6" />
        </div>

        {/* Clear Headline */}
        <h2 className="font-bodoni text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[0.14em] uppercase text-[#121212] dark:text-white mb-4 animate-[fadeInUp_1s_ease_both]">
          Page Not Found
        </h2>

        {/* Subtitle Description */}
        <p className="max-w-lg text-[13px] sm:text-[15px] text-[#636059] dark:text-white/60 font-inter font-light leading-relaxed tracking-wide mb-10 px-4 animate-[fadeInUp_1.1s_ease_both]">
          The page, garment, or collection you are looking for does not exist, has been removed, or has moved to our archives.
        </p>

        {/* Action Buttons: Return Home & Go Back */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-14 sm:mb-16 animate-[fadeInUp_1.2s_ease_both]">
          <Link
            to={isSeller ? "/seller/dashboard" : "/"}
            className="w-full sm:w-auto min-w-47.5 px-8 py-3.5 bg-gold hover:bg-gold-light text-[#0A0A0A] font-inter text-xs font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(201,169,110,0.25)] hover:shadow-[0_6px_28px_rgba(201,169,110,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>{isSeller ? "Seller Dashboard" : "Return Home"}</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto min-w-47.5 px-8 py-3.5 border border-black/15 dark:border-white/20 hover:border-gold dark:hover:border-gold text-[#121212] dark:text-white hover:text-gold dark:hover:text-gold font-inter text-xs font-medium tracking-[0.2em] uppercase rounded-full transition-all duration-300 hover:-translate-y-0.5 bg-black/2 dark:bg-white/2 cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Curated Atelier Discovery Links */}
        <div className="w-full pt-8 border-t border-black/10 dark:border-white/10 animate-[fadeInUp_1.3s_ease_both]">
          <span className="block font-inter text-[10px] tracking-[0.3em] uppercase text-gold font-semibold mb-5">
            Curated Atelier Navigation
          </span>

          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-8 font-inter text-[11px] sm:text-xs font-medium tracking-[0.18em] uppercase text-[#636059] dark:text-white/60">
            <Link to="/" className="hover:text-gold dark:hover:text-gold transition-colors duration-200 py-1">
              Collections
            </Link>
            <span className="text-black/20 dark:text-white/20 hidden sm:inline">&bull;</span>
            
            <Link to="/about" className="hover:text-gold dark:hover:text-gold transition-colors duration-200 py-1">
              Our Story
            </Link>
            <span className="text-black/20 dark:text-white/20 hidden sm:inline">&bull;</span>

            <Link to="/contact" className="hover:text-gold dark:hover:text-gold transition-colors duration-200 py-1">
              Concierge
            </Link>
            
            {!isSeller && (
              <>
                <span className="text-black/20 dark:text-white/20 hidden sm:inline">&bull;</span>
                <Link to="/cart" className="hover:text-gold dark:hover:text-gold transition-colors duration-200 py-1">
                  Shopping Bag
                </Link>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default NotFound
