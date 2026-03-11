import mongoose from "mongoose";

export function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(err => {
        console.log("Error connecting to DB", err)
    }) 

}