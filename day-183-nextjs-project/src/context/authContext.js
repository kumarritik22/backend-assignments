"use client";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const hydrateUser = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
            if (error.response?.status !== 401) {
                console.error("Error while hydrating user:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
      hydrateUser();
    }, []);
    
    return (
        <Auth.Provider value={{ user, setUser, loading, hydrateUser }}>
            {children}
        </Auth.Provider>
    );
};

export const useAuth = () => useContext(Auth);