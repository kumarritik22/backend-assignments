import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
});

export async function register({fullname, email, contact, password, isSeller}) {

    const response = await authApiInstance.post("/register", {
        fullname, 
        email,
        contact,
        password,
        isSeller
    })

    return response.data
}

export async function login({email, password}) {
    const response = await authApiInstance.post("/login", {
        email,
        password
    })

    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")
    return response.data
}

export async function logout() {
    const response = await authApiInstance.post("/logout")
    return response.data;
}

export async function verifyEmail({ token }) {
    const response = await authApiInstance.get(`/verify-email/${token}`)
    return response.data;
}

export async function resendVerificationEmail({ email }) {
    const response = await authApiInstance.post("/resend-verification-email", { email })
    return response.data;
}

export async function forgotPassword({ email }) {
    const response = await authApiInstance.post("/forgot-password", { email })
    return response.data;
}

export async function resetPasswordApi({ token, newPassword, confirmPassword }) {
    const response = await authApiInstance.post(`/reset-password/${token}`, { newPassword, confirmPassword })
    return response.data;
}