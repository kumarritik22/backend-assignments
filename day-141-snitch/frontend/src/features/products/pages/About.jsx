import React, { useEffect } from 'react'
import { Link } from 'react-router'

const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-gold/30">
      
      {/* ── Hero Section ── */}
      <section className="relative w-full py-32 sm:py-40 flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-linear-to-b from-[#0c0c0c] via-[#0c0c0c]/80 to-[#0c0c0c]" />
        </div>
        
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto animate-[fadeInUp_1s_ease_both]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-gold/50" />
            <span className="font-inter text-[10px] font-bold tracking-[0.3em] text-gold uppercase">Our Philosophy</span>
            <span className="w-12 h-px bg-gold/50" />
          </div>
          
          <h1 className="font-bodoni text-[45px] sm:text-[65px] lg:text-[80px] font-bold text-white leading-[1.1] tracking-tight mb-8 drop-shadow-xl">
            The Art of <br className="hidden sm:block" /> Subtle Luxury.
          </h1>
          
          <p className="font-inter text-[15px] sm:text-[16px] text-white/60 max-w-2xl mx-auto leading-relaxed font-light">
            Velora was founded on a singular belief: true luxury doesn't shout. It speaks through uncompromising craftsmanship, precise tailoring, and a quiet confidence that transcends seasonal trends.
          </p>
        </div>
      </section>

      {/* ── Story Section ── */}
      <section className="py-24 sm:py-32 px-5 sm:px-10 max-w-300 mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Left: Text */}
          <div className="flex-1 space-y-10">
            <div>
              <h2 className="font-bodoni text-[32px] sm:text-[40px] font-bold text-white leading-tight mb-6">
                Craftsmanship <br /> Without Compromise.
              </h2>
              <p className="font-inter text-[14px] text-[#888] leading-[1.8] font-light">
                Every garment in the Velora collection is a testament to meticulous attention to detail. We partner exclusively with boutique ateliers and source only the finest sustainable materials to ensure that what you wear feels as exceptional as it looks.
              </p>
            </div>
            
            <div className="pl-6 border-l border-gold/30">
              <p className="font-bodoni italic text-[20px] text-white/90 leading-relaxed">
                "Fashion is temporary, but style and quality endure. We don't just design clothes; we engineer confidence."
              </p>
            </div>
          </div>
          
          {/* Right: Editorial Image */}
          <div className="flex-1 w-full relative">
            <div className="aspect-3/4 sm:aspect-4/5 bg-[#111] border border-white/5 rounded-2xl overflow-hidden relative group">
              <img 
                src="/about-model.jpg" 
                alt="Velora Editorial" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Floating detail box */}
            <div className="absolute -bottom-8 -left-8 sm:-left-12 bg-[#0c0c0c] border border-gold/20 p-6 sm:p-8 rounded-xl shadow-2xl backdrop-blur-xl">
              <span className="block font-bodoni text-[24px] text-white font-bold mb-1">Est. 2024</span>
              <span className="font-inter text-[10px] text-gold uppercase tracking-[0.2em]">Global Design Studio</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Values Grid ── */}
      <section className="py-24 sm:py-32 bg-[#050505] border-t border-white/5">
        <div className="max-w-300 mx-auto px-5 sm:px-10">
          
          <div className="text-center mb-20">
            <h2 className="font-bodoni text-[32px] font-bold text-white mb-4">Our Core Pillars</h2>
            <p className="font-inter text-[13px] text-[#666] uppercase tracking-[0.2em]">What defines the Velora standard</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8">
            {/* Pillar 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                <span className="font-bodoni text-[20px] text-gold italic">01</span>
              </div>
              <h3 className="font-bodoni text-[18px] font-bold text-white mb-3">Sartorial Precision</h3>
              <p className="font-inter text-[13px] text-[#777] leading-relaxed max-w-xs mx-auto">
                Precision cut, tailored perfectly. Our silhouettes are mathematically designed to flatter and empower the modern individual.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                <span className="font-bodoni text-[20px] text-gold italic">02</span>
              </div>
              <h3 className="font-bodoni text-[18px] font-bold text-white mb-3">Ethical Sourcing</h3>
              <p className="font-inter text-[13px] text-[#777] leading-relaxed max-w-xs mx-auto">
                Luxury shouldn't cost the earth. We use sustainably sourced fabrics and maintain a transparent, ethical supply chain.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-500">
                <span className="font-bodoni text-[20px] text-gold italic">03</span>
              </div>
              <h3 className="font-bodoni text-[18px] font-bold text-white mb-3">Timeless Aesthetics</h3>
              <p className="font-inter text-[13px] text-[#777] leading-relaxed max-w-xs mx-auto">
                We ignore fast fashion. Our pieces are designed as investments-wardrobe staples that will remain relevant for decades.
              </p>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── Call to Action ── */}
      <section className="py-32 px-5 text-center relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-bodoni text-[36px] font-bold text-white mb-6">Ready to redefine your wardrobe?</h2>
          <Link 
            to="/"
            className="inline-flex items-center justify-center gap-3 rounded-full border border-gold px-10 py-4 font-inter text-[11px] font-bold tracking-[0.2em] uppercase text-white hover:bg-gold hover:text-[#0a0a0a] transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.15)]"
          >
            Explore Collections
          </Link>
        </div>
      </section>
      
    </div>
  )
}

export default About
