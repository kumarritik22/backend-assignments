import React, { useState } from 'react'

// ─────────────────────────────────────────────────────────────
// Snitch – Register Page  |  Full-screen, no-scroll layout
// ─────────────────────────────────────────────────────────────

const T = {
  gold:      '#C9A96E',
  goldLight: '#e0c48a',
  bg:        '#0a0a0a',
  surface:   '#0f0f0f',
  border:    '#1e1e1e',
  text:      '#ffffff',
  muted:     '#888888',
  dim:       '#3a3a3a',
  error:     '#e05c5c',
}

// ── InputField ────────────────────────────────────────────────
const InputField = ({ id, label, type = 'text', name, placeholder, value, onChange, error, children, delay }) => (
  <div className={`snitch-fade-in-delay-${delay}`} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
    <label
      htmlFor={id}
      style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: error ? T.error : T.gold,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {label}
    </label>
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`snitch-input${error ? ' error' : ''}${children ? ' has-icon' : ''}`}
      />
      {children}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" style={{ fontSize: '11px', color: T.error, margin: 0 }}>
        {error}
      </p>
    )}
  </div>
)

// ── Register ──────────────────────────────────────────────────
const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSeller, setIsSeller]         = useState(false)
  const [formData, setFormData]         = useState({ fullName: '', email: '', contactNumber: '', password: '' })
  const [errors, setErrors]             = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const err = {}
    if (!formData.fullName.trim())      err.fullName = 'Full name is required'
    if (!formData.email.trim())         err.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) err.email = 'Invalid email'
    if (!formData.contactNumber.trim()) err.contactNumber = 'Contact number is required'
    else if (!/^\+?[\d\s\-(). ]{7,15}$/.test(formData.contactNumber)) err.contactNumber = 'Invalid number'
    if (!formData.password)             err.password = 'Password is required'
    else if (formData.password.length < 8) err.password = 'Minimum 8 characters'
    return err
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const ve = validate()
    if (Object.keys(ve).length) { setErrors(ve); return }
    console.log('Payload:', { ...formData, isSeller })
    alert('Welcome to Snitch! 🎉')
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          Full-screen split layout — no page scroll
      ══════════════════════════════════════════ */}
      <main style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: T.bg,
      }}>

        {/* ── LEFT: Brand + Model ─────────────────── */}
        <div
          style={{
            position: 'relative',
            width: '50%',
            height: '100%',
            overflow: 'hidden',
            flexShrink: 0,
          }}
          aria-label="Snitch brand panel"
        >
          {/* Hero image */}
          <img
            src="/model-hero.png"
            alt="Snitch fashion model"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />

          {/* Side gradient → right edge blends into form panel */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.7) 100%)' }} />
          {/* Top & bottom fades */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.65) 0%, transparent 25%, transparent 55%, rgba(10,10,10,0.9) 100%)' }} />

          {/* Logo — top left */}
          <div style={{ position: 'absolute', top: '28px', left: '32px', zIndex: 10 }}>
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              SNITCH
            </span>
          </div>

          {/* Bottom copy */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '32px 36px' }}>
            <div style={{ width: '36px', height: '2px', backgroundColor: T.gold, marginBottom: '16px' }} />
            <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '36px', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
              Wear Your<br />
              <span style={{ color: T.gold }}>Identity.</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '10px', fontWeight: 300, lineHeight: 1.6, maxWidth: '280px' }}>
              Curated fashion for those who refuse to blend in.
            </p>
            {/* Stats */}
            <div style={{ display: 'flex', gap: '28px', marginTop: '20px' }}>
              {[['50K+', 'Customers'], ['2K+', 'Styles'], ['4.9★', 'Rating']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: T.gold, fontFamily: "'Inter', sans-serif" }}>{n}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form ──────────────────────────── */}
        <div style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto', /* scrollable only if viewport is very short */
          backgroundColor: T.surface,
          borderLeft: '1px solid #1a1a1a',
          padding: '0 48px',
        }}>
          <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '24px 0' }}>

            {/* Header */}
            <div className="snitch-fade-in" style={{ marginBottom: '24px' }}>
              {/* Pill badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: '100px', padding: '4px 12px', marginBottom: '14px',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: T.gold }} />
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: T.gold, textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                  Join Snitch
                </span>
              </div>

              <h1 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', margin: 0, lineHeight: 1.1 }}>
                Create Account
              </h1>
              <p style={{ fontSize: '13px', color: T.muted, marginTop: '8px', lineHeight: 1.5, fontFamily: "'Inter', sans-serif" }}>
                Already have an account?{' '}
                <a
                  href="/login"
                  id="sign-in-link"
                  style={{ color: T.gold, fontWeight: 500, textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.target.style.textDecoration = 'none'}
                >
                  Sign in →
                </a>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              <InputField id="fullName"      label="Full Name"       name="fullName"      placeholder="e.g. Virat Kohli"     value={formData.fullName}      onChange={handleChange} error={errors.fullName}      delay={1} />
              <InputField id="email"         label="Email Address"   type="email" name="email"         placeholder="you@example.com"      value={formData.email}         onChange={handleChange} error={errors.email}         delay={2} />
              <InputField id="contactNumber" label="Contact Number"  type="tel"   name="contactNumber" placeholder="+91 98765 43210"      value={formData.contactNumber} onChange={handleChange} error={errors.contactNumber} delay={3} />

              {/* Password with toggle */}
              <InputField id="password" label="Password" type={showPassword ? 'text' : 'password'} name="password"
                placeholder="Minimum 8 characters" value={formData.password} onChange={handleChange} error={errors.password} delay={4}
              >
                <button
                  type="button" id="toggle-password"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: T.dim, padding: 0, display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = T.gold}
                  onMouseLeave={e => e.currentTarget.style.color = T.dim}
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
                </button>
              </InputField>

              {/* Seller toggle */}
              <div
                className="snitch-fade-in-delay-5"
                onClick={() => setIsSeller(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: '#141414',
                  border: `1px solid ${isSeller ? 'rgba(201,169,110,0.35)' : T.border}`,
                  borderRadius: '8px', padding: '13px 16px', cursor: 'pointer',
                  transition: 'border-color 0.25s ease',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff', fontFamily: "'Inter', sans-serif" }}>Register as Seller</div>
                  <div style={{ fontSize: '11px', color: T.muted, marginTop: '2px', fontFamily: "'Inter', sans-serif" }}>List & manage your own products</div>
                </div>
                {/* Toggle knob */}
                <div style={{
                  width: '42px', height: '23px', borderRadius: '100px',
                  backgroundColor: isSeller ? T.gold : '#222',
                  border: `1px solid ${isSeller ? T.gold : '#333'}`,
                  position: 'relative', flexShrink: 0, marginLeft: '12px',
                  transition: 'all 0.28s ease',
                }}>
                  <div style={{
                    position: 'absolute', top: '2px', left: '2px',
                    width: '17px', height: '17px', borderRadius: '50%',
                    backgroundColor: isSeller ? '#0a0a0a' : '#555',
                    transform: isSeller ? 'translateX(19px)' : 'translateX(0)',
                    transition: 'all 0.28s ease',
                  }} />
                </div>
                <input type="checkbox" id="isSeller" name="isSeller" checked={isSeller}
                  onChange={e => setIsSeller(e.target.checked)}
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  aria-label="Register as seller"
                />
              </div>

              {/* Divider */}
              <div className="snitch-fade-in-delay-5" style={{ borderTop: `1px solid #1a1a1a`, margin: '2px 0' }} />

              {/* Submit */}
              <button type="submit" id="create-account-btn" className="snitch-btn-primary snitch-fade-in-delay-6">
                <span>Create Account</span>
              </button>

              {/* Terms */}
              <p className="snitch-fade-in-delay-6" style={{ textAlign: 'center', fontSize: '10px', color: '#3a3a3a', lineHeight: 1.6, fontFamily: "'Inter', sans-serif", margin: 0 }}>
                By continuing you agree to our{' '}
                <a href="#" style={{ color: '#555', textDecoration: 'underline' }}>Terms</a> &{' '}
                <a href="#" style={{ color: '#555', textDecoration: 'underline' }}>Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Responsive: stack on mobile/tablet */}
      <style>{`
        @media (max-width: 860px) {
          main { flex-direction: column !important; height: auto !important; overflow: auto !important; }
          main > div:first-child { width: 100% !important; height: 45vw !important; max-height: 320px !important; min-height: 200px !important; }
          main > div:last-child  { padding: 32px 24px !important; height: auto !important; overflow: visible !important; }
        }
        @media (max-width: 480px) {
          main > div:last-child { padding: 28px 20px !important; }
        }
      `}</style>
    </>
  )
}

export default Register
