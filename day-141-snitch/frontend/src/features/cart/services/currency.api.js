export const fetchExchangeRates = async () => {
    const response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")
    
    if (!response.ok) throw new Error("Failed to fetch exchange rates")
    const data = await response.json()
    return data.usd;
}