import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    let sum = 0;

    for (let i = 0; i < 100000000; i++) {
        sum += i;
    }

    res.json({ 
        message: "Sum calculated",
        data: sum
    });
});

export default app;