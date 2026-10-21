import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://fakestoreapi.com"
});

// axiosInstance.interceptors.response.use();

axiosInstance.interceptors.response.use(
    (response) => {
        console.log("Axios instance response -->", response);
        return response;
    },
    (error) => {
        console.error("Error in instance:", error);
    }
);