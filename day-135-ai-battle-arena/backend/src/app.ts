import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { connectDB } from './config/db.js';
import path from "path";

const app = express();
app.set('trust proxy', 1); // Trust the first proxy (Render's load balancer)

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
    methods: ["GET", "POST", "DELETE"],
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

app.use("*name", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"))
});

export default app