import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import passport, { Passport } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
import productRouter from "./routes/product.routes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

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

export default app;