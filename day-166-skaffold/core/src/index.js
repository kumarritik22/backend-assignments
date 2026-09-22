import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i
    }

    res.send(`Hello World! Sum is ${sum}`);
});

app.listen(3000, () => {
    console.log("Core server is running on port 3000.")
});