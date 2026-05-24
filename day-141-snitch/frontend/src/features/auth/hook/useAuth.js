import { setUser, setLoading, setError } from "../state/auth.slice.js";
import { register } from "../service/auth.api.js";
import { useDispatch } from "react-redux";

export const useAuth = () => {
    
    const dispatch = useDispatch()

    async function handleRegister ({fullname, email, contact, password, isSeller = false}) {

        const data = await register({fullname, email, contact, password, isSeller})

        dispatch(setUser(data.user))
    }

    return {handleRegister}
}
