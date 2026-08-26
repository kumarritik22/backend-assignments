import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
        verificationMessage: null,
        verificationType: null
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
        setVerificationMessage: (state, action) => {
            state.verificationMessage = action.payload
        },
        setVerificationType: (state, action) => {
            state.verificationType = action.payload
        }
    }
})

export const {setError, setLoading, setUser, clearUser, setVerificationMessage, setVerificationType } = authSlice.actions
export default authSlice.reducer