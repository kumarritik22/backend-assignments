import Razorpay from "razorpay";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async ({amount, currency = "INR"}) => {
    // Razorpay expects the amount in the smallest currency unit.
    // For most currencies (USD, INR, EUR) this means multiplying by 100.
    // However, zero-decimal currencies (like JPY, KRW) don't have sub-units, so we multiply by 1.
    const zeroDecimalCurrencies = ['JPY', 'KRW', 'VND', 'BIF', 'CLP', 'PYG', 'VUV', 'XAF', 'XOF', 'XPF'];
    const multiplier = zeroDecimalCurrencies.includes(currency.toUpperCase()) ? 1 : 100;

    const options = {
        amount: Math.round(amount * multiplier),  // must be integer, no decimals
        currency: currency.toUpperCase()
    }
    const order = await razorpay.orders.create(options)
    return order;
}

// Fetch live exchange rates from free currency API (USD as the bridge currency)
const fetchExchangeRates = async () => {
    const response = await fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json");
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    const data = await response.json();
    return data.usd; // { inr: 83.5, eur: 0.91, ... }
}

// Convert a single amount from one currency to another, bridging via USD
const convertAmount = (amount, from, to, rates) => {
    if (from === to) return amount;
    const fromKey = from.toLowerCase();
    const toKey = to.toLowerCase();
    const inUSD = fromKey === "usd" ? amount : amount / rates[fromKey];
    return toKey === "usd" ? inUSD : inUSD * rates[toKey];
}

// Convert cart.totalsByCurrency (e.g. [{currency:'INR', amount:400}, {currency:'USD', amount:149}])
// into a single total in the user's chosen checkout currency
export const convertTotalToCurrency = async (totalsByCurrency, targetCurrency) => {
    const rates = await fetchExchangeRates();
    const total = totalsByCurrency.reduce((sum, {currency, amount}) => {
        return sum + convertAmount(amount, currency, targetCurrency, rates);
    }, 0);
    return Math.round(total * 100) / 100; // round to 2 decimal places
}