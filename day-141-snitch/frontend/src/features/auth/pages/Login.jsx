import React, { useState } from 'react'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'
import ContinueWithGoogle from '../components/ContinueWithGoogle'

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
      <main className="flex flex-col-reverse md:flex-row min-h-screen md:h-screen md:overflow-hidden bg-[#0a0a0a]">

        {/*  LEFT — Login Form Panel */}
        <section className="flex-1 flex items-center justify-center bg-[#111] md:border-r md:border-white/5 overflow-y-auto px-6 py-10 sm:px-10 md:px-10 lg:px-12 xl:px-16">
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

              {/* Continue with Google button */}
              <ContinueWithGoogle />

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
          className="relative w-full h-64 sm:h-80 md:w-[48%] md:h-full shrink-0 overflow-hidden"
        >
          {/* Hero image */}
          <img
            src="/login-model.png"
            alt="Velora fashion model"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Lighter overlays — let the image breathe */}
          {/* Left-edge feather into form panel */}
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-[#0a0a0a]/35" />
          {/* Top vignette + bottom for text legibility */}
          <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/70" />

          {/* Logo — Velora image, top right */}
          <div className="absolute top-5 right-5 md:top-7 md:right-7 z-10">
            <img src="/logo.png" alt="Velora" className="h-8 md:h-15 w-auto object-contain" />
          </div>

          {/* Bottom brand copy — desktop only */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-7 md:px-9 md:pb-10">
            <div className="w-9 h-0.5 bg-gold mb-4" />
            <h2 className="font-bodoni text-[28px] sm:text-[32px] md:text-[38px] font-bold leading-[1.1] tracking-tight text-white">
              Welcome<br />
              <span className="text-gold">Back.</span>
            </h2>
            <p className="font-inter text-xs sm:text-sm text-white/60 mt-2 font-light leading-relaxed max-w-65">
              Your style. Your story. Pick up where you left off.
            </p>
            <div className="flex gap-6 mt-4">
              {[['120K+', 'Members'], ['50+', 'Collections'], ['🌍', 'Worldwide']].map(([num, lbl]) => (
                <div key={lbl}>
                  <div className="font-inter text-sm font-bold text-gold">{num}</div>
                  <div className="font-inter text-[9px] text-white/50 tracking-widest uppercase mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

export default Login
