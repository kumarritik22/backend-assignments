import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'

// InputField defined at module level — prevents React remount bug
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
          error ? 'border-red-400/70 ring-2 ring-red-400/10' : 'border-[#1e1e1e]',
          children ? 'pr-11' : '',
        ].join(' ')}
      />
      {children}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" className="font-inter text-[11px] text-red-400">
        {error}
      </p>
    )}
  </div>
)

// ── Login Component ──
const Login = () => {

    const {handleLogin} = useAuth()

    const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ 
        email: '', 
        password: '' 
    })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!form.email.trim())
      err.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = 'Invalid email address'
    if (!form.password)
      err.password = 'Password is required'
    return err
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }
    await handleLogin({
        email: form.email,
        password: form.password
    })
    navigate("/");
  }

  return (
    <>
      {/*
       * Desktop : h-screen, flex-row — form LEFT, model RIGHT (flipped from Register)
       * Mobile  : flex-col — model image strip on TOP, form BELOW (natural scroll)
       */}
      <main className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] flex-col-reverse md:flex-row">

        {/*  LEFT — Login Form Panel */}
        <section className="flex-1 h-full flex flex-col justify-center overflow-y-auto bg-[#0f0f0f] border-r border-[#1a1a1a] px-8 py-10 sm:px-12 md:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-100 mx-auto">

            {/* Header */}
            <div className="mb-8 animate-[fadeInUp_0.5s_ease_both]">

              {/* Gold badge */}
              <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-3 py-1.25 mb-4">
                <span className="w-1.25 h-1.25 rounded-full bg-gold shrink-0" />
                <span className="font-inter text-[9px] font-bold tracking-[0.14em] text-gold uppercase">
                  Welcome Back
                </span>
              </div>

              <h1 className="font-bodoni text-[34px] font-bold tracking-tight text-white leading-[1.1]">
                Sign In
              </h1>

              <p className="font-inter text-[13px] text-[#888] mt-2 leading-relaxed">
                New here?{' '}
                <a
                  href="/register"
                  id="register-link"
                  className="text-gold font-medium no-underline hover:underline underline-offset-2 transition-all"
                >
                  Create an account →
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Email */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.08s] [animation-fill-mode:both]">
                <InputField
                  id="email" label="Email Address" type="email" name="email"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange} error={errors.email}
                />
              </div>

              {/* Password */}
              <div className="animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.16s] [animation-fill-mode:both]">
                <InputField
                  id="password" label="Password"
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange} error={errors.password}
                >
                  <button
                    type="button" id="toggle-password"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 p-0 bg-transparent border-none cursor-pointer text-[#3a3a3a] hover:text-gold flex items-center transition-colors duration-150"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </InputField>

                {/* Forgot password — right aligned */}
                <div className="flex justify-end mt-2">
                  <a
                    href="#"
                    id="forgot-password-link"
                    className="font-inter text-[11px] text-gold hover:text-gold-light underline-offset-2 hover:underline transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Divider */}
              <hr className="border-t border-[#1a1a1a] animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.22s] [animation-fill-mode:both]" />

              {/* Sign In CTA */}
              <button
                type="submit" id="sign-in-btn"
                className={[
                  'w-full rounded-lg py-3.5 px-6 font-inter font-bold text-[11px] tracking-[0.16em] uppercase',
                  'bg-linear-to-r from-gold to-gold-dark text-[#0a0a0a]',
                  'hover:from-gold-light hover:to-gold transition-all duration-220 cursor-pointer active:scale-[0.985]',
                  'animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.26s] [animation-fill-mode:both]',
                ].join(' ')}
              >
                Sign In
              </button>

              {/* Or continue with */}
              <div className="flex items-center gap-3 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.32s] [animation-fill-mode:both]">
                <div className="flex-1 border-t border-[#1e1e1e]" />
                <span className="font-inter text-[10px] text-[#444] shrink-0 tracking-wide">
                  or continue with
                </span>
                <div className="flex-1 border-t border-[#1e1e1e]" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3 animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.38s] [animation-fill-mode:both]">

                {/* Google */}
                <button
                  type="button" id="google-login-btn"
                  className="flex items-center justify-center gap-2.5 bg-[#131313] border border-[#1e1e1e] rounded-lg py-3 font-inter text-[12px] font-medium text-[#bbb] hover:border-[#2a2a2a] hover:bg-[#181818] hover:text-white transition-all duration-200 active:scale-[0.97] cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>

                {/* Apple */}
                <button
                  type="button" id="apple-login-btn"
                  className="flex items-center justify-center gap-2.5 bg-[#131313] border border-[#1e1e1e] rounded-lg py-3 font-inter text-[12px] font-medium text-[#bbb] hover:border-[#2a2a2a] hover:bg-[#181818] hover:text-white transition-all duration-200 active:scale-[0.97] cursor-pointer"
                >
                  <svg width="13" height="16" viewBox="0 0 814 1000" fill="currentColor" aria-hidden="true" className="text-white">
                    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.3-169.3-116c-79.9-93.6-148.2-244-148.2-385.7 0-270.7 179.3-410.5 355.1-410.5 96.6 0 177.1 64.2 237.6 64.2 57.1 0 146.2-68 255.9-68 41.4 0 150.1 3.8 221.1 142.5zm-281.9-202.5c32.1-38.7 55.1-92.5 55.1-146.4 0-7.4-.6-14.9-1.9-21-52.5 2-115.2 35-152.6 78.3-29.2 33.8-56.7 87.4-56.7 141.9 0 8.1 1.3 16.2 1.9 18.8 3.2.6 8.4 1.3 13.6 1.3 47.4 0 107.2-32.1 140.6-72.9z"/>
                  </svg>
                  Apple
                </button>
              </div>

              {/* Terms */}
              <p className="font-inter text-center text-[10px] text-[#3a3a3a] leading-relaxed animate-[fadeInUp_0.5s_ease_both] [animation-delay:0.42s] [animation-fill-mode:both]">
                Protected by reCAPTCHA &amp; subject to our{' '}
                <a href="#" className="text-[#555] underline hover:text-[#888] transition-colors">Privacy Policy</a>
              </p>

            </form>
          </div>
        </section>

        {/* RIGHT — Brand / Model Panel */}
        <section
          aria-label="Velora brand panel"
          className="relative w-full h-65 md:w-[48%] md:h-full shrink-0 overflow-hidden"
        >
          {/* Hero image */}
          <img
            src="/login-model.png"
            alt="Velora fashion model"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Left-side fade → into form panel */}
          <div className="absolute inset-0 bg-linear-to-l from-[#0a0a0a]/5 to-[#0a0a0a]/65" />
          {/* Top & bottom fades */}
          <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/92" />

          {/* Logo — top right */}
          <div className="absolute top-8 right-8 z-10 h-20 w-20 object-contain">
            <img src='/logo.png' />
          </div>

          {/* Bottom brand copy — desktop only */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 z-10 p-9">
            <div className="w-9 h-0.5 bg-gold mb-4" />
            <h2 className="font-bodoni text-4xl font-bold leading-[1.1] tracking-tight text-white m-0">
              Welcome<br />
              <span className="text-gold">Back.</span>
            </h2>
            <p className="font-inter text-sm text-white/50 mt-2.5 font-light leading-relaxed max-w-67.5">
              Your style. Your story. Pick up where you left off.
            </p>
            <div className="flex gap-7 mt-5">
              {[['120K+', 'Members'], ['50+', 'Collections'], ['🌍', 'Worldwide']].map(([num, lbl]) => (
                <div key={lbl}>
                  <div className="font-inter text-base font-bold text-gold">{num}</div>
                  <div className="font-inter text-[10px] text-white/40 tracking-[0.08em] uppercase mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ── Responsive overrides ── */}
      <style>{`
        /* Tablet & mobile: stack vertically, model on top */
        @media (max-width: 767px) {
          main {
            flex-direction: column !important;
            height: auto !important;
            overflow-y: auto !important;
          }
          /* Model image strip on top */
          main > section:last-child {
            width: 100% !important;
            height: 260px !important;
            flex-shrink: 0 !important;
          }
          /* Form below */
          main > section:first-child {
            height: auto !important;
            overflow: visible !important;
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
        }
        @media (max-width: 480px) {
          main > section:last-child { height: 220px !important; }
          main > section:first-child {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
        }
      `}</style>
    </>
  )
}

export default Login
