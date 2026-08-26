import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
        authMessage: null,
        verificationType: null,
        authType: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        clearUser: (state) => {
            state.user = null
        },
        setAuthMessage: (state, action) => {
            state.authMessage = action.payload
        },
        setVerificationType: (state, action) => {
            state.verificationType = action.payload
        },
        setAuthType: (state, action) => {
            state.authType = action.payload
        }
    }
})

export const {setError, setLoading, setUser, clearUser, setAuthMessage, setVerificationType, setAuthType } = authSlice.actions
export default authSlice.reducer