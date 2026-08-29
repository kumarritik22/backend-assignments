import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    next();

}

export const validateRegisterUser = [
    body("email")
        .isEmail().withMessage("invalid email format"),
    body("contact")
        .notEmpty().withMessage("Contact is required")
        .matches(/^\d{10}$/).withMessage("Contact must be a 10-digit number"),
    body("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/).withMessage("Password must contain at least one number.")
        .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character."),
    body("fullname")
        .trim()
        .notEmpty().withMessage("Fullname is required")
        .isLength({ min: 2, max: 50 }).withMessage("Fullname must be between 2 and 50 characters.")
        .matches(/^[\p{L}]+(?:[ '\-][\p{L}]+)*$/u).withMessage("Full name can only contain letters, spaces, hyphens, and apostrophes."),
    body("isSeller")
        .isBoolean().withMessage("isSeller must be a boolean value"),

    validateRequest
]

export const validateLoginUser = [
    body("email")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty().withMessage("Password is required"),
    validateRequest
]

export const validateNewPassword = [
    body("newPassword")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/).withMessage("Password must contain at least one number.")
        .matches(/[!@#$%^&*]/).withMessage("Password must contain at least one special character."),
        validateRequest
]