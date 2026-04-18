import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import runGraph from "./ai/graph.ai.js"
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { connectDB } from './config/db.js';

const app = express();

// Secure Express headers against well-known web vulnerabilities
app.use(helmet());

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

// Initialize limiters
const authLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: { success: false, message: 'Daily authentication limit reached. Please try again tomorrow.' }
});

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50, 
  message: { success: false, message: 'Daily AI Request quota exceeded. Please try again tomorrow.' }
});

// Mount Routes
app.use('/auth', authLimiter, authRoutes);
app.use('/chats', apiLimiter, chatRoutes);

app.get("/", async (req, res) => {
    const result = await runGraph("Write a factorial function in JavaScript?")

    res.json(result);
})

export default app