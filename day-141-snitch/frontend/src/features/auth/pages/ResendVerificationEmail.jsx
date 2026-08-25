import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { Loader2 } from "lucide-react";

const ResendVerificationEmail = () => {

  const { handleResendVerificationEmail } = useAuth()

  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const verificationMessage = useSelector(state => state.auth.verificationMessage);

  return (
    <div>Resend Verification Email</div>
  )
}

export default ResendVerificationEmail
