import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import stockOfVariant from "../dao/product.dao.js";
import { createOrder, convertTotalToCurrency } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import crypto from "crypto";
import { config } from "../config/config.js";

export const addToCart = async (req, res) => {

    const {productId, variantId} = req.params

    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found.",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId);

    const cart = (await cartModel.findOne({user: req.user._id})) || (await cartModel.create({user: req.user._id}));

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId);

    if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity

        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock, and you already have ${quantityInCart} items in your cart.`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            {user: req.user._id, "items.product": productId, "items.variant": variantId},
            {$inc: {"items.$.quantity": quantity}},
            {new: true}
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })

    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    const variant = product.variants.find(v => v._id.toString() === variantId)

    cart.items.push({
        product: productId, 
        variant: variantId, 
        quantity, 
        price: variant?.price || product.price
    })

    await cart.save();

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    }) 
};

export const getCart = async (req, res) => {

    const user = req.user

    let cart = await getCartDetails(user._id);

    if (!cart) {
        cart = await cartModel.create({user: user._id})
    }

    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    });
};

export const incrementCartItemQuantity = async (req, res) => {
    const {productId, variantId} = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const cart = await cartModel.findOne({user: req.user._id});

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId);

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart + 1 > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock, and you already have ${itemQuantityInCart} items in your cart.`,
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { 
            user: req.user._id, 
            "items.product": productId, 
            "items.variant": variantId 
        },
        { 
            $inc: { "items.$.quantity": 1 }
        }
    )

    const updatedCart = await getCartDetails(req.user._id)

    return res.status(200).json({
        message: "Cart item quantity increased successfully.",
        success: true,
        cart: updatedCart
    })
};

export const decrementCartItemQuantity = async (req, res) => {

    const {productId, variantId} = req.params

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    });

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false,
        })
    }

    const cart = await cartModel.findOne({user: req.user._id})

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found",
            success: false
        })
    }

    const itemQuantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId)?.quantity || 0

    if (itemQuantityInCart <= 1) {
        return res.status(400).json({
            message: "Quantity cannot be less than 1.",
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { 
            user: req.user._id, 
            "items.product": productId, 
            "items.variant": variantId 
        },
        { 
            $inc: { "items.$.quantity": -1 }
        }
    )

    const updatedCart = await getCartDetails(req.user._id)

    return res.status(200).json({
        message: "Cart item quantity decreased successfully.",
        success: true,
        cart: updatedCart
    })
};

export const createOrderController = async (req, res) => {
    try {
        const { currency } = req.body

        if (!currency) {
            return res.status(400).json({
                message: "Currency is required.",
                success: false
            })
        }

        const cart = await getCartDetails(req.user._id)

        if (!cart || !cart.items?.length) {
            return res.status(400).json({
                message: "Cart is empty.",
                success: false
            })
        }

        // Convert all per-currency totals into one total in the user's chosen checkout currency
        const totalAmount = await convertTotalToCurrency(cart.totalsByCurrency, currency)

        // Create the Razorpay order with the converted total
        const order = await createOrder({ amount: totalAmount, currency })

        // Save a pending payment record in our database
        const payment = new paymentModel({
            user: req.user._id,
            razorpay: {
                orderId: order.id
            },
            price: {
                amount: totalAmount,
                currency
            },
            orderItems: cart.items.map(item => ({
                title: item.product.title,
                productId: item.product._id,
                variantId: item.variant,
                quantity: item.quantity,
                images: item.product.variants.images || item.product.images,
                description: item.product.description,
                attributes: item.product.variants?.attributes || {},
                price: {
                    amount: item.product.variants.price.amount || item.product.price.amount,
                    currency: item.product.variants.price.currency || item.product.price.currency
                }
            }))
        })

        await payment.save()

        return res.status(200).json({
            message: "Order created successfully.",
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                key: config.RAZORPAY_KEY_ID  // frontend needs public key to open the modal
            }
        }); 
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(error.statusCode || 500).json({
            message: error.error?.description || "Failed to create order.",
            success: false,
            error: error.error || error.message
        });
    }
};

export const verifyOrderController = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found.",
            success: false
        })
    }

    const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

    const isPaymentValid = expectedSignature === razorpay_signature

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save()

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        })
    }

    payment.status = "paid"
    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    for(const item of payment.orderItems) {
        await productModel.findOneAndUpdate(
            {
                _id: item.productId,
                "variants._id": item.variantId
            },
            {
                $inc: {
                    "variants.$.stock": -item.quantity
                }
            }
        )
    }

    await cartModel.findOneAndUpdate(
        { user: payment.user },
        { $set: { items: [] }}
    )

    await payment.save()

    return res.status(200).json({
        message: "Payment verified successfully.",
        success: true
    })
};

export const failOrderController = async (req, res) => {
    const { razorpay_order_id } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

    if (!payment) {
        return res.status(404).json({
            message: "Payment not found or already processed.",
            success: false
        })
    }

    payment.status = "failed"
    await payment.save()

    return res.status(200).json({
        message: "Payment marked as failed.",
        success: true
    })
};

export const removeCartItem = async (req, res) => {

    const { productId, variantId } = req.params

    const cart = await cartModel.findOne({user: req.user._id});

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found.",
            success: false
        })
    }

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId
    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found.",
            success: false
        })
    }

    const cartItem = cart.items.find(
        item => item.product.toString() === productId &&
                item.variant?.toString() === variantId
    )

    if (!cartItem) {
        return res.status(404).json({
            message: "Item not found in cart.",
            success: false
        })
    }

    await cartModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: {
                items: {
                    product: productId,
                    variant: variantId
                }
            }
        },
        { new: true }
    )

    const updatedCart = await getCartDetails(req.user._id);

    return res.status(200).json({
        message: "Cart item removed successfully.",
        success: true,
        cart: updatedCart
    })
}

export const getOrderByIdController = async (req, res) => {
    try {
        const { orderId } = req.params

        let query

        if (mongoose.Types.ObjectId.isValid(orderId)) {
            query = {
                _id: orderId,
                user: req.user._id
            }
        } else {
            query = {
                "razorpay.orderId": orderId,
                user: req.user._id
            }
        }

        const order = await paymentModel
        .findOne(query)
        .populate("user", "fullname email contact")

        if (!order) {
            return res.status(404).json({
                message: "Order not found.",
                success: false
            })
        }

        return res.status(200).json({
            message: "Order found successfully.",
            success: true,
            order
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
};

export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await paymentModel.find({ 
            user: req.user._id,
            status: "paid"
        }).sort({ createdAt: -1 })

        return res.status(200).json({
            message: "All orders fetched successfully.",
            success: true,
            count: orders.length,
            orders
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
};