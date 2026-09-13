import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "";

const productApiInstance = axios.create({
    baseURL: `${API_URL}/api/products`,
    withCredentials: true
});

export async function createProduct(formData) {
    const response = await productApiInstance.post("/", formData)
    return response.data;
}

export async function getSellerProduct() {
    const response = await productApiInstance.get("/seller")
    return response.data;
}

export async function getAllProducts() {
    const response = await productApiInstance.get("/")
    return response.data;
}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/detail/${productId}`)
    return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    
    if (newProductVariant.price) {
        formData.append("priceAmount", newProductVariant.price.amount)
        formData.append("priceCurrency", newProductVariant.price.currency)
    }

    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/${productId}/variants`, formData)
    return response.data;
};

export async function deleteProductApi(productId) {
    const response = await productApiInstance.delete(`/${productId}`)
    return response.data;
}

export async function updateProductApi(productId, formData) {
    const response = await productApiInstance.put(`/${productId}`, formData)
    return response.data;
}

export async function deleteProductVariantApi(productId, variantId) {
    const response = await productApiInstance.delete(`/${productId}/variants/${variantId}`)
    return response.data;
}

export async function updateProductVariantApi(productId, variantId, formData) {
    const response = await productApiInstance.put(`/${productId}/variants/${variantId}`, formData)
    return response.data;
}