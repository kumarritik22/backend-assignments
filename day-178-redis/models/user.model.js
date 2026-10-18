import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model("user", userSchema);

export default User;