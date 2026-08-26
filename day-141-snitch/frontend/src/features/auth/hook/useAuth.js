import { setUser, setLoading, setError, clearUser, setVerificationMessage, setVerificationType } from "../state/auth.slice.js";
import { register, login, getMe, logout, verifyEmail, resendVerificationEmail } from "../service/auth.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useAuth = () => {
    
    const dispatch = useDispatch()

    async function handleRegister({fullname, email, contact, password, isSeller = false}) {
        const data = await register({fullname, email, contact, password, isSeller})
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleLogin({email, password}) {
        try {
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.response.data.message))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            console.log(error)
        } finally {
            dispatch(setLoading(false))
        } 
    }

    async function handleLogout() {
        const data = await logout()
        dispatch(clearUser());
    }

    const handleVerifyEmail = useCallback(
        async (token) => {
            dispatch(setLoading(true))
            dispatch(setError(null))
            dispatch(setVerificationMessage(null))
            try {
                const data = await verifyEmail({ token })
                    dispatch(setVerificationMessage(data.message))
                    dispatch(setLoading(false))
            } catch (error) {
                    dispatch(setError(error.response.data.message))
                    dispatch(setLoading(false))
            } 
        },
        [dispatch, verifyEmail]
    );

    async function handleResendVerificationEmail({ email }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        dispatch(setVerificationMessage(null))
        try {
            const data = await resendVerificationEmail({ email }) 
            dispatch(setVerificationMessage(data.message))
            dispatch(setVerificationType(data.type))
            dispatch(setLoading(false))
        } catch (error) {
            dispatch(setError(error.response.data.message))
            dispatch(setLoading(false))
        }
    } 

    return { handleRegister, handleLogin, handleGetMe, handleLogout, handleVerifyEmail, handleResendVerificationEmail }
}
