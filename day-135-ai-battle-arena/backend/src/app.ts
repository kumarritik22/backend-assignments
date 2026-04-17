import express from "express";
import runGraph from "./ai/graph.ai.js"
import cors from "cors";
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './config/db.js';

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));

// Mount Auth Routes
app.use('/auth', authRoutes);

app.get("/", async (req, res) => {
    const result = await runGraph("Write a factorial function in JavaScript?")

    res.json(result);
})

app.post("/invoke", async (req, res) => {
    const {input} = req.body

    const result = await runGraph(input)

    res.status(200).json({
        message: "Graph executed successfully",
        success: true,
        result
    })
});

export default app