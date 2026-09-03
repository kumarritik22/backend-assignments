import { Link, useNavigate, useParams } from 'react-router'
import { Truck, CheckCircle2, Download, Printer, ArrowLeft, ShieldCheck, Headphones,ExternalLink, ChevronRight,Sparkles} from 'lucide-react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useCart } from '../hooks/useCart.js'

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" }

const ORDER_TIMELINE = [
  {
    title: "Order Placed",
    date: "Payment Verified",
    completed: true,
    active: false
  },
  {
    title: "Atelier Tailoring",
    date: "In Progress",
    completed: false,
    active: true
  },
  {
    title: "Dispatched",
    date: "White-Glove Courier",
    completed: false,
    active: false
  },
  {
    title: "Out for Delivery",
    date: "Pending Dispatch",
    completed: false,
    active: false
  },
  {
    title: "Delivered",
    date: "Recipient Destination",
    completed: false,
    active: false
  }
]

const OrderDetails = () => {

  const { orderId } = useParams()
  const { handleGetOrderDetails } = useCart()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const fetchOrder = async () => {
    try {
      const data = await handleGetOrderDetails({ orderId })
      if (data?.success) {
        setOrder(data.order)
      }
    } catch (error) {
      setError("Order not found or access denied.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect( () => {
    fetchOrder()
  }, [])

  if (isLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
      <h2 className="font-inter text-xs font-bold tracking-[0.25em] text-gold uppercase animate-pulse">Loading Atelier Order Details...</h2>
    </div>
  }

  if (error || !order) {
    return <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
        <h2 className="font-bodoni text-2xl font-bold text-white">Order not found.</h2>
        <p className="font-inter text-xs text-[#888] leading-relaxed">We could not locate this order details. It may not exist or you may need to sign in.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-3 bg-gold text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#E4C285] transition-colors cursor-pointer">Back to Collection</Link>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 sm:pt-8 pb-16 px-4 sm:px-6 lg:px-12 selection:bg-gold/30">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ─── Header & Order Status Hero ─── */}
        <div className="space-y-4">
          {/* Tier 1: Title & Badge on Left, Action Buttons on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-inter text-[10px] font-bold tracking-[0.2em] uppercase mb-2 shadow-[0_0_15px_rgba(201,169,110,0.1)]">
                <Sparkles className="w-3 h-3 text-gold animate-pulse" />
                <span>Order Confirmed</span>
              </div>
              <h1 className="font-bodoni text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                Order Details
              </h1>
            </div>

            {/* Action Buttons (Download, Continue Shopping) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 print:hidden">
              <button 
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/40 text-white font-inter text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-gold" />
                <span>Download Invoice</span>
              </button>
    
              <button 
                onClick={() => navigate('/')}
                className="px-5 py-2.5 rounded-full bg-gold hover:bg-[#E4C285] text-[#0a0a0a] font-inter text-xs font-bold tracking-wider uppercase whitespace-nowrap shadow-[0_0_20px_rgba(201,169,110,0.25)] hover:shadow-[0_0_30px_rgba(201,169,110,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2 print:hidden"
              >
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

          {/* Tier 2: Full-Width Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 font-inter text-xs text-[#888] pt-2 border-t border-white/5">
            <span className="font-mono text-xs text-gold bg-gold/10 px-2.5 py-0.5 rounded-md border border-gold/25 font-medium">
              #{order?.razorpay?.orderId || order?._id}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#444]" />
            <span>Placed on <strong className="text-white font-medium">
              {order?.createdAt 
                ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                : order?._id 
                  ? new Date(parseInt(order._id.substring(0, 8), 16) * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </strong></span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#444]" />
            <span>Estimated Delivery: <strong className="text-gold font-medium">4 – 6 Business Days (White-Glove Courier)</strong></span>
          </div>
        </div>

        {/* ─── Shipment Progress Stepper ─── */}
        <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/20 text-gold">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-inter font-bold text-sm uppercase tracking-wider text-white">
                  Shipment Status
                </h3>
                <p className="font-inter text-xs text-[#777] mt-0.5">
                  Courier: <span className="text-[#bbb]">Bluedart Express (Tracking: VEL-BLU-992140)</span>
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-inter text-[11px] font-bold tracking-widest uppercase">
              {order?.status?.toUpperCase()}
            </span>
          </div>

          {/* Stepper Bar */}
          <div className="relative">
            {/* Desktop / Tablet Horizontal Stepper */}
            <div className="hidden md:grid grid-cols-5 gap-2 relative">
              {/* Background connecting track */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-white/10 z-0" />
              {/* Active gold progress fill */}
              <div className="absolute top-4 left-6 w-[25%] h-0.5 bg-linear-to-r from-gold to-[#E4C285] z-0" />

              {ORDER_TIMELINE.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative z-10">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.completed 
                        ? 'bg-gold text-black shadow-[0_0_15px_rgba(201,169,110,0.5)]' 
                        : step.active 
                        ? 'bg-[#1a1a1a] border-2 border-gold text-gold ring-4 ring-gold/20 shadow-[0_0_20px_rgba(201,169,110,0.3)] animate-pulse' 
                        : 'bg-[#1a1a1a] border border-white/20 text-[#555]'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-black" strokeWidth={2.5} />
                    ) : (
                      <span className="font-inter text-xs font-bold">{index + 1}</span>
                    )}
                  </div>

                  <span className={`font-inter text-[11px] font-bold tracking-wider uppercase mt-3 ${step.active ? 'text-gold' : step.completed ? 'text-white' : 'text-[#666]'}`}>
                    {step.title}
                  </span>
                  <span className="font-inter text-[10px] text-[#555] mt-0.5 max-w-28 leading-tight">
                    {step.date}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile Vertical Stepper */}
            <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-white/10 ml-3">
              {ORDER_TIMELINE.map((step, index) => (
                <div key={index} className="relative">
                  <div 
                    className={`absolute -left-7.75 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-gold text-black' 
                        : step.active 
                        ? 'bg-[#1a1a1a] border-2 border-gold text-gold ring-4 ring-gold/20' 
                        : 'bg-[#1a1a1a] border border-white/20 text-[#555]'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-3.5 h-3.5 text-black" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                  </div>
                  <h4 className={`font-inter text-xs font-bold tracking-wider uppercase ${step.active ? 'text-gold' : step.completed ? 'text-white' : 'text-[#666]'}`}>
                    {step.title}
                  </h4>
                  <p className="font-inter text-[11px] text-[#555] mt-0.5">{step.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main 2-Column Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Itemized Garments List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-5 mb-6">
                <h3 className="font-inter font-bold text-xs uppercase tracking-[0.2em] text-[#888]">
                  Ordered Items ({order?.orderItems?.length || 0})
                </h3>
                <span className="font-inter text-xs text-gold">Velora Atelier Vault</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-white/5">
                {order?.orderItems?.map((item, index) => (
                  <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    {/* Thumbnail */}
                    <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/10 relative group">
                      <img 
                        src={item.images?.[0]?.url || '/model-hero.png'} 
                        alt={item.title} 
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bodoni text-lg font-bold text-white hover:text-gold transition-colors cursor-pointer">
                            {item.title}
                          </h4>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="font-bodoni text-lg font-bold text-white">
                            {CURRENCY_SYMBOLS[item.price?.currency] || '₹'}{Number(item.price?.amount).toLocaleString()}
                          </p>
                          <p className="font-inter text-[11px] text-[#666]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Item Quick Actions */}
                      <div className="flex flex-wrap items-center gap-4 pt-2 font-inter text-[11px] uppercase tracking-wider">
                        <button className="text-gold hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                          <span>View Product</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <span className="text-[#333]">·</span>
                        <button className="text-[#888] hover:text-white transition-colors cursor-pointer">
                          Write a Review
                        </button>
                        <span className="text-[#333]">·</span>
                        <button className="text-[#888] hover:text-white transition-colors cursor-pointer">
                          Return / Exchange
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Financial Breakdown & Shipping Details (4 cols) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Payment & Invoice Summary */}
            <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-5">
              <h3 className="font-inter font-bold text-xs uppercase tracking-[0.2em] text-[#888] border-b border-white/5 pb-4">
                Financial Summary
              </h3>

              <div className="space-y-3 font-inter text-xs">
                {/* Items Subtotal */}
                <div className="flex justify-between text-[#888]">
                  <span>Items Subtotal</span>
                  <span className="text-white font-medium">
                    {CURRENCY_SYMBOLS[order?.price?.currency] || '₹'}{Number(order?.price?.amount).toLocaleString()}
                  </span>
                </div>

                {/* Complimentary Delivery */}
                <div className="flex justify-between text-[#888]">
                  <span>Shipping</span>
                  <span className="text-gold uppercase tracking-wider font-semibold">Complimentary</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between text-[#888]">
                  <span>Taxes (GST 18%)</span>
                  <span className="text-[#bbb]">
                    Included ({CURRENCY_SYMBOLS[order?.price?.currency] || '₹'}{Number(order?.price?.amount * 0.18 / 1.18).toFixed(0)})
                  </span>
                </div>

                {/* Grand Total Container */}
                <div className="border-t border-white/10 pt-4 mt-2 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-inter font-bold text-xs uppercase tracking-widest text-white">Grand Total</span>
                    <span className="font-bodoni text-2xl font-bold text-gold">
                      {CURRENCY_SYMBOLS[order?.price?.currency] || '₹'}{Number(order?.price?.amount).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#666] text-right">
                    All taxes & luxury duties included
                  </p>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="bg-[#181818] border border-white/5 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-inter text-[#777] uppercase text-[10px] tracking-wider">Payment Method</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-inter text-[10px] uppercase font-bold tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Paid
                  </span>
                </div>
                <p className="font-inter text-xs text-white font-medium">Razorpay ({order?.price?.currency || 'INR'})</p>
                <p className="font-mono text-[10px] text-[#555]">TXN: {order?.razorpay?.paymentId || order?.razorpay?.orderId}</p>
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="bg-[#121212]/90 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-xl shadow-2xl space-y-4">
              <h3 className="font-inter font-bold text-xs uppercase tracking-[0.2em] text-[#888] border-b border-white/5 pb-4">
                Delivery Address
              </h3>

              <div className="font-inter text-xs space-y-1.5 text-[#aaa]">
                <p className="font-bold text-white text-sm">{order?.user?.fullname || 'Velora Client'}</p>
                <p className="pt-2 text-[#666]">Phone: <span className="text-[#888]">{order?.user?.contact || 'Not provided'}</span></p>
                <p className="text-[#666]">Email: <span className="text-[#888]">{order?.user?.email}</span></p>
              </div>
            </div>

            {/* 24/7 Client Concierge Support Card */}
            <div className="bg-linear-to-br from-[#161616] to-[#121212] border border-gold/20 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gold/10 text-gold">
                  <Headphones className="w-4 h-4" />
                </div>
                <h4 className="font-inter font-bold text-xs uppercase tracking-widest text-gold">
                  VIP Concierge
                </h4>
              </div>

              <p className="font-inter text-xs text-[#888] leading-relaxed mb-4">
                Have questions regarding your tailoring or delivery timeline? Our private client advisors are available 24/7.
              </p>

              <Link 
                to="/about"
                className="inline-flex items-center gap-2 font-inter text-xs font-bold uppercase tracking-widest text-white hover:text-gold transition-colors cursor-pointer"
              >
                <span>Connect with Concierge</span>
                <ChevronRight className="w-3.5 h-3.5 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default OrderDetails
