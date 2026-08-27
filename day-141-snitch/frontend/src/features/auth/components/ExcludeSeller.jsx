import { Loader2 } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const ExcludeSeller = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div className="min-h-screen flex items-center flex-col justify-center bg-[#0a0a0a]">
                <div className="bg-gold/10 rounded-full inline-flex items-center justify-center shadow-[0_4px_20px_rgba(201,169,110,0.15)] mb-5">
                <Loader2 className="w-16 h-16 text-gold animate-spin" />
                </div>
                <h2 className="text-sm font-medium tracking-widest text-center mb-2 text-[#B8A47A] animate-pulse">LOADING...</h2>
            </div>
    }

    // If the user is logged in AND is a seller, redirect them to their dashboard
    if (user && user.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />
    }

    // Otherwise (public visitors or logged-in buyers), let them see the page
    return children
}

export default ExcludeSeller
