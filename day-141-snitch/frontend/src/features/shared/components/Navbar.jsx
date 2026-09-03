import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useCart } from '../../cart/hooks/useCart.js'
import { useAuth } from '../../auth/hook/useAuth.js'

const Navbar = () => {
  const { user } = useSelector(state => state.auth)
  const cartItems = useSelector(state => state.cart?.items || [])
  const { handleGetCart } = useCart()
  const { handleLogout } = useAuth()
  const {products} = useSelector(state => state.product)
  
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const location = useLocation()
  

  const navigate = useNavigate()

  const handleSearchBar = (e) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      navigate('/?search=' + encodeURIComponent(searchTerm))
    } else {
      navigate("/")
    }
  }

  useEffect(() => {
    if (location.search === "") {
      setSearchTerm("")
    }
  }, [location.search])

 const matchingProducts = searchTerm.trim()
  ? (products || [])
      .filter((product) => product.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5)
  : []
  

  // Close menus on route change
  useEffect(() => {
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [location.pathname])

  // Fetch cart items if user is logged in
  useEffect(() => {
    if (user) {
      handleGetCart()
    }
  }, [user])

  // Glassmorphism scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Dynamic Navigation Links based on User Role
  const navLinks = user?.role === 'seller' ? [
    { name: 'Home', path: '/seller/dashboard' },
    { name: 'List Product', path: '/seller/create-product' },
    { name: 'About', path: '/about' },
  ] : [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]

  const CURRENCY_SYMBOLS = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥"
  }

  return (
    <>
      <header 
        className={`${location.pathname === '/' ? 'fixed' : 'sticky'} top-0 inset-x-0 z-50 transition-all duration-300 print:hidden ${
          scrolled || location.pathname !== '/'
            ? 'bg-[#0c0c0c]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-350 mx-auto px-5 sm:px-8 flex items-center justify-between">
          
          {/* ── Left: Desktop Navigation ── */}
          <nav className="hidden md:flex items-center gap-8 flex-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-inter text-[11px] font-medium tracking-[0.15em] uppercase hover:text-white transition-colors duration-300 relative group ${isActive ? "text-white" : "text-[#888]"}`} 
                >
                  {link.name}
                  {/* Hover Indicator */}
                  <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px bg-gold transition-all duration-300 ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"}`} />
                </Link>
              )
            })}
          </nav>

          {/* ── Center: Logo ── */}
          <Link to="/" className="flex items-center justify-center gap-2.5 z-50 flex-1 md:flex-none">
            <img src="/logo.png" alt="Velora" className="h-6 sm:h-7 w-auto object-contain opacity-90 drop-shadow-md" />
            <span className="font-bodoni text-[18px] sm:text-[22px] font-bold tracking-[0.2em] text-white uppercase mt-0.5">Velora</span>
          </Link>

          {/* ── Right: Actions (Search, Cart & Profile) ── */}
          <div className="flex items-center justify-end gap-5 sm:gap-6 z-50 flex-1">
            
            {/* Search Bar */}
            <form 
              onSubmit={handleSearchBar}
              className="hidden lg:flex items-center relative group">
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setIsSearchOpen(true)
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-4 pr-10 text-[11px] font-inter text-white placeholder:text-[#555] focus:outline-none focus:border-gold/50 focus:bg-[#111] transition-all duration-300 w-48 focus:w-64"
              />
              <button className="absolute right-3 text-[#555] group-focus-within:text-gold transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>

              {isSearchOpen && searchTerm.trim() && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSearchOpen(false)} 
                />
              )}

              {isSearchOpen && searchTerm.trim() && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
                  {matchingProducts.length > 0 ? (
                    <>
                      {matchingProducts.map((product) => (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          onClick={() => {
                            setIsSearchOpen(false)
                            setSearchTerm("")
                          }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <img
                            src={product.images?.[0]?.url}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-md"
                          />

                          <div className="flex flex-col">
                            <span className="font-inter text-sm text-white">
                              {product.title}
                            </span>

                            <span className="font-inter text-xs text-[#B8A47A]">
                              {CURRENCY_SYMBOLS[product.price?.currency] || "₹"}
                              {Number(product.price?.amount).toLocaleString()}
                            </span>
                          </div>
                        </Link>
                      ))}

                      <Link
                        to={`/?search=${encodeURIComponent(searchTerm)}`}
                        onClick={() => {
                          setIsSearchOpen(false)
                        }}
                        className="block mt-3 pt-3 border-t border-white/10 text-center font-inter text-xs text-[#B8A47A] hover:text-white transition-colors"
                      >
                        View all results
                      </Link>
                    </>
                  ) : (
                    <p className="font-inter text-sm text-[#777] text-center py-4">
                      No matching pieces found.
                    </p>
                  )}
                </div>
              )}
            </form>

            {user ? (
              <>
                {/* Cart Icon (Only if logged in) */}
                <Link 
                  to="/cart" 
                  className="relative flex items-center justify-center p-2 text-[#ccc] hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  
                  {/* Cart Badge */}
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gold text-[#0a0a0a] text-[9px] font-bold font-inter h-4 min-w-4 flex items-center justify-center rounded-full px-1 border border-[#0c0c0c]">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {/* Profile Avatar & Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="w-8 h-8 rounded-full bg-linear-to-tr from-gold to-[#a88a53] flex items-center justify-center text-[#0a0a0a] font-bold font-inter text-[13px] shadow-[0_0_15px_rgba(201,169,110,0.2)] hover:scale-105 transition-transform cursor-pointer border border-gold/50"
                  >
                    {((user.fullname || 'U')[0]).toUpperCase()}
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsProfileOpen(false)} 
                      />
                      <div className="absolute top-12 right-0 w-64 bg-[#111] border border-white/10 rounded-2xl shadow-2xl p-5 z-50 animate-[fadeIn_0.2s_ease_both]">
                        <div className="flex flex-col items-center mb-4 pb-4 border-b border-white/5">
                          <div className="w-12 h-12 rounded-full bg-linear-to-tr from-gold to-[#a88a53] flex items-center justify-center text-[#0a0a0a] font-bold font-inter text-[20px] mb-3">
                            {((user.fullname || 'U')[0]).toUpperCase()}
                          </div>
                          <h4 className="font-inter font-bold text-white text-[14px] text-center">{user.fullname}</h4>
                          <p className="font-inter text-[11px] text-gold uppercase tracking-widest mt-1">{user.role}</p>
                        </div>
                        <div className="flex flex-col gap-3 font-inter text-[12px] mb-4 pb-4 border-b border-white/5">
                          <div>
                            <span className="text-[#555] block text-[10px] uppercase tracking-wider mb-0.5">Email</span>
                            <span className="text-[#ccc] truncate block">{user.email}</span>
                          </div>
                          {user.contact && (
                            <div>
                              <span className="text-[#555] block text-[10px] uppercase tracking-wider mb-0.5">Contact</span>
                              <span className="text-[#ccc] truncate block">{user.contact}</span>
                            </div>
                          )}
                        </div>

                        {/* Navigation & Actions */}
                        <div className="flex flex-col gap-1 pt-1">
                          <Link 
                            to="/profile/orders"
                            onClick={() => setIsProfileOpen(false)}
                            className="w-full font-inter text-[11px] font-semibold uppercase tracking-wider text-[#ccc] hover:text-gold hover:bg-white/5 px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <svg className="w-3.5 h-3.5 text-gold/80 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                              </svg>
                              <span>My Orders</span>
                            </div>
                            <span className="text-xs text-[#666] group-hover:text-gold group-hover:translate-x-0.5 transition-all">→</span>
                          </Link>

                          <button 
                            onClick={handleLogout}
                            className="w-full font-inter text-[11px] font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2.5 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                              <polyline points="16 17 21 12 16 7"></polyline>
                              <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-6">
                <Link to="/login" className="font-inter text-[11px] font-medium tracking-widest uppercase text-[#888] hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="inline-flex rounded-md px-5 py-2.5 font-inter font-bold text-[10px] tracking-[0.2em] uppercase text-[#0a0a0a] bg-gold hover:bg-[#b5955a] shadow-[0_0_15px_rgba(201,169,110,0.2)] transition-all transform hover:-translate-y-0.5">
                  Join Velora
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white ml-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {isMobileMenuOpen 
                  ? <path d="M18 6L6 18M6 6l12 12" /> 
                  : <path d="M4 8h16M4 16h16" />
                }
              </svg>
            </button>

          </div>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      <div 
        className={`fixed inset-0 z-40 bg-[#0c0c0c] transition-transform duration-500 ease-in-out md:hidden flex flex-col justify-center px-8 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8 text-center mt-20">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-bodoni text-[28px] hover:text-gold transition-colors ${isActive ? "text-gold font-bold" : "text-white"}`}
              >
                {link.name}
              </Link>
            )
          })}

          {user && user.role !== 'seller' && (
            <Link
              to="/profile/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-bodoni text-[28px] hover:text-gold transition-colors ${location.pathname === '/profile/orders' ? "text-gold font-bold" : "text-white"}`}
            >
              My Orders
            </Link>
          )}

          {!user && (
            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/5">
              <Link to="/login" className="font-inter text-[14px] font-medium tracking-widest uppercase text-[#888] hover:text-white">
                Sign In
              </Link>
              <Link to="/register" className="font-inter text-[14px] font-bold tracking-widest uppercase text-gold">
                Join Velora
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
