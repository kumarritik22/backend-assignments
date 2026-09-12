import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { setError, setAuthMessage, setVerificationType } from "../state/auth.slice.js";

const VerifyEmail = () => {
  const { token } = useParams();
  const { handleVerifyEmail } = useAuth();
  
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const authMessage = useSelector(state => state.auth.authMessage);

  const dispatch = useDispatch()

  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const verify = async () => {
      if (token) {
        setIsVerifying(true);
        await handleVerifyEmail(token);
        setIsVerifying(false);
      }
    }

    verify();
  }, [handleVerifyEmail, token]);

  const clearAuthMessages = () => {
    dispatch(setError(null))
    dispatch(setAuthMessage(null))
    dispatch(setVerificationType(null))
  }

  const renderVerifyEmailCard = () => {
    if (isVerifying || loading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-gold/10 rounded-full p-4 inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-2">
            <Loader2 className="w-12 h-12 text-gold animate-spin" />
          </div>
          <h1 className="text-3xl font-bodoni font-bold text-[#121212] dark:text-white">Verifying...</h1>
          <p className="text-[#636059] dark:text-[#888888] font-inter text-sm">Please wait while we confirm your exclusive access.</p>
        </div>
      )
    } else if (error) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-red-500/20 blur-xl opacity-40 rounded-full"></div>
            <AlertCircle className="w-16 h-16 text-red-500 relative z-10" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-3 text-center">
            <h1 className="text-3xl sm:text-4xl font-bodoni font-bold text-[#121212] dark:text-white">Verification Failed</h1>
            <p className="text-[#636059] dark:text-[#888888] font-inter text-sm max-w-md mx-auto leading-relaxed">
              {error || "We could not verify your email. The link might be invalid or expired."}
            </p>
          </div>

          <div className="pt-4 w-full flex justify-center">
            <Link 
              to="/resend-verification-email"
              onClick={clearAuthMessages}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-black/15 dark:border-[#333333] text-[#121212] dark:text-white font-inter font-bold tracking-[0.16em] text-xs hover:border-gold hover:bg-gold hover:text-black transition-all rounded-lg flex items-center justify-center gap-3 uppercase cursor-pointer active:scale-95"
            >
              RESEND VERIFICATION LINK
            </Link>
          </div>
        </div>
      )
    } else if (authMessage) {
      return (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative mb-2">
            <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
            <CheckCircle className="w-16 h-16 text-gold relative z-10" strokeWidth={1.5} />
          </div>
          
          <div className="space-y-3 text-center">
            <h1 className="text-3xl sm:text-4xl font-bodoni font-bold text-[#121212] dark:text-white">Email Verified</h1>
            <p className="text-[#636059] dark:text-[#888888] font-inter text-sm leading-relaxed">
              {authMessage || "Welcome to Velora. Your exclusive access is now granted."}
            </p>
          </div>

          <div className="pt-4 w-full flex justify-center">
            <Link 
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-linear-to-r from-gold to-gold-dark hover:from-gold-light hover:to-gold text-[#0a0a0a] font-inter font-bold tracking-[0.16em] text-xs rounded-lg flex items-center justify-center gap-2 uppercase cursor-pointer shadow-md shadow-gold/10 transition-all duration-200 active:scale-95"
            >
              PROCEED TO LOGIN <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F5F2] dark:bg-[#0c0c0c] px-4 py-12 transition-colors duration-300">
      <div className="max-w-xl w-full text-center space-y-8 bg-white dark:bg-[#111111] border border-black/10 dark:border-[#2A2A2A] rounded-2xl shadow-xl dark:shadow-2xl p-8 sm:p-12 animate-[fadeInUp_0.4s_ease_both]">
        {renderVerifyEmailCard()}
      </div>
    </div>
  );
};

export default VerifyEmail;
