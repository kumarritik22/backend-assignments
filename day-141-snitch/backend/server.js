import dotenv from "dotenv";
import app from "./src/app.js";
import connectToDB from "./src/config/db.js";

dotenv.config();

const startServer = async () => {
    try {
        await connectToDB();

        app.listen(3000, () => {
            console.log("Server is running on port 3000")
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();