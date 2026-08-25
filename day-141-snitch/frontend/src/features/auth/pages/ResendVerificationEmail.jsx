import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useState } from "react";

const ResendVerificationEmail = () => {

  const { handleResendVerificationEmail } = useAuth()

  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const verificationMessage = useSelector(state => state.auth.verificationMessage);

  const [email, setEmail] = useState("")

  const handleForm = (e) => {
    e.preventDefault()
    handleResendVerificationEmail({ email })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
      <div className="form-state w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
        <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-4">Velora</h1>
        <div className="bg-gold/10 rounded-full p-3 inline-flex items-center justify-center border border-gold/20 shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-4">
          <Mail size={17} className="text-gold"/>
        </div>
        <h3 className="font-serif text-white text-2xl font-medium tracking-tight mb-2">Resend Verification Link</h3>
        <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Didn't receive the email? Enter your registered email address below and we'll send you a new secure link.</p>
        <form 
          className="w-full flex flex-col mb-10"
          onSubmit={handleForm}
        >
          <label htmlFor="email" className="font-sans text-white text-xs font-medium uppercase tracking-widest opacity-75 mb-2">Email Address</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter your email" 
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#1E1E1E] border border-[#2A2A2A] text-white font-sans text-sm rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors px-4 py-3 mb-5"  
          />
          <button className="bg-gold w-full hover:bg-[#b5955a] text-black font-sans text-sm font-bold uppercase tracking-wider rounded-sm py-3 cursor-pointer transition-[transform, colors] duration-200 active:scale-95">RESEND LINK</button>
        </form>
        <button className="text-gold font-sans text-xs font-bold tracking-wider rounded-sm flex gap-1 items-center cursor-pointer transition-[transform, colors] duration-200 active:scale-95">
          <ArrowLeft size={15} />
          <p>Return to Sign in</p>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
          <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
          <div className="bg-gold/10 rounded-full inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-5">
            <Loader2 className="w-16 h-16 text-gold animate-spin" />
          </div>
          <h2 className="text-2xl font-medium tracking-tight text-center mb-2">Sending Link...</h2>
          <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Please wait while we prepare your secure verification link.</p>
        </div>
      )}
    </div>
  )
}

export default ResendVerificationEmail
