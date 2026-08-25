import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

const ResendVerificationEmail = () => {

  const { handleResendVerificationEmail } = useAuth()

  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const verificationMessage = useSelector(state => state.auth.verificationMessage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
      <div className="h-140 w-90 bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center px-14 py-18">
        <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-4">Velora</h1>
        <div className="bg-gold/10 rounded-full p-3 inline-flex items-center justify-center border border-gold/20 shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-4">
          <Mail size={17} className="text-gold"/>
        </div>
        <h3 className="font-serif text-white text-2xl font-medium tracking-tight text-center mb-2">Resend Verification Link</h3>
        <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Didn't receive the email? Enter your registered email address below and we'll send you a new secure link.</p>
        <form className="flex flex-col gap-1 mb-10">
          <label htmlFor="email" className="font-sans text-white text-xs font-medium uppercase tracking-widest opacity-75">Email Address</label>
          <input type="email" name="email" id="email" placeholder="Enter your email" 
            className="bg-[#1E1E1E] border border-[#2A2A2A] text-white font-sans text-sm rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors px-4 py-3 mb-4"  
          />
          <button className="bg-gold hover:bg-[#b5955a] text-black font-sans text-sm font-bold uppercase tracking-wider rounded-sm px-18 py-3 cursor-pointer transition-[transform, colors] duration-200 active:scale-95">RESEND LINK</button>
        </form>
        <button className="text-gold font-sans text-xs font-bold tracking-wider rounded-sm flex gap-1 cursor-pointer transition-[transform, colors] duration-200 active:scale-95">
          <ArrowLeft size={15} />
          <p>Return to Sign in</p>
        </button>
      </div>
    </div>
  )
}

export default ResendVerificationEmail
