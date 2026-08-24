import { setUser, setLoading, setError, clearUser, setVerificationMessage } from "../state/auth.slice.js";
import { register, login, getMe, logout, verifyEmail } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

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

    async function handleVerifyEmail(token) {
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
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout, handleVerifyEmail }
}
