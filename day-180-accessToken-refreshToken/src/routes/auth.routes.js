import express from "express";
import { getAccessTokenController, loginController, logoutController, registerController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/get-accessToken", getAccessTokenController);

router.get("/me", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Currently loggedIn user",
        user: req.user
    });
});

export default router;