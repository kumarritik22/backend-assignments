import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router"

const Public = () => {

    const { user } = useSelector((store) => store.auth);

    if (user) return <Navigate to={"/home"} />

    return <Outlet />
}

export default Public
