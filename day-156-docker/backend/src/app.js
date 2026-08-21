import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hellor world!"
    })
})

app.get("/api/data", (req, res) => {
    const data = {
        id: 1,
        name: "Ramayan",
        description: "Peak is coming, witness the Tretayug this Diwali in IMAX."
    };

    res.status(200).json(data);
})

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
})


export default app;