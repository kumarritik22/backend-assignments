import { addItem, getCart, increaseCartItemQuantity } from "../services/cart.api.js";
import { addItem as addItemToCart, incrementCartItem, setItems } from "../state/cart.slice.js";
import { useDispatch } from "react-redux";

export const useCart = () => {
    
    const dispatch = useDispatch()

    async function handleAddItem({productId, variantId}) {
        const data = await addItem({productId, variantId})
        return data;
    }

    async function handleGetCart() {
        const data = await getCart()
        dispatch(setItems(data.cart.items));
    }

    async function handleIncreaseCartItemQuantity({productId, variantId}) {
        const data = await increaseCartItemQuantity({productId, variantId})
        dispatch(incrementCartItem({productId, variantId}))
    }

    return {handleAddItem, handleGetCart, handleIncreaseCartItemQuantity}
}