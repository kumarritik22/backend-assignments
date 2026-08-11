import productModel from "../models/product.model.js";

const stockOfVariant = async (productId, variantId) => {

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    const stock = product.variants.find(variant => variant._id.toString() === variantId).stock
    return stock;
}

export default stockOfVariant;