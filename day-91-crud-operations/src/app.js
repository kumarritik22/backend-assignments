const express = require("express")
const profileModel = require("./models/profiles.model")

const app = express()

app.use(express.json())

// POST /api/profiles
// req.body => {name, profession}
app.post("/api/profiles", async (req, res) => {
    const {name, profession} = req.body

    const profile = await profileModel.create({
        name, profession
    })

    res.status(201).json({
        message: "Profile created successfully",
        profile
    })
})

//GET /api/profiles
// fetch all profile data
app.get("/api/profiles", async (req, res) => {
    const profiles = await profileModel.find()

    res.status(200).json({
        message: "Profiles fetched successfully",
        profiles
    })
})


module.exports = app 