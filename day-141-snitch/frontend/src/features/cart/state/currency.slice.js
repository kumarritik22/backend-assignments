import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
    name: "currency",
    initialState: {
        rates: null,
        loading: false,
        error: false
    },
    reducers: {
        setRates: (state, action) => {
            state.rates = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {setRates, setLoading, setError} = currencySlice.actions;
export default currencySlice.reducer;