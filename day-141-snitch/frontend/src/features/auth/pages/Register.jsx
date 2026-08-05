import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

const InputField = ({ id, label, type = 'text', name, placeholder, value, onChange, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className={`font-inter text-[10px] font-bold uppercase tracking-widest ${error ? 'text-red-400' : 'text-gold'}`}
    >
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        id={id} name={name} type={type} placeholder={placeholder}
        value={value} onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-lg px-4 py-2.75 text-sm font-light font-inter text-white',
          'placeholder:text-[#3d3d3d] border outline-none transition-all duration-200',
          'focus:border-gold focus:ring-2 focus:ring-gold/10',
          error ? 'border-red-400/70 ring-2 ring-red-400/10' : 'border-[#252525]',
          'bg-[#1a1a1a]',
          children ? 'pr-11' : '',
        ].join(' ')}
      />
      {children}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" className="font-inter text-[11px] text-red-400">{error}</p>
    )}
  </div>
)

const Register = () => {

  const {handleRegister} = useAuth()

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller] = useState(false)
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
    if (Object.keys(ve).length) { setErrors(ve); return }
    await handleRegister({
      fullname: formData.fullName,
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: isSeller
    })

    alert('Welcome to Snitch! 🎉')

    navigate("/login");
  }

  return (
    /*
     * Responsive strategy:
     *   Mobile/Tablet  → flex-col, natural document scroll
     *   Desktop (lg+)  → flex-row, h-screen, overflow-hidden (locked viewport)
     */
    <main className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0a]">

      {/* LEFT — Brand / Model */}
      <section
        aria-label="Snitch brand panel"
        className="relative w-full h-64 sm:h-80 md:h-96 lg:w-[48%] lg:h-full shrink-0 overflow-hidden"
      >
        <img
          src="/model-hero.png"
          alt="Snitch fashion model"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* ── Lighter overlays so image shines through ── */}
        {/* Right-edge feather into form panel */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-[#0a0a0a]/40" />
        {/* Top vignette + bottom for text legibility */}
        <div className="absolute inset-0 bg-linear-to-b from-black/25 via-transparent to-black/75" />

        {/* Logo — Velora image */}
        <div className="absolute top-5 left-5 lg:top-7 lg:left-7 z-10">
          <img src="/logo.png" alt="Velora" className="h-8 lg:h-15 w-auto object-contain" />
        </div>

        {/* Bottom brand copy — shown on all screens, adapts size */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-7 lg:px-9 lg:pb-10">
          <div className="w-7 h-0.5 bg-gold mb-4" />
          <h2 className="font-bodoni text-[28px] sm:text-[32px] lg:text-[38px] font-bold leading-[1.1] tracking-tight text-white">
            Wear Your<br />
            <span className="text-gold">Identity.</span>
          </h2>
          <p className="font-inter text-xs sm:text-sm text-white/60 mt-2 font-light leading-relaxed max-w-65">
            Curated fashion for those who refuse to blend in.
          </p>
          <div className="flex gap-6 mt-4">
            {[['50K+', 'Customers'], ['2K+', 'Styles'], ['4.9★', 'Rating']].map(([n, l]) => (
              <div key={l}>
                <div className="font-inter text-sm font-bold text-gold">{n}</div>
                <div className="font-inter text-[9px] text-white/50 tracking-widest uppercase mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT — Registration Form */}
      <section className="flex-1 flex items-center justify-center bg-[#111] lg:border-l lg:border-white/5 overflow-y-auto px-6 py-10 sm:px-10 md:px-14 lg:px-10 xl:px-14">
        <div className="w-full max-w-97.5">

          {/* Header */}
          <div className="mb-7 animate-[fadeInUp_0.5s_ease_both]">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/25 rounded-full px-3 py-1.25 mb-4">
              <span className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
              <span className="font-inter text-[9px] font-bold tracking-[0.14em] text-gold uppercase">Join Velora</span>
            </div>
            <h1 className="font-bodoni text-[30px] sm:text-[34px] font-bold tracking-tight text-white leading-[1.15]">
              Create Account
            </h1>
            <p className="font-inter text-[13px] text-[#777] mt-2 leading-relaxed">
              Already have an account?{' '}
              <a href="/login" id="sign-in-link" className="text-gold font-medium no-underline hover:underline underline-offset-2 transition-all">
                Sign in →
              </a>
            </p>
          </div>

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#484848] hover:text-gold flex items-center transition-colors duration-150 p-0"
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
                'bg-[#1a1a1a]',
                isSeller ? 'border-gold/30' : 'border-[#252525]',
              ].join(' ')}
            >
              <div>
                <p className="font-inter text-[13px] font-medium text-white">Register as Seller</p>
                <p className="font-inter text-[11px] text-[#666] mt-0.5">List &amp; manage your own products</p>
              </div>
              <div className={`relative w-10 h-5.5 rounded-full shrink-0 ml-4 transition-colors duration-300 ${isSeller ? 'bg-gold' : 'bg-[#2a2a2a]'}`}>
                <div className={`absolute top-0.75 left-0.75 w-4 h-4 rounded-full transition-transform duration-300 ${isSeller ? 'translate-x-4.5 bg-[#0a0a0a]' : 'translate-x-0 bg-[#666]'}`} />
              </div>
              <input type="checkbox" id="isSeller" name="isSeller" checked={isSeller}
                onChange={e => setIsSeller(e.target.checked)} className="sr-only" aria-label="Register as seller" />
            </div>

            <hr className="border-t border-white/5 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.35s] [animation-fill-mode:both]" />

            <button
              type="submit" id="create-account-btn"
              className={[
                'w-full rounded-lg py-3.25 font-inter font-bold text-[11px] tracking-[0.18em] uppercase text-[#0a0a0a]',
                'bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold',
                'transition-all duration-200 active:scale-[0.98]',
                'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.39s] [animation-fill-mode:both]',
              ].join(' ')}
            >
              Create Account
            </button>

            {/* Continue with Google button */}
            <ContinueWithGoogle />

            <p className="font-inter text-center text-[10px] text-[#444] leading-relaxed animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.43s] [animation-fill-mode:both]">
              By continuing you agree to our{' '}
              <a href="#" className="text-[#666] underline hover:text-[#999] transition-colors">Terms</a>
              {' '}&amp;{' '}
              <a href="#" className="text-[#666] underline hover:text-[#999] transition-colors">Privacy Policy</a>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Register
