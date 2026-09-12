import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth.js"
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
        const result = await handleResetPassword({ token, newPassword, confirmPassword })
        if (result) {
          setLocalError(result[0].msg)
        }
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
        return <div className="loading-state w-full max-w-md bg-white dark:bg-[#111111] border border-black/10 dark:border-[#2A2A2A] rounded-2xl shadow-xl dark:shadow-2xl flex items-center flex-col justify-center p-8 sm:p-12 animate-[fadeInUp_0.4s_ease_both]">
            <h1 className="font-bodoni text-[#121212] dark:text-white text-3xl font-bold uppercase tracking-widest mb-6">Velora</h1>
            <div className="bg-gold/10 rounded-full p-4 inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-5">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
            </div>
            <h2 className="font-bodoni text-2xl font-bold tracking-tight text-[#121212] dark:text-white text-center mb-2">Resetting Password...</h2>
            <p className="font-inter text-[#636059] dark:text-[#888888] text-sm leading-relaxed text-center mb-4">Please wait while we securely update your credentials.</p>
        </div>
        } else if (error) {
        return <div className="error-state w-full max-w-md bg-white dark:bg-[#111111] border border-black/10 dark:border-[#2A2A2A] rounded-2xl shadow-xl dark:shadow-2xl flex items-center flex-col justify-center p-8 sm:p-12 animate-[fadeInUp_0.4s_ease_both]">
            <h1 className="font-bodoni text-[#121212] dark:text-white text-3xl font-bold uppercase tracking-widest mb-6">Velora</h1>
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-40 rounded-full"></div>
              <AlertCircle className="w-16 h-16 text-red-500 relative z-10" strokeWidth={1.5} />
            </div>
            <h2 className="font-bodoni text-2xl font-bold tracking-tight text-[#121212] dark:text-white text-center mb-2">Unable to Reset Password</h2>
            <p className="font-inter text-[#636059] dark:text-[#888888] text-sm leading-relaxed text-center mb-7">{error}</p>
            <button 
              onClick={clearAuthMessages}
              className="bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-[0.16em] rounded-lg py-3.5 w-full cursor-pointer shadow-md shadow-gold/10 transition-all duration-200 active:scale-95 mb-3"
            >
              TRY AGAIN
            </button>
            <Link
                to="/login"
                onClick={clearAuthMessages}
                className="w-full text-center py-3 text-[#8C703B] dark:text-gold hover:text-gold font-inter font-bold tracking-widest text-xs transition-colors rounded-lg uppercase"
            >
              RETURN TO LOGIN
            </Link>
        </div>
        } else if (authMessage) {
        return <div className="success-state w-full max-w-md bg-white dark:bg-[#111111] border border-black/10 dark:border-[#2A2A2A] rounded-2xl shadow-xl dark:shadow-2xl flex items-center flex-col justify-center p-8 sm:p-12 animate-[fadeInUp_0.4s_ease_both]">
            <h1 className="font-bodoni text-[#121212] dark:text-white text-3xl font-bold uppercase tracking-widest mb-6">Velora</h1>
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
              <CheckCircle className="w-16 h-16 text-gold relative z-10" strokeWidth={1.5} />
            </div>
            <h2 className="font-bodoni text-2xl font-bold tracking-tight text-[#121212] dark:text-white text-center mb-3">{authMessage}</h2>
            <p className="font-inter text-[#636059] dark:text-[#888888] text-sm leading-relaxed text-center mb-7">Your password has been securely updated. You can now log in with your new credentials.</p>
            <Link 
                to="/login"
                className="w-full py-3.5 bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-[#0a0a0a] font-inter font-bold tracking-[0.16em] text-xs rounded-lg flex items-center justify-center uppercase cursor-pointer shadow-md shadow-gold/10 transition-all duration-200 active:scale-95"
            >
              RETURN TO LOGIN
            </Link>
        </div>
        } else {
        return <div className="form-state w-full max-w-md bg-white dark:bg-[#111111] border border-black/10 dark:border-[#2A2A2A] rounded-2xl shadow-xl dark:shadow-2xl flex items-center flex-col justify-center p-8 sm:p-12 animate-[fadeInUp_0.4s_ease_both]">
            <h1 className="font-bodoni text-[#121212] dark:text-white text-3xl font-bold uppercase tracking-widest mb-4">Velora</h1>
            <div className="bg-gold/10 rounded-full p-3.5 inline-flex items-center justify-center border border-gold/25 shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-4">
              <LockKeyhole size={18} className="text-gold" />
            </div>
            <h3 className="font-bodoni text-[#121212] dark:text-white text-2xl font-bold tracking-tight mb-2">Set New Password</h3>
            <p className="font-inter text-[#636059] dark:text-[#888888] text-sm leading-relaxed text-center mb-6">Please enter your new password below. Ensure it is at least 8 characters long.</p>
            {localError && (
                <div className="mb-5 w-full flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 dark:bg-red-400/5 px-4 py-3 text-sm text-red-600 dark:text-red-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-500/40 text-[11px] font-bold">
                        !
                    </span>
                    <p>{localError}</p>
                </div>
            )}
            <form 
              className="w-full flex flex-col mb-6"
              onSubmit={handleForm}
              noValidate
              >
              <label htmlFor="new-password" className="font-inter text-[#8C703B] dark:text-gold text-[10px] font-bold uppercase tracking-widest mb-2">New Password</label>
              <input 
                  type="password" 
                  name="new password" 
                  id="new-password" 
                  placeholder="Enter new password" 
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="bg-[#FBFBF9] dark:bg-[#1E1E1E] border border-black/10 dark:border-[#2A2A2A] text-[#121212] dark:text-white placeholder-[#9E9B95] dark:placeholder-[#555] font-inter text-sm rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all px-4 py-3 mb-4"  
              />
              <label htmlFor="confirm-password" className="font-inter text-[#8C703B] dark:text-gold text-[10px] font-bold uppercase tracking-widest mb-2">Confirm Password</label>
              <input 
                  type="password" 
                  name="confirm password" 
                  id="confirm-password" 
                  placeholder="Confirm your password" 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="bg-[#FBFBF9] dark:bg-[#1E1E1E] border border-black/10 dark:border-[#2A2A2A] text-[#121212] dark:text-white placeholder-[#9E9B95] dark:placeholder-[#555] font-inter text-sm rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all px-4 py-3 mb-5"  
              />
              <button 
                disabled={isSubmitting}
                className="bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold w-full text-[#0a0a0a] font-inter text-xs font-bold uppercase tracking-[0.16em] rounded-lg py-3.5 cursor-pointer shadow-md shadow-gold/10 transition-all duration-200 active:scale-95"
              >
                RESET PASSWORD
              </button>
            </form>
            <Link
                to="/login"
                className="text-[#8C703B] dark:text-gold hover:text-gold dark:hover:text-gold-light font-inter text-xs font-bold tracking-wider rounded-sm flex gap-1.5 items-center cursor-pointer transition-colors active:scale-95" 
            >
              <ArrowLeft size={15} />
              <p>Return to Sign in</p>
            </Link>
        </div>
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F5F2] dark:bg-[#0A0A0A] text-[#121212] dark:text-white px-4 py-12 transition-colors duration-300">
      {renderResetPasswordCard()}
    </div>
  )
}

export default ResetPassword
