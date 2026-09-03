import { addItem, createCartOrder, getCart, increaseCartItemQuantity, verifyCartOrder, failCartOrder, decreaseCartItemQuantity, deleteCartItem, getOrderDetailsApi, getUserOrdersApi } from "../services/cart.api.js";
import { addItem as addItemToCart, setCart } from "../state/cart.slice.js";
import { useDispatch } from "react-redux";

export const useCart = () => {
    
    const dispatch = useDispatch()

    async function handleAddItem({productId, variantId}) {
        const data = await addItem({productId, variantId})
        if (data?.cart) {
            dispatch(setCart(data.cart));
        }
        return data;
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setCart(data.cart));
    }

    async function handleIncreaseCartItemQuantity({productId, variantId }) {
        const data = await increaseCartItemQuantity({ productId, variantId })
        
        if (data.success) {
            dispatch(setCart(data.cart))
        }
    }

    async function handleDecreaseCartItemQuantity({ productId, variantId }) {
        const data = await decreaseCartItemQuantity({ productId, variantId })
        
        if (data.success) {
            dispatch(setCart(data.cart))
        }
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

        if (data.success) {
            await handleGetCart()
        }

        return data.success;
    }

    async function handleFailCartOrder({ razorpay_order_id }) {
        const data = await failCartOrder({ razorpay_order_id })
        return data;
    }

    async function handleDeleteCartItem({ productId, variantId }) {
        const data = await deleteCartItem({ productId, variantId })
        if (data.success) {
            dispatch(setCart(data.cart))
        }
    }

    async function handleGetOrderDetails({ orderId }) {
        const data = await getOrderDetailsApi({ orderId })
        return data;
    }

    async function handleGetUserOrders() {
        const data = await getUserOrdersApi()
        return data;
    }

    return { handleAddItem, handleGetCart, handleIncreaseCartItemQuantity, handleDecreaseCartItemQuantity, handleCreateCartOrder, handleVerifyCartOrder, handleFailCartOrder, handleDeleteCartItem, handleGetOrderDetails, handleGetUserOrders }
}