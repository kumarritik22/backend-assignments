import { setUser, setLoading, setError, clearUser, setVerificationType, setAuthMessage, setAuthType } from "../state/auth.slice.js";
import { register, login, getMe, logout, verifyEmail, resendVerificationEmail, forgotPassword, resetPasswordApi } from "../service/auth.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useAuth = () => {
    
    const dispatch = useDispatch()

    async function handleRegister({fullname, email, contact, password, isSeller = false}) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const data = await register({fullname, email, contact, password, isSeller})
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            if (error.response.data.errors) {
                return (error.response.data.errors)
            } else {
                dispatch(setError(error.response.data.message))
            }
        } finally {
            dispatch(setLoading(false))
        }
    };

    async function handleLogin({email, password}) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    };

    async function handleGetMe() {
        dispatch(setLoading(true))
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setLoading(false))
        } 
    };

    async function handleLogout() {
        dispatch(setLoading(true))
        try {
            const data = await logout()
            dispatch(clearUser());
        } catch (error) {
            console.error(error)
        } finally {
            dispatch(setLoading(false))
        }
    };

    const handleVerifyEmail = useCallback(
        async (token) => {
            dispatch(setLoading(true))
            dispatch(setError(null))
            dispatch(setAuthMessage(null))
            try {
                const data = await verifyEmail({ token })
                dispatch(setAuthMessage(data.message))
            } catch (error) {
                dispatch(setError(error.response.data.message))
            } finally {
                dispatch(setLoading(false))
            }
        },
        [dispatch, verifyEmail]
    );

    async function handleResendVerificationEmail({ email }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        dispatch(setAuthMessage(null))
        try {
            const data = await resendVerificationEmail({ email }) 
            dispatch(setAuthMessage(data.message))
            dispatch(setVerificationType(data.type))
        } catch (error) {
            dispatch(setError(error.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    };

    async function handleForgotPassword({ email }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        dispatch(setAuthMessage(null))
        try {
            const data = await forgotPassword({ email })
            dispatch(setAuthMessage(data.message))
            dispatch(setAuthType(data.type))
        } catch (error) {
            dispatch(setError(error.response.data.message))
        } finally {
            dispatch(setLoading(false))
        }
    };

    async function handleResetPassword({ token, newPassword }) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        dispatch(setAuthMessage(null))
        await new Promise(resolve => setTimeout(resolve, 2000))
        try {
            const data = await resetPasswordApi({ token, newPassword })
            dispatch(setAuthMessage(data.message))
        } catch (error) {
            if (error.response.data.errors) {
                return (error.response.data.errors)
            } else {
                dispatch(setError(error.response.data.message))
            }
        } finally {
            dispatch(setLoading(false))
        }
    };

    return { handleRegister, handleLogin, handleGetMe, handleLogout, handleVerifyEmail, handleResendVerificationEmail, handleForgotPassword, handleResetPassword }
}
