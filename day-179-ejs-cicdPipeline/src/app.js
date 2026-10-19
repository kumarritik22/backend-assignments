import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

// ---- Ejs template engine setup ----
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", async (req, res) => {
    res.render("index", {
        username: "Abhimanyu",
        bio: "Fierce warrior",
        profilePicture: "https://i.pinimg.com/736x/f1/bd/dc/f1bddca19f72ac8022f3759961f6f9a7.jpg"
    });
});

export default app;