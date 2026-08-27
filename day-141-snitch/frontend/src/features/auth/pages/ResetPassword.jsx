import { useState } from "react";
import { useAuth } from "../hook/useAuth.js"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { setAuthMessage, setError } from "../state/auth.slice.js";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, LockKeyhole } from "lucide-react";

const ResetPassword = () => {

    const { handleResetPassword} = useAuth()

    const { token } = useParams()

    const authMessage = useSelector(state => state.auth.authMessage);
    const error = useSelector(state => state.auth.error);

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [localError, setLocalError] = useState("")

    const dispatch = useDispatch()
    
    const handleForm = async (e) => {
        e.preventDefault()

        setLocalError("")

        if (!newPassword || !confirmPassword) {
          return setLocalError("Form cannot be empty.")
        }
        if (newPassword !== confirmPassword) {
          return setLocalError("Passwords do not match.")
          
        }
        setIsSubmitting(true)
        await handleResetPassword({ token, newPassword })
        setIsSubmitting(false)  
    }

    const clearAuthMessages = () => {
        dispatch(setError(null))
        dispatch(setAuthMessage(null))
    }

    useEffect(() => {
        return () => {
        clearAuthMessages()
        }
    }, [])

    const renderResetPasswordCard = () => {
        if (isSubmitting) {
        return <div className="loading-state w-full max-w-md bg-[#111111] border border-[#2A2A2A] rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
            <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
            <div className="bg-gold/10 rounded-full inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-5">
            <Loader2 className="w-16 h-16 text-gold animate-spin" />
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-center mb-2">Resetting Password...</h2>
            <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Please wait while we securely update your credentials.</p>
        </div>
        } else if (error) {
        return <div className="error-state w-full max-w-md bg-[#111111] border border-[#2A2A2A]    rounded-lg shadow-2xl flex items-center flex-col justify-center p-12">
            <h1 className="font-serif text-white text-3xl uppercase tracking-widest mb-6">Velora</h1>
            <div className="relative">
            <div className="absolute inset-0 bg-red-900 blur-xl opacity-20 rounded-full"></div>
            <AlertCircle className="w-24 h-24 text-red-500 relative z-10" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-medium tracking-tight text-center mb-2">Unable to Reset Password</h2>
            <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">{error}</p>
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
            <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-7">Your password has been securely updated. You can now log in with your new credentials.</p>
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
            <LockKeyhole size={17} className="text-gold" />
            </div>
            <h3 className="font-serif text-white text-2xl font-medium tracking-tight mb-2">Set New Password</h3>
            <p className="font-sans text-[#888888] text-sm leading-relaxed text-center mb-5">Please enter your new password below. Ensure it is at least 8 characters long.</p>
            {localError && (
                <div className="mb-5 flex items-center gap-3 rounded-md border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-400/40 text-[11px] font-bold">
                        !
                    </span>
                    <p>{localError}</p>
                </div>
              )}
            <form 
              className="w-full flex flex-col mb-10"
              onSubmit={handleForm}
              >
              <input 
                  type="password" 
                  name="new password" 
                  id="new password" 
                  placeholder="New Password" 
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="bg-[#1E1E1E] border border-[#2A2A2A] text-white font-sans text-sm rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors px-4 py-3 mb-5"  
              />
              <input 
                  type="password" 
                  name="confirm password" 
                  id="confirm password" 
                  placeholder="Confirm Password" 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="bg-[#1E1E1E] border border-[#2A2A2A] text-white font-sans text-sm rounded-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors px-4 py-3 mb-5"  
              />
              <button 
                disabled={isSubmitting}
                className="bg-gold w-full hover:bg-[#b5955a] text-black font-sans text-sm font-bold uppercase tracking-wider rounded-sm py-3 cursor-pointer transition-[transform, colors] duration-200 active:scale-95">
                RESET PASSWORD
              </button>
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
      {renderResetPasswordCard()}
    </div>
  )
}

export default ResetPassword
