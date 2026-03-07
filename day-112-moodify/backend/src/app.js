const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const songRoutes = require("./routes/song.routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/songs/", songRoutes)


module.exports = app;