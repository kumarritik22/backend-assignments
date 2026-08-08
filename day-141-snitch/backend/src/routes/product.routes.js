import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getAllProducts, getSellerProducts } from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validators/product.validator.js";

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});

// @route POST /api/products
// @description create a new product 
// @access private (seller only)
router.post("/", authenticateSeller, upload.array("images", 7), createProductValidator, createProduct);


// @route GET /api/products/seller
// @description Get all the products of authenticated products
// @access private (seller only)
router.get("/seller", authenticateSeller, getSellerProducts);


// @route GET /api/products/
// @description Get all products
// @access public
router.get("/", getAllProducts);


export default router;