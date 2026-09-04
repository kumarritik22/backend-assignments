import { useEffect } from "react"
import { useCart } from "../hooks/useCart.js"
import { useState } from "react"
import { Link, useNavigate } from "react-router";
import { Package, ArrowRight, ShieldCheck, Sparkles, ShoppingBag, ChevronRight, Clock, AlertCircle } from "lucide-react";

const CURRENCY_SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" }

// Helper to format date cleanly even if createdAt was missing
const formatOrderDate = (order) => {
  if (order?.createdAt) {
    return new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (order?._id) {
    try {
      const timestamp = parseInt(order._id.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return "Recent Order";
    }
  }
  return "Recent Order";
};

// Helper for dynamic status badge styling
const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        label: "PAID & CONFIRMED",
        className: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
        icon: ShieldCheck
      };
    case "failed":
      return {
        label: "PAYMENT FAILED",
        className: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        icon: AlertCircle
      };
    case "pending":
    default:
      return {
        label: "PENDING",
        className: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        icon: Clock
      };
  }
};

const MyOrders = () => {

    const { handleGetUserOrders } = useCart()

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [Error, setError] = useState("")

    const fetchOrders = async () => {
      try {
        const data = await handleGetUserOrders()
        if (data.success) {
          setOrders(data.orders)
        }
      } catch (error) {
        setError("Unable to fetch orders.")
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      fetchOrders()
    }, [])
   
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
          <h2 className="font-inter text-xs font-bold tracking-[0.25em] text-gold uppercase animate-pulse">
            Loading Your Orders...
          </h2>
        </div>
      )
    }

    if (!orders || orders.length === 0) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 pt-10 pb-20">
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto text-gold shadow-[0_0_20px_rgba(201,169,110,0.15)]">
              <ShoppingBag className="w-7 h-7 text-gold" />
            </div>
            <h2 className="font-bodoni text-2xl font-bold text-white">Your Order Vault is Empty</h2>
            <p className="font-inter text-xs text-[#888] leading-relaxed">
              You haven't placed any orders yet. Discover our latest ready-to-wear and bespoke luxury pieces.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-gold text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#E4C285] transition-all duration-300 shadow-[0_0_20px_rgba(201,169,110,0.2)] cursor-pointer"
            >
              <span>Discover Collection</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      )
    }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-6 sm:pt-8 pb-20 px-4 sm:px-6 lg:px-12 selection:bg-gold/30">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* ─── Header Section ─── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-inter text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 shadow-[0_0_15px_rgba(201,169,110,0.1)]">
              <Sparkles className="w-3 h-3 text-gold animate-pulse" />
              <span>Order Archive</span>
            </div>
            <h1 className="font-bodoni text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              My Orders
            </h1>
            <p className="font-inter text-xs text-[#888]">
              Review your past orders, delivery tracking, and bespoke receipts.
            </p>
          </div>
          <span className="font-inter text-xs text-[#888] uppercase tracking-wider">
            Total Orders: <strong className="text-gold font-bold">{orders.length}</strong>
          </span>
        </div>

        {/* ─── Orders List ─── */}
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusBadge(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div 
                key={order._id}
                className="bg-[#121212]/90 border border-white/10 hover:border-gold/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 space-y-6 group"
              >
                {/* Card Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-gold bg-gold/10 px-2.5 py-0.5 rounded-md border border-gold/25 font-medium">
                      #{order.razorpay?.orderId || order._id}
                    </span>
                    <span className="text-xs text-[#666]">·</span>
                    <span className="font-inter text-xs text-[#888]">
                      Placed on {formatOrderDate(order)}
                    </span>
                  </div>

                  <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-inter text-[10px] font-bold tracking-widest uppercase ${statusInfo.className}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                </div>

                {/* Purchased Garments Reel */}
                <div className="divide-y divide-white/5">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-[#181818] shrink-0 border border-white/10">
                          <img 
                            src={item.images?.[0]?.url || '/model-hero.png'} 
                            alt={item.title} 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div>
                          <h4 className="font-bodoni text-base font-bold text-white group-hover:text-gold transition-colors">
                            {item.title}
                          </h4>
                          {item.attributes && Object.keys(item.attributes).length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {Object.entries(item.attributes).map(([key, val]) => (
                                <span key={key} className="text-[10px] font-inter text-[#aaa] capitalize">
                                  <span className="text-[#666]">{key}: </span>
                                  <span className="text-white font-medium">{val}</span>
                                  <span className="text-[#444] ml-1.5 last:hidden">·</span>
                                </span>
                              ))}
                            </div>
                          )}
                          <p className="font-inter text-[11px] text-[#666] mt-0.5">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="font-bodoni text-base font-bold text-white text-right">
                        {CURRENCY_SYMBOLS[item.price?.currency] || '₹'}{Number(item.price?.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Card Footer (Total & View Details CTA) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-white/5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-inter text-xs text-[#888] uppercase tracking-wider">Total Paid:</span>
                    <span className="font-bodoni text-xl font-bold text-gold">
                      {CURRENCY_SYMBOLS[order.price?.currency] || '₹'}{Number(order.price?.amount).toLocaleString()}
                    </span>
                  </div>

                  <Link 
                    to={`/order/${order.razorpay?.orderId || order._id}`}
                    className="px-6 py-2.5 rounded-full bg-gold hover:bg-[#E4C285] text-[#0a0a0a] font-inter text-xs font-bold tracking-wider uppercase whitespace-nowrap shadow-[0_0_15px_rgba(201,169,110,0.2)] hover:shadow-[0_0_25px_rgba(201,169,110,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>View Order Details</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
