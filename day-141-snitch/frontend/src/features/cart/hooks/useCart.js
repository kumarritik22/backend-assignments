import { addItem, createCartOrder, getCart, increaseCartItemQuantity, verifyCartOrder, failCartOrder } from "../services/cart.api.js";
import { addItem as addItemToCart, incrementCartItem, setCart } from "../state/cart.slice.js";
import { useDispatch } from "react-redux";

export const useCart = () => {
    
    const dispatch = useDispatch()

    async function handleAddItem({productId, variantId}) {
        const data = await addItem({productId, variantId})
        return data;
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart));
    }

    async function handleIncreaseCartItemQuantity({productId, variantId}) {
        const data = await increaseCartItemQuantity({productId, variantId})
        dispatch(incrementCartItem({productId, variantId}))
    }

    async function handleCreateCartOrder({ currency }) {
        const data = await createCartOrder({ currency })
        return data.order;
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature
        })

        return data.success;
    }

    async function handleFailCartOrder({ razorpay_order_id }) {
        const data = await failCartOrder({ razorpay_order_id })
        return data;
    }

    return {handleAddItem, handleGetCart, handleIncreaseCartItemQuantity, handleCreateCartOrder, handleVerifyCartOrder, handleFailCartOrder}
}