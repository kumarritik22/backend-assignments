import { useForm } from "react-hook-form";
import { axiosInstance } from "../config/AxiosInstance";

export const useAuth = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

  const onLogin = async (data) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", data);
        console.log("Response from login api-->", response);
    } catch (error) {
        console.error("Error while logging in:", error);
    }
  };

  const onRegister = async (data) => {
    try {
        const response = await axiosInstance.post("/api/auth/register", data);
        console.log("Response from register api-->", response);
    } catch (error) {
        console.error("Error while registering:", error);
    }
  };

  return { register, handleSubmit, errors, onLogin, onRegister };

};