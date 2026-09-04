import { body, param, validationResult } from "express-validator";

const validateRequest = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Validation error",
            errors: errors.array()
        })
    }

    next();
} 

export const validateAddToCart = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    validateRequest
]

export const validateIncrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant id"),
    validateRequest
]

export const validateDecrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant id"),
    validateRequest
]

export const validateCreateOrder = [
    body("currency")
        .trim()
        .notEmpty().withMessage("Currency is required"),
    body("shippingAddress.fullname")
        .trim()
        .notEmpty().withMessage("Fullname is required")
        .isLength({ min: 2, max: 50 }).withMessage("Fullname must be between 2 and 50 characters.")
        .matches(/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u).withMessage("Full name can only contain letters, spaces, hyphens, and apostrophes."),
    body("shippingAddress.addressLine1")
        .trim()
        .notEmpty().withMessage("Address is required"),
    body("shippingAddress.addressLine2")
        .optional()
        .trim(),
    body("shippingAddress.city")
        .trim()
        .notEmpty().withMessage("City is required"),
    body("shippingAddress.state")
        .trim()
        .notEmpty().withMessage("State is required"),
    body("shippingAddress.pinCode")
        .trim()
        .notEmpty().withMessage("Pin code is required")
        .matches(/^[A-Za-z0-9][A-Za-z0-9\s-]{1,9}$/)
        .withMessage("Enter a valid pin code"),
    body("shippingAddress.country")
        .trim()
        .notEmpty().withMessage("Country is required"),
    body("shippingAddress.contact")
        .trim()
        .notEmpty().withMessage("Contact number is required")
        .matches(/^\+?[0-9\s-]{7,15}$/)
        .withMessage("Enter a valid contact number"),
    
    validateRequest
]