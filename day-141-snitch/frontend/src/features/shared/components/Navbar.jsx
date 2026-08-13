import { Link } from "react-router";

const Navbar = () => {
  return (
    <div>
        <header className="sticky top-0 z-30 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-gold/10 px-5 sm:px-8 py-4">
            <div className="max-w-350 mx-auto flex items-center justify-between">
                <Link to="/" className="inline-flex items-center gap-2 font-inter text-[12px] text-[#666] hover:text-gold transition-colors duration-200 group">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:-translate-x-0.5">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Back
                </Link>
                <Link to="/" className="flex items-center gap-2.5">
                    <img src="/logo.png" alt="Velora Logo" className="h-6 w-auto object-contain opacity-90 drop-shadow-md" />
                    <span className="font-bodoni text-[18px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
                </Link>
                <div className="w-16" /> {/* Spacer for precise centering */}
            </div>
        </header>
    </div>
  )
}

export default Navbar
