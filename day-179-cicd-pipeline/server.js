import "dotenv/config";
import app from "./src/app.js";
import mongoose from "mongoose";

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

connectToMongoDB();