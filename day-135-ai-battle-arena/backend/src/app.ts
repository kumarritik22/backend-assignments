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
import { fileURLToPath } from 'url';
import path from "path";

const app = express();

// Secure Express headers against well-known web vulnerabilities
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://ai-battle-arena-n7hl.onrender.com"
        ]
      }
    }
  }));

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://ai-battle-arena-n7hl.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.static("./public"));

// Initialize limiters
const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, 
  message: { success: false, message: 'Daily AI Request quota exceeded. Please try again tomorrow.' }
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/chats', apiLimiter, chatRoutes);

app.get("/", async (req, res) => {
    const result = await runGraph("Write a factorial function in JavaScript?")

    res.json(result);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"))
});

export default app