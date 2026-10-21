import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Home fetched"
    });
});

export default router;