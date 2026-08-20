import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { validateAddToCart, validateDecrementCartItemQuantity, validateIncrementCartItemQuantity } from "../validators/cart.validator.js";
import { addToCart, getCart, incrementCartItemQuantity, createOrderController, verifyOrderController, failOrderController, decrementCartItemQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);

router.get("/", authenticateUser, getCart);

router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity);

router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, decrementCartItemQuantity);

router.post("/payment/create/order", authenticateUser, createOrderController);

router.post("/payment/verify/order", authenticateUser, verifyOrderController);

router.post("/payment/fail/order", authenticateUser, failOrderController);

export default router;