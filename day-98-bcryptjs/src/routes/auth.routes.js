const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

// POST - /api/auth/register
authRouter.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    const emailAlreadyExists = await userModel.findOne({email})
    
    if(emailAlreadyExists) {
        return res.status(409).json({
            message: "Email already exist, try different email."
        })
    }

    const user = await userModel.create({
        name, email, password
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "User registered successfully.",
        user,
        token
    })
})

authRouter.post("/protected", (req, res) => {
    console.log(req.cookies);

    res.status(200).json({
        message: "This is a protected route."
    })
})

// POST - /api/auth/login
authRouter.post("/login", async (req, res) => {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user) {
        return res.status(404).json({
            message: "User not found with this email address"
        })
    }

    const isPasswordMatched = user.password === password

    if(!isPasswordMatched) {
        return res.status(401).json({
            message: "Wrong Password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token)

    res.status(200).json({
        message: "User logged in successfully",
        user,
    })
})


module.exports = authRouter;