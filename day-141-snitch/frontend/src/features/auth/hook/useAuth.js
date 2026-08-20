import { setUser, setLoading, setError, clearUser } from "../state/auth.slice.js";
import { register, login, getMe, logout } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    
    const dispatch = useDispatch()

    async function handleRegister({fullname, email, contact, password, isSeller = false}) {
        const data = await register({fullname, email, contact, password, isSeller})
        dispatch(setUser(data.user))
        return data.user
    }

    async function handleLogin({email, password}) {
        const data = await login({email, password})
        dispatch(setUser(data.user))
        return data.user
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

    return {handleRegister, handleLogin, handleGetMe, handleLogout}
}
