import "dotenv/config";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import Redis from "ioredis";
import User from "./models/user.model.js";


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


// ---- Routes ----
app.get("/user/:id", async (req, res) => {
    try {
        const userFromCache = await redis.get(`user:${req.params.id}`);

        if (userFromCache) {
            return res.json({
                message: "User fetched from cache",
                data: JSON.parse(userFromCache)
            });
        }

        const user = await User.find();

        await redis.set(`user:${req.params.id}`, JSON.stringify(user), "EX", 60 * 60);


        res.json({
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});


app.post("/user", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json({
            message: "User created successfully.",
            data: newUser
        });
    } catch (error) {
        res.status(500).json({ error: "Error creating user" });
    }
});


// ---- Start Server ----
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});