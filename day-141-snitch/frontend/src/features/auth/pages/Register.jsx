import React, { useState } from 'react'

// ── InputField (defined outside to avoid re-mount on render) ──
const InputField = ({ id, label, type = 'text', name, placeholder, value, onChange, error, children }) => (
  <div className="flex flex-col gap-1.5">

    {/* Label */}
    <label
      htmlFor={id}
      className={`text-[10px] font-bold uppercase tracking-widest font-inter ${error ? 'text-red-400' : 'text-gold'}`}
    >
      {label}
    </label>

    {/* Input wrapper */}
    <div className="relative flex items-center">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          'w-full rounded-lg px-4 py-2.75 text-sm font-light font-inter',
          'bg-[#141414] text-white placeholder-[#3a3a3a]',
          'border outline-none transition-all duration-200',
          'focus:border-gold focus:ring-2 focus:ring-gold/10',
          error
            ? 'border-red-400/70 ring-2 ring-red-400/10'
            : 'border-[#1e1e1e]',
          children ? 'pr-11' : '',
        ].join(' ')}
      />
      {children}
    </div>

    {/* Error message */}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-[11px] text-red-400 m-0 font-inter">
        {error}
      </p>
    )}
  </div>
)

// Register Page
const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller]         = useState(false)
  const [formData, setFormData]         = useState({ fullName: '', email: '', contactNumber: '', password: '' })
  const [errors, setErrors]             = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!formData.fullName.trim())      err.fullName       = 'Full name is required'
    if (!formData.email.trim())         err.email          = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                        err.email          = 'Invalid email address'
    if (!formData.contactNumber.trim()) err.contactNumber  = 'Contact number is required'
    else if (!/^\+?[\d\s\-(). ]{7,15}$/.test(formData.contactNumber))
                                        err.contactNumber  = 'Invalid number'
    if (!formData.password)             err.password       = 'Password is required'
    else if (formData.password.length < 8)
                                        err.password       = 'Minimum 8 characters'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }
    console.log('Register payload:', { ...formData, isSeller })
    alert('Welcome to Velora! 🎉')
  }

  return (
    <>
          {/* Main — full-screen split layout */}
      <main className="flex h-screen w-full overflow-hidden bg-[#0a0a0a]">

        {/* ── LEFT : Brand + Fashion Model ─────── */}
        <section
          className="relative w-1/2 h-full overflow-hidden shrink-0 flex flex-col"
          aria-label="Velora brand panel"
        >
          {/* Hero model image */}
          <img
            src="/model-hero.png"
            alt="Velora fashion model wearing streetwear"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Right-side fade into form panel */}
          <div className="absolute inset-0 bg-linear-to-r from-[#0a0a0a]/5 to-[#0a0a0a]/70" />
          {/* Top & bottom fades */}
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/65 via-transparent to-[#0a0a0a]/90" />

          {/* Logo */}
          <div className="absolute top-8 left-8 z-10 h-20 w-20 object-contain">
            <img src='/logo.png' />
          </div>

          {/* Bottom brand copy */}
          <div className="absolute bottom-0 left-0 right-0 z-10 p-9">
            <div className="w-9 h-0.5 bg-gold mb-4" />

            <h2 className="font-bodoni text-4xl font-bold leading-[1.1] tracking-tight text-white m-0">
              Wear Your<br />
              <span className="text-gold">Identity.</span>
            </h2>

            <p className="font-inter text-sm text-white/50 mt-2.5 font-light leading-relaxed max-w-70">
              Curated fashion for those who refuse to blend in.
            </p>

            {/* Stats */}
            <div className="flex gap-7 mt-5">
              {[['50K+', 'Customers'], ['2K+', 'Styles'], ['4.9★', 'Rating']].map(([num, lbl]) => (
                <div key={lbl}>
                  <div className="font-inter text-base font-bold text-gold">{num}</div>
                  <div className="font-inter text-[10px] text-white/40 tracking-[0.08em] uppercase mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── RIGHT : Registration Form ─────────── */}
        <section className="flex-1 h-full flex flex-col justify-center overflow-y-auto bg-[#0f0f0f] border-l border-[#1a1a1a] px-12">
          <div className="w-full max-w-100 mx-auto py-6">

            {/* Header */}
            <div className="mb-6 animate-[fadeInUp_0.5s_ease_both]">

              {/* Gold badge */}
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                <span className="font-inter text-[10px] font-bold tracking-[0.12em] text-gold uppercase">
                  Join Velora
                </span>
              </div>

              <h1 className="font-bodoni text-[32px] font-bold tracking-tight text-white m-0 leading-[1.1]">
                Create Account
              </h1>

              <p className="font-inter text-[13px] text-[#888] mt-2 leading-relaxed">
                Already have an account?{' '}
                <a
                  href="/login"
                  id="sign-in-link"
                  className="text-gold font-medium no-underline hover:underline transition-all"
                >
                  Sign in →
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">

              {/* Full Name */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.08s] [animation-fill-mode:both]">
                <InputField
                  id="fullName" label="Full Name" name="fullName"
                  placeholder="e.g. Virat Kohli"
                  value={formData.fullName} onChange={handleChange} error={errors.fullName}
                />
              </div>

              {/* Email */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.16s] [animation-fill-mode:both]">
                <InputField
                  id="email" label="Email Address" type="email" name="email"
                  placeholder="you@example.com"
                  value={formData.email} onChange={handleChange} error={errors.email}
                />
              </div>

              {/* Contact Number */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.24s] [animation-fill-mode:both]">
                <InputField
                  id="contactNumber" label="Contact Number" type="tel" name="contactNumber"
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber} onChange={handleChange} error={errors.contactNumber}
                />
              </div>

              {/* Password */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.32s] [animation-fill-mode:both]">
                <InputField
                  id="password" label="Password"
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password} onChange={handleChange} error={errors.password}
                >
                  <button
                    type="button"
                    id="toggle-password"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 p-0 bg-transparent border-none cursor-pointer text-[#3a3a3a] hover:text-gold flex items-center transition-colors duration-150"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </InputField>
              </div>

              {/* Seller Toggle */}
              <div
                onClick={() => setIsSeller(v => !v)}
                className={[
                  'flex items-center justify-between bg-[#141414] border rounded-lg px-4 py-3.5 cursor-pointer',
                  'transition-all duration-200',
                  'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.40s] [animation-fill-mode:both]',
                  isSeller ? 'border-gold/35' : 'border-[#1e1e1e]',
                ].join(' ')}
              >
                <div>
                  <p className="font-inter text-[13px] font-medium text-white m-0">
                    Register as Seller
                  </p>
                  <p className="font-inter text-[11px] text-[#888] mt-0.5 m-0">
                    List &amp; manage your own products
                  </p>
                </div>

                {/* Toggle pill */}
                <div
                  className={[
                    'relative w-10.5 h-5.75 rounded-full shrink-0 ml-3 border transition-all duration-280',
                    isSeller ? 'bg-gold border-gold' : 'bg-[#222] border-[#333]',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'absolute top-0.5 left-0.5 w-4.25 h-4.25 rounded-full transition-all duration-280',
                      isSeller ? 'bg-[#0a0a0a] translate-x-4.75' : 'bg-[#555] translate-x-0',
                    ].join(' ')}
                  />
                </div>

                {/* Accessible hidden checkbox */}
                <input
                  type="checkbox" id="isSeller" name="isSeller"
                  checked={isSeller} onChange={e => setIsSeller(e.target.checked)}
                  className="sr-only" aria-label="Register as seller"
                />
              </div>

              {/* Divider */}
              <hr className="border-t border-[#1a1a1a] m-0 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.44s] [animation-fill-mode:both]" />

              {/* Submit Button */}
              <button
                type="submit"
                id="create-account-btn"
                className={[
                  'w-full rounded-lg py-3.5 px-6 font-inter font-bold text-[11px] tracking-[0.16em] uppercase',
                  'bg-linear-to-br from-gold to-gold-dark text-[#0a0a0a]',
                  'hover:from-gold-light hover:to-gold',
                  'transition-all duration-220 active:scale-[0.985]',
                  'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.48s] [animation-fill-mode:both]',
                ].join(' ')}
              >
                Create Account
              </button>

              {/* Terms note */}
              <p className="font-inter text-center text-[10px] text-[#3a3a3a] leading-relaxed m-0 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.52s] [animation-fill-mode:both]">
                By continuing you agree to our{' '}
                <a href="#" className="text-[#555] underline hover:text-[#888] transition-colors">Terms</a>
                {' '}&amp;{' '}
                <a href="#" className="text-[#555] underline hover:text-[#888] transition-colors">Privacy Policy</a>
              </p>

            </form>
          </div>
        </section>
      </main>

      {/* Responsive: stack on tablet & mobile */}
      <style>{`
        @media (max-width: 860px) {
          main {
            flex-direction: column !important;
            height: auto !important;
            overflow-y: auto !important;
          }
          main > section:first-child {
            width: 100% !important;
            height: 300px !important;
            flex-shrink: 0 !important;
          }
          main > section:last-child {
            padding-left: 24px !important;
            padding-right: 24px !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
        @media (max-width: 480px) {
          main > section:first-child { height: 220px !important; }
          main > section:last-child  { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </>
  )
}

export default Register
