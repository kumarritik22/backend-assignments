import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import Redis from "ioredis";
import user from "./models/user.model.js";


// ---- MongoDB Connection ----
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectToMongoDB();


// ---- Redis Connection ----
const redis = new Redis(process.env.REDIS_URL);

redis.once("ready", () => {
    console.log("Connected to Redis.");
});


// ---- Express Server setup ----
const app = express();

app.use(morgan("dev"));
app.use(express.json());


// ---- Start Server ----
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});