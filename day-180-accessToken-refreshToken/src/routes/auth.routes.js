import express from "express";
import { getAccessTokenController, loginController, registerController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.get("/get-accessToken", getAccessTokenController);

export default router;