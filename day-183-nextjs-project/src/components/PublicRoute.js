"use client";
import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'

const PublicRoute = ({ children }) => {

    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
      if (!loading && user) {
        router.replace("/mainLayout/home")
      }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-lg font-semibold">Loading...</h1>
            </div>
        );
    };

    if (user) return null;
    
  return children
};

export default PublicRoute;
