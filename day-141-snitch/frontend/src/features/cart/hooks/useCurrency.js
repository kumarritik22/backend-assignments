import { useDispatch, useSelector } from "react-redux"
import { setError, setLoading, setRates } from "../state/currency.slice.js"
import { fetchExchangeRates } from "../services/currency.api.js"

export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {

    if (!rates || fromCurrency === toCurrency) return amount

    const from = fromCurrency.toLowerCase()
    const to = toCurrency.toLowerCase()
    const amountInUSD = from === "usd" ? amount : amount / rates[from]
    return to === "usd" ? amountInUSD : amountInUSD * rates[to]
}

export const useCurrency = () => {
    
    const dispatch = useDispatch()
    const { rates, loading, error } = useSelector(state => state.currency)

    const handleFetchRates = async () => {
        if (rates) return 

        dispatch(setLoading(true))
        dispatch(setError(false))

        try {
            const data = await fetchExchangeRates()
            dispatch(setRates(data))
        } catch (error) {
            dispatch(setError(true))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return { rates, ratesLoading: loading, ratesError: error, handleFetchRates, convertCurrency }
}