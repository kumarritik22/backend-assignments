import { useState } from "react";
import { useAuth } from "../hook/useAuth.js"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { setAuthMessage, setError } from "../state/auth.slice";

const ResetPassword = () => {

    const { handleResetPassword} = useAuth()

    const authMessage = useSelector(state => state.auth.authMessage);
    const error = useSelector(state => state.auth.error);

    const [isSubmitting, setIsSubmitting] = useState(false)

    const dispatch = useDispatch()
    
    const handleForm = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        await handleResetPassword({ email, newPassword })
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

  return (
    <div>
      ResetPassword
    </div>
  )
}

export default ResetPassword
