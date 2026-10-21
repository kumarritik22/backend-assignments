import { createBrowserRouter, RouterProvider } from 'react-router'
import AuthLayout from '../layouts/AuthLayout.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import Home from '../pages/Home.jsx';


const AppRoutes = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <AuthLayout />,
            children: [
                {
                    path: "",
                    element: <Login />
                },
                {
                    path: "register",
                    element: <Register />
                }
            ]
        },
        {
            path: "/home",
            element: <MainLayout />,
            children: [
                {
                    path: "",
                    element: <Home />
                }
            ]
        }
    ]);

  return <RouterProvider router={router} />
}

export default AppRoutes;
