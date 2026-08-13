import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'

const ExcludeSeller = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return <div className="h-screen bg-[#0c0c0c] flex items-center justify-center text-white">Loading...</div>
    }

    // If the user is logged in AND is a seller, redirect them to their dashboard
    if (user && user.role === 'seller') {
        return <Navigate to="/seller/dashboard" replace />
    }

    // Otherwise (public visitors or logged-in buyers), let them see the page
    return children
}

export default ExcludeSeller
