import express from "express";

const app = express()

// Health check API
// @route GET /health
app.get("/health", (req, res) => {
    res.status(200).json({status: "Ok"})
})

export default app