import { addProductVariant, createProduct, deleteProductApi, deleteProductVariantApi, getAllProducts, getProductById, getSellerProduct, updateProductApi } from "../services/product.api";
import { useDispatch } from "react-redux";
import { setProducts, setSellerProducts } from "../state/product.slice.js";

export const useProduct = () => {
    const dispatch = useDispatch()

    async function handleCreateProduct(formData) {
        const data = await createProduct(formData)
        return data.products;
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))
        return data.products;
    }

    async function handleGetAllProducts() {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        return data.products;
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }

    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)
        return data.product;
    }

    async function handleDeleteProduct(productId) {
        const data = await deleteProductApi(productId)
        return data;
    }

    async function handleUpdateProduct(productId, formData) {
        const data = await updateProductApi(productId, formData)
        return data.product;
    }

    async function handleDeleteProductVariant(productId, variantId) {
        const data = await deleteProductVariantApi(productId, variantId)
        return data.product;
    }

    return { handleCreateProduct, handleGetSellerProduct, handleGetAllProducts, handleGetProductById, handleAddProductVariant, handleDeleteProduct, handleUpdateProduct, handleDeleteProductVariant }
}
