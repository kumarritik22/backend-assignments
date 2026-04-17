import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
dotenv.config();

export const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            // Use the provided URI
            await mongoose.connect(process.env.MONGODB_URI);
            console.log("Connected to MongoDB");
        } else {
            // Fallback to in-memory database zero-config setup
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log("MongoDB In-Memory Server connected successfully! (Zero-config mode)");
        }
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    }
};
