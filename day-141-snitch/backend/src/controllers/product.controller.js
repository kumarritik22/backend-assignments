import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    const { title, description, priceAmount, priceCurrency } = req.body

    const seller = req.user

    const images = await Promise.all(req.files.map(async (file) => {
        return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname
        })
    }))

    const product = await productModel.create({
        title,
        description,
        price: {
            amount: priceAmount,
            currency: priceCurrency || "INR"
        },
        images,
        seller: seller._id
    })

    res.status(201).json({
        message: "Product created successfully",
        success: true,
        product
    })
};

export async function getSellerProducts(req, res) {
    const seller = req.user

    const products = await productModel.find({seller: seller._id});

    res.status(200).json({
        message: "Product fetched successfully",
        success: true,
        products
    });
};

export async function getAllProducts(req, res) {
    const products = await productModel.find()

    return res.status(200).json({
        message: "Products fetched successfully",
        success: true,
        products
    })
};

export async function getProductDetails(req, res) {
    const {id} = req.params

    const product = await productModel.findById(id)

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false,
        })
    }

    return res.status(200).json({
        message: "Product details fetched successfully",
        success: true,
        product
    })
};

export async function addProductVariant(req, res) {

    const productId = req.params.productId

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found",
            success: false
        })
    }

    const files = req.files

    const images = []

    if (files && files.length !== 0) {
        const uploadedImages = await Promise.all(
            files.map(async (file) => {
                const image = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
                return image
            })
        )
        images.push(...uploadedImages)
    }

    const price = req.body.priceAmount

    const stock = req.body.stock

    const attributes = JSON.parse(req.body.attributes || "{}")

    console.log(product, images, price, stock, attributes);

    product.variants.push({
        images, 
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
    })

    await product.save();

    return res.status(200).json({
        message: "Product variant added successfully",
        success: true,
        product
    });
};

export async function deleteProduct(req, res) {
    const { productId } = req.params

    const product = await productModel.findOneAndDelete({ 
        _id: productId,
        seller: req.user._id 
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found or unauthorized access.",
            success: false
        })
    }

    return res.status(200).json({
        message: "Product deleted successfully.",
        success: true
    })
};

export async function updateProduct(req, res) {
    const { productId } = req.params

    const product = await productModel.findOne({
        _id: productId,
        seller: req.user._id
    })

    if (!product) {
        return res.status(404).json({
            message: "Product not found or unauthorized access.",
            success: false
        })
    }

    if (req.body.title) {
        product.title = req.body.title
    }

    if (req.body.description) {
        product.description = req.body.description
    }

    if (req.body.priceAmount) {
        product.price.amount = Number(req.body.priceAmount)
    }

    if (req.body.priceCurrency) {
        product.price.currency = req.body.priceCurrency
    }

    // ── Images Update ──
    let finalImages = [];
    
    // 1. Keep the existing images sent from frontend
    if (req.body.existingImages) {
        try {
            finalImages = JSON.parse(req.body.existingImages);
        } catch (err) {
            finalImages = product.images || [];
        }
    } else {
        finalImages = product.images || [];
    }

    // 2. Upload and append any new image files
    if (req.files && req.files.length > 0) {
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                return await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                });
            })
        );
        finalImages.push(...uploadedImages);
    }

    // 3. Enforce maximum 7 images and save
    product.images = finalImages.slice(0, 7);

    await product.save()

    return res.status(200).json({
        message: "Product updated successfully.",
        success: true,
        product
    })
};