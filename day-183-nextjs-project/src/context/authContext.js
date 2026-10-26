"use client";
import { api } from "@/lib/api";
import { createContext, useEffect, useState } from "react";

const Auth = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const hydrateUser = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
            console.error("Error while hydrating user:", error);
        }
    };

    useEffect(() => {
      hydrateUser();
    }, []);
    
    return <Auth.Provider value={{ user, setUser }}>{children}</Auth.Provider>
};

export const useAuth = () => useContext(Auth);