import { addItem, getCart, increaseCartItemQuantity } from "../services/cart.api.js";
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
        console.log(data);
        dispatch(setCart(data.cart));
    }

    async function handleIncreaseCartItemQuantity({productId, variantId}) {
        const data = await increaseCartItemQuantity({productId, variantId})
        dispatch(incrementCartItem({productId, variantId}))
    }

    return {handleAddItem, handleGetCart, handleIncreaseCartItemQuantity}
}