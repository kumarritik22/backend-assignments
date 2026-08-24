import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth.js";
import { useEffect } from "react";
import { useParams } from "react-router-dom";


const VerifyEmail = () => {

  const { token } = useParams()

  const { handleVerifyEmail } = useAuth();
  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const verificationMessage = useSelector(state => state.auth.verificationMessage);

  useEffect(() => {
    handleVerifyEmail(token)
  }, [handleVerifyEmail, token])
  
  return (
    <div>
      { loading ? <p>Verifying your email...</p> : null }
      <h2>{verificationMessage}</h2>
      <p>{error}</p>
    </div>
  )
}

export default VerifyEmail
