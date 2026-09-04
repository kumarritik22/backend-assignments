import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Phone, Mail, MapPin, Clock, Sparkles, ShieldCheck, ChevronDown, ArrowRight, Send, CheckCircle2, Headphones, Building2, MessageCircle, Gem } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'

const Contact = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderReference: '',
    department: '',
    preferredChannel: 'email',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
    }

    setErrors({})
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        orderReference: '',
        department: '',
        preferredChannel: 'email',
        message: ''
      })
    }, 1200)
  }

    const validateForm = () => {
        const newErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Please enter your full name'
        }

        // Email validation (format check)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = 'Please enter your email address'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Phone validation (Required if Phone/WhatsApp channel selected)
        if (formData.preferredChannel === 'phone' || formData.preferredChannel === 'whatsapp') {
            if (!formData.phone.trim()) {
            newErrors.phone = `Phone number is required for ${formData.preferredChannel === 'phone' ? 'Phone Call' : 'WhatsApp'} response`
            } else if (formData.phone.trim().length < 8) {
            newErrors.phone = 'Please enter a valid contact number'
            }
        }

        // Department validation
        if (!formData.department) {
            newErrors.department = 'Please select the nature of your inquiry'
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Please provide details for your inquiry'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters long'
        }

        return newErrors
    }

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index))
  }

  const faqs = [
    {
      question: "How do I arrange a bespoke consultation or custom sizing?",
      answer: "Our bespoke service begins with an intimate private consultation—either within our Bandra or Paris boutiques, or via a secure digital concierge link. Our master tailors guide you through cloth curation, bespoke silhouette drafting, and hand-finished fittings."
    },
    {
      question: "What is the white-glove dispatch and tracking timeline?",
      answer: "Every piece is packaged in signature museum-grade archival boxes and dispatched via secure, insured couriers. Domestic delivery arrives within 48–72 hours, while international shipments arrive in 3–5 business days with real-time concierge tracking."
    },
    {
      question: "What is Velora's private return and exchange policy?",
      answer: "We offer a 14-day complimentary white-glove collection service for unworn pieces with security seals intact. Our concierge will coordinate a private courier pickup directly from your preferred address."
    },
    {
      question: "How can I reserve a private boutique viewing in Mumbai or Paris?",
      answer: "Private boutique viewings are curated exclusively for you and your guests with dedicated Champagne hospitality and stylist advisory. You may submit an appointment request through our concierge form or via our hotline."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#e5e2e1] selection:bg-gold/30 selection:text-white">
      
      {/* ── Ambient Background Glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-160 h-160 bg-gold/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-120 h-120 bg-gold/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -left-40 w-120 h-120 bg-white/2 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-24">
        
        {/* ── Breadcrumb / Header Micro-badge ── */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/30 bg-[#141414]/80 backdrop-blur-md shadow-[0_0_15px_rgba(201,169,110,0.1)] mb-6">
            <Gem className="w-3.5 h-3.5 text-gold" />
            <span className="font-inter text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
              Atelier Concierge · Client Advisory
            </span>
          </div>

          <h1 className="font-bodoni text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.15] mb-6 max-w-3xl">
            How May Our Advisors Assist You?
          </h1>

          <p className="font-inter text-sm sm:text-base text-[#998f81] max-w-2xl leading-relaxed font-light">
            From bespoke sizing consultations and styling advice to order concierge and private boutique appointments, our client advisors are dedicated to your service.
          </p>

          {/* Quick Mobile Action Pills (Visible on Mobile/Tablet for Rapid Access) */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md mt-8 sm:hidden">
            <a 
              href="tel:+91800835672"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#141414] border border-gold/30 rounded-lg text-xs font-inter font-medium text-white hover:border-gold transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>Call Concierge</span>
            </a>
            <a 
              href="https://wa.me/91800835672?text=Hello%20Velora%20Concierge" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-[#141414] border border-white/10 rounded-lg text-xs font-inter font-medium text-white hover:border-gold/50 transition-all"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
              <span>WhatsApp 4h</span>
            </a>
          </div>
        </div>

        {/* ── Main 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-24">
          
          {/* ════ LEFT COLUMN: Advisory Channels & Boutiques (5 cols) ════ */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Channel 1: Private Client Hotline */}
            <div className="bg-[#111111]/90 backdrop-blur-xl border border-[#222222] hover:border-gold/40 rounded-xl p-6 sm:p-7 transition-all duration-300 group shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#191919] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-gold/40 group-hover:bg-gold/5 transition-all">
                  <Headphones className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bodoni text-lg sm:text-xl font-medium text-white">Private Client Hotline</h3>
                    <span className="font-inter text-[10px] tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">ONLINE</span>
                  </div>
                  <p className="font-inter text-xs text-[#8e9192] leading-relaxed mb-3">
                    Immediate assistance regarding orders, bespoke requests, or private styling.
                  </p>
                  <div className="flex flex-col gap-1">
                    <a 
                      href="tel:+91800835672" 
                      className="font-inter text-sm font-semibold text-gold hover:text-white transition-colors tracking-wide inline-flex items-center gap-2"
                    >
                      +91 (0) 800-VELORA / +91 98765 43210
                    </a>
                    <span className="font-inter text-[11px] text-[#636565] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" /> Mon – Sat · 10:00 AM – 8:00 PM IST
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel 2: Digital Concierge & WhatsApp */}
            <div className="bg-[#111111]/90 backdrop-blur-xl border border-[#222222] hover:border-gold/40 rounded-xl p-6 sm:p-7 transition-all duration-300 group shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#191919] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-gold/40 group-hover:bg-gold/5 transition-all">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bodoni text-lg sm:text-xl font-medium text-white">Digital Concierge</h3>
                    <span className="font-inter text-[10px] tracking-wider text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded">4H REPLY</span>
                  </div>
                  <p className="font-inter text-xs text-[#8e9192] leading-relaxed mb-3">
                    Direct correspondence with our curatorial team for styling, sourcing, and order queries.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                    <a 
                      href="mailto:concierge@velorafashion.com" 
                      className="font-inter text-xs font-semibold text-white hover:text-gold transition-colors inline-flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5 text-gold" />
                      concierge@velorafashion.com
                    </a>
                    <span className="hidden sm:inline text-white/20">|</span>
                    <a 
                      href="https://wa.me/91800835672?text=Hello%20Velora%20Concierge" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-inter text-xs font-semibold text-[#25D366] hover:underline inline-flex items-center gap-1.5"
                    >
                      <FaWhatsapp className="w-3.5 h-3.5" />
                      WhatsApp Advisory
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Channel 3: Flagship Boutiques */}
            <div className="bg-[#111111]/90 backdrop-blur-xl border border-[#222222] rounded-xl p-6 sm:p-7 shadow-lg">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                <Building2 className="w-5 h-5 text-gold" />
                <h3 className="font-bodoni text-lg sm:text-xl font-medium text-white">Flagship Boutiques</h3>
              </div>

              <div className="space-y-5">
                {/* Mumbai Boutique */}
                <div className="group">
                  <div className="flex items-center justify-between">
                    <h4 className="font-inter text-sm font-semibold text-white group-hover:text-gold transition-colors">
                      Mumbai · Bandra Atelier
                    </h4>
                    <span className="font-inter text-[10px] tracking-widest text-gold uppercase">Flagship</span>
                  </div>
                  <p className="font-inter text-xs text-[#8e9192] mt-1 leading-relaxed">
                    18 Altamount Road, Bandra West, Mumbai 400050
                  </p>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, department: 'styling', message: 'I would like to schedule a private viewing at the Mumbai Bandra Atelier.' }))
                      document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-2 font-inter text-[11px] font-medium text-gold hover:text-white tracking-wider uppercase inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Schedule Private Viewing <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="h-px bg-white/5" />

                {/* Paris Boutique */}
                <div className="group">
                  <div className="flex items-center justify-between">
                    <h4 className="font-inter text-sm font-semibold text-white group-hover:text-gold transition-colors">
                      Paris · Place Vendôme
                    </h4>
                    <span className="font-inter text-[10px] tracking-widest text-[#888] uppercase">Boutique</span>
                  </div>
                  <p className="font-inter text-xs text-[#8e9192] mt-1 leading-relaxed">
                    14 Place Vendôme, 75001 Paris, France
                  </p>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, department: 'styling', message: 'I would like to schedule a private viewing at the Paris Place Vendôme Boutique.' }))
                      document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-2 font-inter text-[11px] font-medium text-gold hover:text-white tracking-wider uppercase inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Schedule Private Viewing <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Atelier Promise Bar */}
            <div className="bg-linear-to-r from-[#141414] via-[#161616] to-[#141414] border border-gold/20 rounded-xl p-5 flex items-center gap-4 shadow-lg">
              <Sparkles className="w-5 h-5 text-gold shrink-0" />
              <p className="font-inter text-[11px] tracking-wider text-[#c7c6c6] uppercase leading-relaxed">
                The Atelier Promise: Discretion, White-Glove Care, and Uncompromising Sartorial Precision.
              </p>
            </div>

          </div>

          {/* ════ RIGHT COLUMN: Interactive Inquiry Form (7 cols) ════ */}
          <div id="inquiry-form" className="lg:col-span-7">
            <div className="bg-[#111111]/90 backdrop-blur-2xl border border-[#222222] rounded-2xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-2xl">
              
              {/* Subtle Ambient Radial Glow */}
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

              {isSubmitted ? (
                /* Success State */
                <div className="py-12 flex flex-col items-center text-center space-y-5 animate-[fadeIn_0.5s_ease_both]">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-[0_0_25px_rgba(201,169,110,0.2)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-inter text-[11px] font-bold tracking-[0.25em] text-gold uppercase block mb-2">
                      Transmission Confirmed
                    </span>
                    <h3 className="font-bodoni text-2xl sm:text-3xl font-medium text-white mb-3">
                      Your Request Has Been Received
                    </h3>
                    <p className="font-inter text-xs sm:text-sm text-[#8e9192] max-w-md mx-auto leading-relaxed">
                      A dedicated client advisor has been assigned to your inquiry and will contact you within our guaranteed 4-hour window.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4 px-8 py-3 rounded-lg border border-gold/40 text-gold hover:bg-gold hover:text-black font-inter text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                /* Standard Form */
                <>
                  <div className="mb-8">
                    <span className="font-inter text-[10px] font-bold tracking-[0.25em] text-gold uppercase block mb-1">
                      Direct Atelier Dispatch
                    </span>
                    <h2 className="font-bodoni text-2xl sm:text-3xl font-medium text-white mb-2">
                      Transmit Your Request
                    </h2>
                    <p className="font-inter text-xs sm:text-sm text-[#8e9192]">
                      Please provide your details below. A dedicated client advisor will curate a bespoke response tailored to your request.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    
                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                          Full Name <span className="text-gold">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Mahaan Dubey"
                          className={`w-full bg-[#161616] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] transition-all ${
                            errors.name 
                            ? 'border border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
                            : 'border border-[#262626] focus:border-gold focus:ring-1 focus:ring-gold/30'
                          }`}
                        />
                        {errors.name && (
                            <p className="font-inter text-[11px] text-red-400 mt-1 flex items-center gap-1 animate-[fadeIn_0.2s_ease_both]">
                                <span>•</span> {errors.name}
                            </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                          Email Address <span className="text-gold">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. ranbir@velora.com"
                          className={`w-full bg-[#161616] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] transition-all ${
                            errors.email 
                            ? 'border border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
                            : 'border border-[#262626] focus:border-gold focus:ring-1 focus:ring-gold/30'
                          }`}
                        />
                        {errors.email && (
                            <p className="font-inter text-[11px] text-red-400 mt-1 flex items-center gap-1 animate-[fadeIn_0.2s_ease_both]">
                                <span>•</span> {errors.email}
                            </p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone & Order ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                          Contact Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className={`w-full bg-[#161616] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] transition-all ${
                            errors.phone 
                            ? 'border border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
                            : 'border border-[#262626] focus:border-gold focus:ring-1 focus:ring-gold/30'
                          }`}
                        />
                        {errors.phone && (
                            <p className="font-inter text-[11px] text-red-400 mt-1 flex items-center gap-1 animate-[fadeIn_0.2s_ease_both]">
                                <span>•</span> {errors.phone}
                            </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                          Order Reference <span className="text-[#666] text-[10px]">(If Applicable)</span>
                        </label>
                        <input
                          type="text"
                          name="orderReference"
                          value={formData.orderReference}
                          onChange={handleInputChange}
                          placeholder="e.g. VEL-89241"
                          className="w-full bg-[#161616] border border-[#262626] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row 3: Nature of Inquiry Dropdown */}
                    <div className="space-y-2">
                      <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                        Nature of Inquiry <span className="text-gold">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className={`w-full bg-[#161616] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] transition-all appearance-none cursor-pointer pr-10 ${
                            errors.department 
                            ? 'border border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
                            : 'border border-[#262626] focus:border-gold focus:ring-1 focus:ring-gold/30'
                          }`}
                        >
                          <option value="" disabled>Select inquiry classification...</option>
                          <option value="bespoke">Bespoke Tailoring & Made-to-Measure</option>
                          <option value="styling">Private Styling & Sizing Consultation</option>
                          <option value="order">Order Concierge & White-Glove Dispatch</option>
                          <option value="returns">Returns & Private Exchanges</option>
                          <option value="boutique">Flagship Boutique Appointment</option>
                          <option value="press">Press, Collaborations & Brand Partnerships</option>
                          <option value="other">General Client Inquiries</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gold absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      {errors.department && (
                        <p className="font-inter text-[11px] text-red-400 mt-1 flex items-center gap-1 animate-[fadeIn_0.2s_ease_both]">
                            <span>•</span> {errors.department}
                        </p>
                       )}
                    </div>

                    {/* Row 4: Preferred Contact Channel */}
                    <div className="space-y-2">
                      <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                        Preferred Response Channel
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'email', label: 'Email', icon: Mail },
                          { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp },
                          { id: 'phone', label: 'Phone Call', icon: Phone }
                        ].map(channel => {
                          const Icon = channel.icon
                          const isSelected = formData.preferredChannel === channel.id
                          return (
                            <button
                              key={channel.id}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, preferredChannel: channel.id }))}
                              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-inter font-medium transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-gold bg-gold/10 text-white shadow-[0_0_10px_rgba(201,169,110,0.15)]' 
                                  : 'border-[#262626] bg-[#161616] text-[#888] hover:text-white hover:border-[#444]'
                              }`}
                            >
                              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-gold' : ''}`} />
                              <span>{channel.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Row 5: Detailed Message */}
                    <div className="space-y-2">
                      <label className="font-inter text-[11px] font-medium uppercase tracking-wider text-[#c7c6c6] block">
                        Your Message / Specifics <span className="text-gold">*</span>
                      </label>
                      <textarea
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Detail your request, preferred dates for fittings, or order specifics..."
                        className={`w-full bg-[#161616] rounded-lg px-4 py-3 text-xs sm:text-sm text-white placeholder-[#555] transition-all resize-none ${
                        errors.message 
                            ? 'border border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/30' 
                            : 'border border-[#262626] focus:border-gold focus:ring-1 focus:ring-gold/30'
                        }`}
                      />
                      {errors.message && (
                        <p className="font-inter text-[11px] text-red-400 mt-1 flex items-center gap-1 animate-[fadeIn_0.2s_ease_both]">
                            <span>•</span> {errors.message}
                        </p>
                       )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-gold via-[#d8bb82] to-gold text-[#0a0a0a] font-inter font-bold text-xs uppercase tracking-[0.25em] py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(201,169,110,0.25)] hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <span>Transmit Inquiry</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                      <p className="font-inter text-[10px] text-[#636565] text-center mt-3 tracking-wider">
                        Protected by end-to-end luxury client discretion protocol.
                      </p>
                    </div>

                  </form>
                </>
              )}

            </div>
          </div>

        </div>

        {/* ── Atelier FAQ Accordion Section ── */}
        <div className="mt-20 pt-16 border-t border-white/5 max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="font-inter text-[10px] font-bold tracking-[0.25em] text-gold uppercase block mb-2">
              Concierge Knowledge Base
            </span>
            <h2 className="font-bodoni text-2xl sm:text-4xl font-normal text-white mb-3">
              Frequently Inquired
            </h2>
            <p className="font-inter text-xs sm:text-sm text-[#8e9192]">
              Answers regarding made-to-measure services, white-glove shipping, and boutique fittings.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div 
                  key={index}
                  className="bg-[#111111]/80 border border-[#222222] rounded-xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className={`font-bodoni text-base sm:text-lg transition-colors ${isOpen ? 'text-gold' : 'text-white group-hover:text-gold'}`}>
                      {faq.question}
                    </span>
                    <div className={`w-7 h-7 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-gold/10 border-gold/30 text-gold' : 'text-[#888]'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm font-inter text-[#998f81] leading-relaxed border-t border-white/5 animate-[fadeIn_0.3s_ease_both]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Bottom Direct Help Banner */}
          <div className="mt-12 p-6 rounded-xl bg-[#0e0e0e] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-bodoni text-base text-white font-medium">Require immediate custom assistance?</h4>
              <p className="font-inter text-xs text-[#777] mt-0.5">Our Private Client Desk is available on WhatsApp 24/7.</p>
            </div>
            <a
              href="https://wa.me/91800835672?text=Hello%20Velora%20Concierge"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#161616] hover:bg-[#202020] border border-gold/40 text-gold font-inter text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2 transition-all shrink-0"
            >
              <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
              Chat on WhatsApp
            </a>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Contact
