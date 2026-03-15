import { Router } from "express";
import { register, verifyEmail, login, getMe } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();


// @route POST /api/auth/register
// @description Register a new user
// @access Public
// @body {username, email, password}
authRouter.post("/register",registerValidator, register);


// @route POST /api/auth/login
// @description Login a user and return jwt token
// @access public
// @body {email, password}
authRouter.post("/login", loginValidator, login)


// @route GET /api/auth/get-me
// @description Get currect logged in user's details
// @access private
authRouter.get("/get-me", authUser, getMe)


// @route GET /api/auth/verify-email
// @description to verify user's email id
// @access public
// @query {token}
authRouter.get("/verify-email", verifyEmail)

export default authRouter;