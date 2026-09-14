import { useEffect, useState } from 'react'
import { useAuth } from '../hook/useAuth.js'
import { Link, useNavigate } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle.jsx'
import { CheckCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setError } from '../state/auth.slice.js'
import { useTheme } from '../../shared/context/ThemeContext.jsx'

const InputField = ({ id, label, type = 'text', name, placeholder, value, onChange, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className={`font-inter text-[10px] font-bold uppercase tracking-widest ${error ? 'text-red-500 dark:text-red-400' : 'text-[#8C703B] dark:text-gold'}`}
    >
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        id={id} name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-lg px-4 py-2.75 text-sm font-light font-inter',
          'bg-white dark:bg-[#1a1a1a] text-[#121212] dark:text-white placeholder-[#9E9B95] dark:placeholder-[#3d3d3d] shadow-xs',
          'border outline-none transition-all duration-200',
          'focus:border-gold focus:ring-2 focus:ring-gold/10',
          error ? 'border-red-400/70 ring-2 ring-red-400/10' : 'border-black/10 dark:border-[#252525]',
          children ? 'pr-11' : '',
        ].join(' ')}
      />
      {children}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" className="font-inter text-[11px] text-red-500 dark:text-red-400">{error}</p>
    )}
  </div>
)

const Register = () => {

  const {handleRegister} = useAuth()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const error = useSelector(state => state.auth.error);
  const loading = useSelector(state => state.auth.loading);

  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  
  const [formData, setFormData] = useState({ 
    fullName: '', 
    email: '', 
    contactNumber: '', 
    password: '',
    isSeller: isSeller
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!formData.fullName.trim())      err.fullName      = 'Full name is required'
    if (!formData.email.trim())         err.email         = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = 'Invalid email address'
    if (!formData.contactNumber.trim()) err.contactNumber = 'Contact number is required'
    else if (!/^\+?[\d\s\-(). ]{7,15}$/.test(formData.contactNumber)) err.contactNumber = 'Invalid number'
    if (!formData.password)             err.password      = 'Password is required'
    else if (formData.password.length < 8) err.password   = 'Minimum 8 characters'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const ve = validate()

    if (Object.keys(ve).length) { 
      setErrors(ve) 
      return 
    }
    
    const result = await handleRegister({
      fullname: formData.fullName,
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: isSeller
    })

    if (Array.isArray(result)) {
      const backendErrors = {}

      result.forEach((error) => {
        if (error.path === "fullname") {
          backendErrors.fullName = error.msg
        } else if (error.path === "contact") {
          backendErrors.contactNumber = error.msg
        } else {
          backendErrors[error.path] = error.msg
        }
      })

      setErrors(backendErrors)

    } else if (result) {
      setIsRegistered(true)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setError(null))  
    }
  }, [])

  return (
    <main className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#F6F5F2] dark:bg-[#0a0a0a]">

        {/* LEFT — Brand / Model */}
        <section
          aria-label="Velora brand panel"
          className="relative w-full h-72 sm:h-80 md:h-96 lg:w-[48%] lg:h-full shrink-0 overflow-hidden"
        >
          <img
            src={isDark ? "/register-model.png" : "/register-model-light.png"}
            alt="Velora fashion model"
            className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
          />

          {/* Overlays — active only in dark mode to blend with dark theme */}
          <div className="hidden dark:block absolute inset-0 bg-linear-to-r from-black/20 via-transparent to-transparent dark:from-[#0a0a0a]/35" />
          <div className="hidden dark:block absolute inset-0 bg-linear-to-b from-black/30 via-transparent to-black/85" />

          {/* Bottom gradient fade — only covers the bottom so model's upper body stays 100% bright */}
          <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44 lg:h-84 bg-linear-to-t from-black/85 via-black/45 to-transparent pointer-events-none" />

          {/* Logo — Ultra-Translucent Glass Emblem Badge */}
          <Link 
            to="/" 
            className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-7 lg:left-7 z-10 flex items-center gap-2 sm:gap-2.5 px-3 py-1.25 rounded-full bg-white/35 dark:bg-black/40 backdrop-blur-xl border border-white/60 dark:border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.04)] group hover:scale-[1.02] transition-all"
          >
            <img src="/logo.png" alt="Velora Logo" className="h-5 sm:h-6 w-auto object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="font-bodoni text-sm sm:text-base font-bold tracking-[0.2em] text-[#121212] dark:text-white uppercase transition-colors">
              Velora
            </span>
          </Link>

          {/* Bottom brand copy — responsive editorial layout */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-9 lg:pb-10">
            <div className="w-6 lg:w-9 h-0.5 bg-gold mb-1.5 lg:mb-4 rounded-full" />
            <h2 className="font-bodoni text-[18px] sm:text-[24px] lg:text-[38px] font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
              Wear Your<br className="hidden lg:inline" /> <span className="text-gold">Identity.</span>
            </h2>
            <p className="font-inter text-[10.5px] sm:text-xs lg:text-sm text-white/80 mt-1 lg:mt-2 font-light leading-relaxed max-w-65 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] line-clamp-1 sm:line-clamp-none">
              Curated fashion for those who refuse to blend in.
            </p>
            <div className="flex gap-4 sm:gap-6 mt-2 lg:mt-4 pt-2 lg:pt-0 border-t border-white/15 lg:border-t-0">
              {[['50K+', 'Customers'], ['2K+', 'Styles'], ['4.9★', 'Rating']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-inter text-xs sm:text-sm font-bold text-gold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{n}</div>
                  <div className="font-inter text-[7.5px] sm:text-[9px] text-white/75 tracking-widest uppercase mt-0.5 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* RIGHT — Registration Form or Success Message */}
      <section className="flex-1 flex flex-col bg-[#F6F5F2] dark:bg-[#111] lg:border-l border-black/5 dark:border-white/5 overflow-y-auto px-6 sm:px-10 md:px-14 lg:px-10 xl:px-14">
        <div className="w-full max-w-97.5 mx-auto my-auto py-10">
          
          {isRegistered ? (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-fade-in-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
                <CheckCircle className="w-20 h-20 text-gold relative z-10" strokeWidth={1.5} />
              </div>
              <h2 className="font-bodoni text-[30px] sm:text-[34px] font-bold tracking-tight text-[#121212] dark:text-white leading-[1.15]">
                Check your inbox
              </h2>
              <p className="font-inter text-[14px] text-[#636059] dark:text-[#888] max-w-sm">
                We've sent a verification link to <span className="text-[#121212] dark:text-white font-medium">{formData.email}</span>. Please click the link to activate your account.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 px-8 py-3 bg-linear-to-r from-gold to-gold-dark text-[#0a0a0a] font-inter font-bold text-[11px] tracking-[0.18em] uppercase rounded-lg hover:from-gold-light hover:to-gold transition-all duration-200 cursor-pointer shadow-md shadow-gold/10 active:scale-95"
              >
                PROCEED TO LOGIN
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-7 animate-[fadeInUp_0.5s_ease_both]">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-3 py-1.25 mb-4">
                  <span className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
                  <span className="font-inter text-[9px] font-bold tracking-[0.14em] text-gold uppercase">Join Velora</span>
                </div>
                <h1 className="font-bodoni text-[30px] sm:text-[34px] font-bold tracking-tight text-[#121212] dark:text-white leading-[1.15]">
                  Create Account
                </h1>
                <p className="font-inter text-[13px] text-[#636059] dark:text-[#777] mt-2 leading-relaxed">
                  Already have an account?{' '}
                  <Link to="/login" id="sign-in-link" className="text-gold font-medium no-underline hover:underline underline-offset-2 transition-all">
                    Sign in →
                  </Link>
                </p>
              </div>

              {error && (
                <div className="mb-5 flex items-center gap-3 rounded-md border border-red-500/20 bg-red-500/10 dark:bg-red-400/5 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500/40 text-[11px] font-bold">
                        !
                    </span>
                    <p>{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.25">

                <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.07s] [animation-fill-mode:both]">
                  <InputField id="fullName" label="Full Name" name="fullName" placeholder="e.g. Virat Kohli"
                    value={formData.fullName} onChange={handleChange} error={errors.fullName} />
                </div>

                <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.13s] [animation-fill-mode:both]">
                  <InputField id="email" label="Email Address" type="email" name="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} error={errors.email} />
                </div>

                <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.19s] [animation-fill-mode:both]">
                  <InputField id="contactNumber" label="Contact Number" type="tel" name="contactNumber" placeholder="+91 98765 43210"
                    value={formData.contactNumber} onChange={handleChange} error={errors.contactNumber} />
                </div>

                <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.25s] [animation-fill-mode:both]">
                  <InputField id="password" label="Password" type={showPassword ? 'text' : 'password'} name="password"
                    placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} error={errors.password}>
                    <button
                      type="button" id="toggle-password"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#888] hover:text-gold dark:text-[#484848] dark:hover:text-gold flex items-center transition-colors duration-150 p-0"
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                    </button>
                  </InputField>
                </div>

                {/* Seller toggle */}
                <div
                  onClick={() => setIsSeller(v => !v)}
                  role="checkbox" aria-checked={isSeller} tabIndex={0}
                  onKeyDown={e => e.key === ' ' && setIsSeller(v => !v)}
                  className={[
                    'flex items-center justify-between rounded-lg px-4 py-3.25 cursor-pointer select-none',
                    'border transition-all duration-200',
                    'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.31s] [animation-fill-mode:both]',
                    'bg-white dark:bg-[#1a1a1a] shadow-xs',
                    isSeller ? 'border-gold/60 ring-1 ring-gold/20' : 'border-black/10 dark:border-[#252525]',
                  ].join(' ')}
                >
                  <div>
                    <p className="font-inter text-[13px] font-medium text-[#121212] dark:text-white">Register as Seller</p>
                    <p className="font-inter text-[11px] text-[#636059] dark:text-[#666] mt-0.5">List &amp; manage your own products</p>
                  </div>
                  <div className={`relative w-10 h-5.5 rounded-full shrink-0 ml-4 transition-colors duration-300 ${isSeller ? 'bg-gold' : 'bg-black/15 dark:bg-[#2a2a2a]'}`}>
                    <div className={`absolute top-0.75 left-0.75 w-4 h-4 rounded-full transition-transform duration-300 ${isSeller ? 'translate-x-4.5 bg-[#0a0a0a]' : 'translate-x-0 bg-[#888] dark:bg-[#666]'}`} />
                  </div>
                  <input type="checkbox" id="isSeller" name="isSeller" checked={isSeller}
                    onChange={e => setIsSeller(e.target.checked)} className="sr-only" aria-label="Register as seller" />
                </div>

                <hr className="border-t border-black/10 dark:border-white/5 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.35s] [animation-fill-mode:both]" />

                <button
                  type="submit" 
                  id="create-account-btn"
                  disabled={loading}
                  className={[
                    'w-full rounded-lg py-3.25 font-inter font-bold text-[11px] tracking-[0.18em] uppercase text-[#0a0a0a]',
                    'bg-gold hover:bg-gold-light',
                    'transition-all duration-200 shadow-md shadow-gold/20 hover:shadow-gold/35',
                    'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.39s] [animation-fill-mode:both] ', loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]',
                  ].join(' ')}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="flex-1 border-t border-black/10 dark:border-[#1e1e1e]" />

                {/* Continue with Google button */}
                <ContinueWithGoogle />

                <p className="font-inter text-center text-[10px] text-[#888] dark:text-[#444] leading-relaxed animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.43s] [animation-fill-mode:both]">
                  By continuing you agree to our{' '}
                  <a href="#" className="text-[#555] dark:text-[#666] underline hover:text-[#111] dark:hover:text-[#999] transition-colors">Terms</a>
                  {' '}&amp;{' '}
                  <a href="#" className="text-[#555] dark:text-[#666] underline hover:text-[#111] dark:hover:text-[#999] transition-colors">Privacy Policy</a>
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Register
