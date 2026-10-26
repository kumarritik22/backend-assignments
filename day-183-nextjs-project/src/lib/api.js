import axios from "axios";

export const api = axios.create({
    baseURL: "https://team-sync-backend-n78w.onrender.com/",
    withCredentials: true
});