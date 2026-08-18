import { addItem, createCartOrder, getCart, increaseCartItemQuantity } from "../services/cart.api.js";
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

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order;
    }

    return {handleAddItem, handleGetCart, handleIncreaseCartItemQuantity, handleCreateCartOrder}
}