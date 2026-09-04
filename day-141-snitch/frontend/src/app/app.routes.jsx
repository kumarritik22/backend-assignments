import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register.jsx";
import Login from "../features/auth/pages/Login.jsx";
import CreateProduct from "../features/products/pages/CreateProduct.jsx";
import Dashboard from "../features/products/pages/Dashboard.jsx";
import Protected from "../features/auth/components/Protected.jsx";
import ExcludeSeller from "../features/auth/components/ExcludeSeller.jsx";
import Home from "../features/products/pages/Home.jsx";
import ProductDetail from "../features/products/pages/ProductDetail.jsx";
import SellerProductDetails from "../features/products/pages/SellerProductDetails.jsx";
import Cart from "../features/cart/pages/Cart.jsx";
import AppLayout from "./AppLayout.jsx";
import About from "../features/products/pages/About.jsx";
import OrderSuccess from "../features/cart/pages/OrderSuccess.jsx";
import OrderDetails from "../features/cart/pages/OrderDetails.jsx";
import VerifyEmail from "../features/auth/pages/VerifyEmail.jsx";
import ResendVerificationEmail from "../features/auth/pages/ResendVerificationEmail.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import MyOrders from "../features/cart/pages/MyOrders.jsx";
import Contact from "../features/products/pages/Contact.jsx";


export const routes = createBrowserRouter([
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/verify-email/:token",
        element: <VerifyEmail />
    },
    {
        path: "/resend-verification-email",
        element: <ResendVerificationEmail />
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />
    },
    {
        path: "/reset-password/:token",
        element: <ResetPassword />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <ExcludeSeller>
                    <Home />
                </ExcludeSeller>
            },
            {
                path: "/about",
                element: <About />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/product/:productId",
                element: <ExcludeSeller>
                    <ProductDetail />
                </ExcludeSeller>
            },
            {
                path: "/cart",
                element: <Protected>
                    <Cart />
                </Protected>
            },
            {
                path: "/order-success",
                element: <OrderSuccess />
            },
            {
                path: "/order/:orderId",
                element: <Protected>
                    <OrderDetails />
                </Protected>
            },
            {
                path: "/profile/orders",
                element: <Protected>
                    <MyOrders />
                </Protected>
            },
            {
                path: "/seller",
                children: [
                    {
                        path: "/seller/create-product",
                        element: <Protected role="seller" >
                            <CreateProduct />
                        </Protected>
                    },
                    {
                        path: "/seller/dashboard",
                        element: <Protected role="seller" >
                            <Dashboard />
                        </Protected>
                    },
                    {
                        path: "/seller/product/:productId",
                        element: <Protected role="seller" >
                            <SellerProductDetails />
                        </Protected>
                    }
                ]
            }
        ]
    }

])