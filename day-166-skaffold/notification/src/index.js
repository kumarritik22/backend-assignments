import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    }

    res.status(200).json({
        message: "Sum calculated successfully.",
        sum
    });
});

app.listen(8080, () => {
    console.log("Notification server is running on port 8080.")
});