import axios from "axios";

const cartApiInstance = axios.create({
    baseURL: "/api/cart",
    withCredentials: true
});

export const addItem = async ({productId, variantId}) => {
    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, {quantity: 1})
    return response.data;
}

export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data;
}

export const increaseCartItemQuantity = async ({productId, variantId}) => {
    const response = await cartApiInstance.patch(`/quantity/increment/${productId}/${variantId}`)
    return response.data;
}

export const decreaseCartItemQuantity = async ({ productId, variantId }) => {
    const response = await cartApiInstance.patch(`/quantity/decrement/${productId}/${variantId}`)
    return response.data;
}

export const createCartOrder = async ({ currency }) => {
    const response = await cartApiInstance.post("/payment/create/order", { currency })
    return response.data;
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature
    })

    return response.data;
}

export const failCartOrder = async ({ razorpay_order_id }) => {
    const response = await cartApiInstance.post("/payment/fail/order", { razorpay_order_id })
    return response.data;
}

export const deleteCartItem = async ({ productId, variantId }) => {
    const response = await cartApiInstance.delete(`/${productId}/${variantId}`)
    return response.data;
}

export const getOrderDetailsApi = async ({ orderId }) => {
    const response = await cartApiInstance.get(`/order/${orderId}`)
    return response.data;
}