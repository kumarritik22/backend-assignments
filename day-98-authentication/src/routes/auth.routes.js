const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


// POST - /api/auth/register
authRouter.post("/register", async (req, res) => {
    const {name, email, password} = req.body

    const emailAlreadyExists = await userModel.findOne({email})

    if (emailAlreadyExists) {
        return res.status(409).json({
            message: "Email already exists, try different email."
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await userModel.create({
        name, email, password:hash
    })

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET, {expiresIn: "1h"}
    )

    res.cookie("jwt_token", token);

    res.status(201).json({
        message: "User registered successfully",
        user:{
            name: user.name,
            email: user.email
        },
        token
    })

})

// POST - /api/auth/get-me // To know how is requesting on server
authRouter.get("/get-me", async (req, res) => {
    const token = req.cookies.jwt_token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.json({
        name: user.name,
        email: user.email,
    })
})

// POST - /api/auth/login
authRouter.post("/login", async (req, res) => {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if (!user) {
        return res.status(401).json({
            message: "User not found with this email address."
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex");

    const isPasswordMatched = user.password === hash

    if(!isPasswordMatched) {
        return res.status(401).json({
            message: "Wrong password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET, {expiresIn: "1h"}
    )

    res.cookie = ("jwt_token", token)

    res.status(201).json({
        message: "User logged in successfully.",
        user,
        token
    })
})


module.exports = authRouter;