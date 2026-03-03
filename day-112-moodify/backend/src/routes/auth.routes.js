const {Router} = require("express");
const authController = require("../controllers/auth.controller");

const router = Router();


// @route POST /api/auth/register
// @description how user can register
// @access public
router.post("/register", authController.registerUser)

// @route POST /api/auth/login
// @description how user can login
// @access public
router.post("/login", authController.loginUser)

module.exports = router;