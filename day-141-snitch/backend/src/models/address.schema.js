import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pinCode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        default: "India"
    },
    contact: {
        type: String,
        required: true
    }
}, {
    _id: false
});

export default addressSchema;