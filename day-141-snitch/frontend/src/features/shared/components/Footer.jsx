import { Link } from "react-router";
import { ChevronDown, Copyright } from 'lucide-react';
import { FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useCurrency } from "../../cart/hooks/useCurrency.js";
import { useState } from "react";

const Footer = () => {

  const { selectedCurrency, handleChangeCurrency} = useCurrency()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [issubscribed, setIsSubscribed] = useState(false)

  const currencyLabels = {
    INR: "INDIA · INR (₹)",
    USD: "GLOBAL · USD ($)",
    EUR: "EUROPE · EUR (€)",
    GBP: "UK · GBP (£)",
    JPY: "JAPAN · JPY (¥)"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubscribed(true)
      setEmail("")
    }

    setTimeout(() => {
      setIsSubscribed(false)
    }, 5000);
  }

  return (
    <footer className="bg-[#0A0A0A] text-white border-t border-[#1A1A1A] pt-20 pb-10 px-6 sm:px-12 lg:px-20 w-full overflow-hidden print:hidden">
        <div className="max-w-xl mx-auto text-center flex items-center flex-col mb-20 sm:mb-24">
            <h2 className="font-serif text-lg sm:text-xl tracking-[0.18em] text-white font-normal uppercase mb-3">The Velora Circle</h2>
            <p className="font-sans text-xs sm:text-sm text-[#d0c5b5] leading-relaxed max-w-md mx-auto mb-8">Join our inner circle for early access to limited collections, private edits, and seasonal drops.</p>
            {issubscribed ? (
              <div className="w-full max-w-md py-4 border-b border-gold/40 flex flex-col items-center justify-center space-y-1.5 text-center transition-all duration-300">
                <h3 className="font-serif text-xs sm:text-sm text-gold tracking-[0.2em] uppercase font-semibold">WELCOME TO THE CIRCLE</h3>
                <p className="font-sans text-[11px] sm:text-xs text-[#888888] tracking-wide font-medium">Thank you for subscribing.</p>
              </div>
            ) : (
              <form
              onSubmit={handleSubmit}
              className="w-full max-w-md relative flex items-center border-b border-[#2A2A2A] focus-within:border-gold transition-colors duration-300 pb-2"
            >
              <input 
                type="email" 
                name="email" 
                placeholder="ENTER YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent font-sans text-xs sm:text-sm text-white placeholder-[#444444] tracking-wider outline-none py-1 pr-16" 
              />
              <button 
                className="absolute right-0 top-1/2 -translate-y-1/2 font-sans text-[11px] font-bold tracking-[0.2em] text-gold hover:text-[#E4C285] uppercase transition-[colors, transform] cursor-pointer active:scale-95 disabled:opacity-50"
              >
                JOIN
              </button>
            </form>
            )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-10">
          <div className="flex flex-col space-y-3">
            <h3 className="font-serif text-xs sm:text-sm tracking-[0.2em] text-white font-medium uppercase mb-5">The Atelier</h3>
            <Link to="/" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">New Arrivals</Link>
            <Link to="/" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Men's Edit</Link>
            <Link to="/" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Women's Atelier</Link>
            <Link to="/" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Limited Editions</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-serif text-xs sm:text-sm tracking-[0.2em] text-white font-medium uppercase mb-5">The House</h3>
            <Link to="/about" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Our Story</Link>
            <Link to="/about" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Craftsmanship</Link>
            <Link to="/about" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Sustainability</Link>
            <Link to="/about" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Press & Media</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-serif text-xs sm:text-sm tracking-[0.2em] text-white font-medium uppercase mb-5">Client Services</h3>
            <Link to="#" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Track Order</Link>
            <Link to="#" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Shipping & Delivery</Link>
            <Link to="#" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Returns & Exchanges</Link>
            <Link to="#" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Size Guide</Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-serif text-xs sm:text-sm tracking-[0.2em] text-white font-medium uppercase mb-5">Contact us</h3>
            <Link to="/contact" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Concierge Support</Link>
            <Link to="/contact" className="font-sans text-xs sm:text-[13px] text-[#777777] hover:text-gold transition-colors duration-200 tracking-wide w-fit">Boutique Appointments</Link>
            <a href="mailto:contact@velora.com" className="font-sans text-xs sm:text-[13px] text-gold hover:underline underline-offset-4 tracking-wide font-normal transition-all">contact@velora.com</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Copyright size={10} className="text-[#746e66]" />
            <p className="font-sans text-[10px] sm:text-[11px] text-[#746e66] tracking-[0.18em] uppercase text-center md:text-left">2026 velora. all rights reserved.</p>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram size={18} className="text-[#d0c5b5] hover:text-gold hover:scale-110 transition-all duration-200 cursor-pointer" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaXTwitter size={18} className="text-[#d0c5b5] hover:text-gold hover:scale-110 transition-all duration-200 cursor-pointer" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaYoutube size={18} className="text-[#d0c5b5] hover:text-gold hover:scale-110 transition-all duration-200 cursor-pointer" />
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 text-[10px] sm:text-[11px] font-sans tracking-widest text-[#746e66] uppercase">
            <Link to="#" className="hover:text-[#888888] transition-[transform, colors] cursor-pointer">Terms</Link>
            <Link to="#" className="hover:text-[#888888] transition-[transform, colors] cursor-pointer">Privacy</Link>
            <Link to="#" className="hover:text-[#888888] transition-[transform, colors] cursor-pointer">Cookies</Link>
            <div className="relative inline-flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 text-gold hover:text-[#E4C285] font-sans text-[10px] sm:text-[11px] font-medium tracking-widest uppercase transition-colors cursor-pointer" 
              >
                {currencyLabels[selectedCurrency] || selectedCurrency}
                <ChevronDown size={11} className={`${isOpen ? "rotate-180" : ""} transition-transform duration-200`} />
              </button>
              {isOpen && (
                <div className="absolute bottom-full right-0 mb-2.5 bg-[#111111] border border-[#2A2A2A] rounded-sm shadow-2xl py-1 min-w-40 z-50 flex flex-col">
                  <button 
                    onClick={() => {
                      handleChangeCurrency("INR");
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-2 text-left font-sans text-[11px] tracking-wider text-[#888888] hover:text-gold hover:bg-[#181818] transition-colors cursor-pointer w-full flex items-center justify-between"
                  >
                    INDIA · INR (₹)
                  </button>
                  <button 
                    onClick={() => {
                      handleChangeCurrency("USD");
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-2 text-left font-sans text-[11px] tracking-wider text-[#888888] hover:text-gold hover:bg-[#181818] transition-colors cursor-pointer w-full flex items-center justify-between"
                  >
                    GLOBAL · USD ($)
                  </button>
                  <button 
                    onClick={() => {
                      handleChangeCurrency("EUR");
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-2 text-left font-sans text-[11px] tracking-wider text-[#888888] hover:text-gold hover:bg-[#181818] transition-colors cursor-pointer w-full flex items-center justify-between"
                  >
                    EUROPE · EUR (€)
                  </button>
                  <button 
                    onClick={() => {
                      handleChangeCurrency("GBP");
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-2 text-left font-sans text-[11px] tracking-wider text-[#888888] hover:text-gold hover:bg-[#181818] transition-colors cursor-pointer w-full flex items-center justify-between"
                  >
                    UK · GBP (£)
                  </button>
                  <button 
                    onClick={() => {
                      handleChangeCurrency("JPY");
                      setIsOpen(false);
                    }}
                    className="px-3.5 py-2 text-left font-sans text-[11px] tracking-wider text-[#888888] hover:text-gold hover:bg-[#181818] transition-colors cursor-pointer w-full flex items-center justify-between"
                  >
                    JAPAN · JPY (¥)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </footer>
  )
}

export default Footer
