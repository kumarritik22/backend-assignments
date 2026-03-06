import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Protected = ({children}) => {

    const {loading, user} = useAuth()

    const Navigate = useNavigate()

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

  return children
}

export default Protected
