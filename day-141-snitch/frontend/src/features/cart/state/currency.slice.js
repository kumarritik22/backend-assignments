import { createSlice } from "@reduxjs/toolkit";

const currencySlice = createSlice({
    name: "currency",
    initialState: {
        rates: null,
        loading: false,
        error: false,
        selectedCurrency: "INR"
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
        },
        setSelectedCurrency: (state, action) => {
            state.selectedCurrency = action.payload
        }
    }
})

export const {setRates, setLoading, setError, setSelectedCurrency} = currencySlice.actions;
export default currencySlice.reducer;