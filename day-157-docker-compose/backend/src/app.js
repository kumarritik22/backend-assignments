import express from "express";

const app = express()

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello Team"
    })
})

app.get("/api/data", (req, res) => {
    const data = {
        id: 1, 
        name: "Ramayan",
        director: "Nitesh Tiwari",
        producer: "Namit Malhotra"
    };

    res.status(200).json(data);
})

export default app;