import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors";

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true
}));

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}))

app.get("/", (req, res) => {
    res.status(200).json({message: "Server is runnning"});
});

app.use("/api/auth", authRouter);

app.use("/api/products", productRouter);

app.use("/api/cart", cartRouter);

// Global Error Handler (Handles Multer LIMIT_FILE_SIZE and other errors)
app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File size exceeds the 5 MB limit. Please select images under 5 MB each."
        });
    }
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        message: err.message || "Internal server error"
    });
});

export default app;