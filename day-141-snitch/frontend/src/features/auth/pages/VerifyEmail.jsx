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
      return <div className="flex flex-col items-center justify-center space-y-6">
            <div className="bg-gold/10 rounded-full inline-flex items-center justify-center shadow- [0_4px_20px_rgba(201,169,110,0.15)] mb-5">
              <Loader2 className="w-16 h-16 text-gold animate-spin" />
            </div>
            <h1 className="text-3xl font-['Bodoni_Moda'] text-white">Verifying...</h1>
            <p className="text-[#888888] font-['Inter']">Please wait while we confirm your exclusive access.</p>
          </div>
    } else if (error) {
      return <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-red-900 blur-xl opacity-20 rounded-full"></div>
              <AlertCircle className="w-24 h-24 text-red-500 relative z-10" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-['Bodoni_Moda'] text-white">Verification Failed</h1>
              <p className="text-[#888888] font-['Inter'] text-lg max-w-md mx-auto">
                {error || "We could not verify your email. The link might be invalid or expired."}
              </p>
            </div>

            <div className="pt-6 w-full flex justify-center">
              <Link 
                to="/resend-verification-email"
                onClick={clearAuthMessages}
                className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#333333] text-white font-semibold tracking-widest text-sm hover:border-black hover:bg-gold hover:text-black transition-all rounded-sm flex items-center justify-center gap-3 uppercase cursor-pointer transition-[transform, colors] duration-200 active:scale-95"
              >
                RESEND VERIFICATION LINK
              </Link>
            </div>
          </div>
    } else if (authMessage) {
      return <div className="flex flex-col items-center justify-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gold blur-xl opacity-20 rounded-full"></div>
              <CheckCircle className="w-24 h-24 text-gold relative z-10" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-['Bodoni_Moda'] text-white">Email Verified</h1>
              <p className="text-[#888888] font-['Inter'] text-lg">
                {authMessage || "Welcome to Velora. Your exclusive access is now granted."}
              </p>
            </div>

            <div className="pt-6 w-full flex justify-center">
              <Link 
                to="/login"
                className="w-full sm:w-auto px-10 py-4 bg-gold text-black font-semibold tracking-widest text-sm hover:bg-[#b5955b] rounded-sm flex items-center justify-center gap-3 uppercase cursor-pointer transition-[transform, colors] duration-200 active:scale-95"
              >
                PROCEED TO LOGIN <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0c0c0c] px-4 py-12">
      <div className="max-w-xl w-full text-center space-y-8 animate-fade-in-up">
        {renderVerifyEmailCard()}
      </div>
    </div>
  );
};

export default VerifyEmail;
