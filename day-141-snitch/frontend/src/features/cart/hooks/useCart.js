import { addItem, getCart } from "../services/cart.api.js";
import { addItem as addItemToCart, setItems } from "../state/cart.slice.js";
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

    return {handleAddItem, handleGetCart}
}