import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/auth",
    withCredentials: true
})

export async function login(username, password) {
    const response = await api.post("/login", {
        username, password
    })

    return response.data
}

export async function register(username, email, password, bio, imageFile) {
    const formData = new FormData()

    formData.append("username", username)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("bio", bio)
    formData.append("profileImage", imageFile)

    const response = await api.post("/register", formData)

    return response.data
}

export async function getMe() {
    const response = await api.get("/get-me")

    return response.data
}