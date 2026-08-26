import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { setError, setAuthMessage, setVerificationType } from "../state/auth.slice.js";

const ResendVerificationEmail = () => {

  const { handleResendVerificationEmail } = useAuth()

  const error = useSelector(state => state.auth.error);
  const authMessage = useSelector(state => state.auth.authMessage);
  const verificationType = useSelector(state => state.auth.verificationType);

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dispatch = useDispatch()

  const handleForm = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await handleResendVerificationEmail({ email })
    setIsSubmitting(false)
  }

  const clearAuthMessages = () => {
    dispatch(setError(null))
    dispatch(setAuthMessage(null))
    dispatch(setVerificationType(null))
  }

  useEffect(() => {
    return () => {
      clearAuthMessages()
    }
  }, [])
  

  const renderResendVerificationCard = () => {
    if (isSubmitting) {
      return <div className="loading-state w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
        <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
        <div className="bg-gold/10 rounded-full inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-5">
          <Loader2 className="w-16 h-16 text-gold animate-spin" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-center mb-2">Sending Link...</h2>
        <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Please wait while we prepare your secure verification link.</p>
      </div>
    } else if (error) {
      return <div className="error-state w-full max-w-md bg-[#111111] border border-[#2A2A2A]    rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
        <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
        <div className="relative">
          <div className="absolute inset-0 bg-red-900 blur-xl opacity-20 rounded-full"></div>
          <AlertCircle className="w-24 h-24 text-red-500 relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-center mb-2">Unable to Send Link</h2>
        <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">{error}, we couldn't find an account associated with that email, or there was a system error. </p>
        <button 
          onClick={clearAuthMessages}
          className="bg-gold w-full hover:bg-[#b5955a] text-black font-sans text-sm font-bold uppercase tracking-wider rounded-sm py-3 cursor-pointer transition-[transform, colors] duration-200 active:scale-95 mb-3"
        >
          TRY AGAIN
        </button>
        <Link
          to="/login"
          onClick={clearAuthMessages}
          className="w-full sm:w-auto px-10 py-4 text-gold font-semibold tracking-widest text-sm transition-colors rounded-sm uppercase"
        >
          RETURN TO LOGIN
        </Link>
      </div>
    } else if (authMessage) {
      return <div className="success-state w-full max-w-md bg-[#111111] border border-[#2A2A2A]     rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
        <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
        <div className="relative mb-2">
          <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
          <CheckCircle className="w-24 h-24 text-gold relative z-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-center mb-4">{authMessage}</h2>
        {verificationType === "emailSent" && (
          <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">We've sent a new verification link to your email address. Please check your inbox and spam folder.</p>
        )}
        <Link 
          to="/login"
          className="w-full sm:w-auto px-10 py-4 bg-gold text-black font-semibold tracking-widest text-sm hover:bg-[#b5955b] rounded-sm flex items-center justify-center gap-3 uppercase cursor-pointer transition-[transform, colors] duration-200 active:scale-95"
        >
          RETURN TO LOGIN
        </Link>
      </div>
    } else {
      return <div className="form-state w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
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
            value={email}
            className="bg-[#1E1E1E] border border-[#2A2A2A] text-white font-sans text-sm rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors px-4 py-3 mb-5"  
          />
          <button className="bg-gold w-full hover:bg-[#b5955a] text-black font-sans text-sm font-bold uppercase tracking-wider rounded-sm py-3 cursor-pointer transition-[transform, colors] duration-200 active:scale-95">RESEND LINK</button>
        </form>
        <Link
          to="/login"
          className="text-gold font-sans text-xs font-bold tracking-wider rounded-sm flex gap-1 items-center cursor-pointer transition-[transform, colors] duration-200 active:scale-95" 
        >
          <ArrowLeft size={15} />
          <p>Return to Sign in</p>
        </Link>
      </div>
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
      {renderResendVerificationCard()}
    </div>
  )
}

export default ResendVerificationEmail
