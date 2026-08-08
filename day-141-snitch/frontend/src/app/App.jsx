import "./App.css";
import { RouterProvider } from "react-router";
import { routes } from "./app.routes.jsx";
import { useAuth } from "../features/auth/hook/useAuth.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const App = () => {

  const {handleGetMe} = useAuth()

  const user = useSelector(state => state.auth.user)

  console.log(user)

  useEffect(() => {
    handleGetMe()
  }, [])
  

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
