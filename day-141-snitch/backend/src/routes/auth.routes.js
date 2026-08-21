import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validators/auth.validator.js";
import { register, login, googleCallback, getMe, logout, testEmail } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateRegisterUser, register);

router.post("/login", validateLoginUser, login);

// @route /api/auth/logout
// @description Use to logout
router.post("/logout", authenticateUser, logout);

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"]}));

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
}), googleCallback);

router.get("/me", authenticateUser, getMe);

router.post("/test-email", testEmail);

export default router;