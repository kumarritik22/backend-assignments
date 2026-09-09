import express from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { addProductVariant, createProduct, deleteProduct, deleteProductVariant, getAllProducts, getProductDetails, getSellerProducts, updateProduct } from "../controllers/product.controller.js";
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

//@route GET /api/products/detail/:id
//@description Get product detail
//@access public
router.get("/detail/:id", getProductDetails)

//@route POST /api/products/:productId/variants
//@description To create variants
//@access private (seller only)
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant);

// @route DELETE /api/products/:productId
// @description To delete the product
// @acces Private (Only product owner can delete the product)
router.delete("/:productId", authenticateSeller, deleteProduct);

// @route PUT /api/product/:productId
// @description To edit the product
// @access Private (Only product owner can edit the product)
router.put("/:productId", authenticateSeller, upload.array("images", 7), updateProduct);

// @route DELETE /api/products/:productId/variants/:variantId
// @description To delete product variant
// @access Private (Only product owner can delete the product variant)
router.delete("/:productId/variants/:variantId", authenticateSeller, deleteProductVariant);




export default router;