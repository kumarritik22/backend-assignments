const {Router} = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = Router();


// @route POST /api/auth/register
// @description how user can register
router.post("/register", authController.registerUser)

// @route POST /api/auth/login
// @description how user can login
router.post("/login", authController.loginUser)

// @route GET /api/auth/get-me
// @description to get the logged in user
router.get("/get-me", authMiddleware.authUser, authController.getMe)

// @route GET /api/auth/logout
// @description to logout the user
router.get("/logout", authController.logoutUser)

module.exports = router;