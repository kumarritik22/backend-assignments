import express from "express";
import useGraph from "./services/graph.ai.service.js";

const app = express()

// Health check API
// @route GET /health
app.get("/health", (req, res) => {
    res.status(200).json({status: "Ok"})
});

app.post("/use-graph", async (req, res) => {
    await useGraph("write a factorial function in javascript?")
})

export default app