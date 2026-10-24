import axios from "axios";

export const api = axios.create({
    baseURL: "https://api.team-sync.space",
    withCredentials: true
});