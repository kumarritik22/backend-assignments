import "dotenv/config";
import app from "./src/app.js";
import mongoose from "mongoose";
import { Redis } from "ioredis";

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


// --- MongoDB Connection ---
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectToMongoDB();


// --- Redis Connection ---
const redis = new Redis(process.env.REDIS_URI);

redis.once("ready", () => {
    console.log("Connected to Redis");
});