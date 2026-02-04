const express = require("express")
const profileModel = require("./models/profile.model")
const cors = require("cors")
const path = require("path") 

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("./public"))


// POST - /api/profiles
// create new profile and save data into MongoDB
// req.body - {name, profession}
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
// Fetch all profile data from MongoDB and send them in response
app.get("/api/profiles", async (req, res) => {
    const profiles = await profileModel.find()

    res.status(200).json({
        message: "Profiles fetched successfully",
        profiles
    }) 
})


//DELETE /api/profiles/:id
// Delete profile with the id from req.params
app.delete("/api/profiles/:id", async (req, res) => {
    const id = req.params.id

    await profileModel.findByIdAndDelete(id)

    res.status(200).json({
        message: "Profile deleted successfully",
    })
})


// PATCH /api/profiles/:id
// Update profession of the profile by id
// req.body = {profession}
app.patch("/api/profiles/:id", async (req, res) => {
    const id = req.params.id
    const {profession} = req.body

    await profileModel.findByIdAndUpdate(id, {profession})

    res.status(200).json({
        message: "Profession updated successfully"
    })
})


// PUT /api/profiles/:id
// Update profile by id
// req.body = {name, profession}
app.put("/api/profiles/:id", async (req, res) => {
    const id = req.params.id
    const {name, profession} = req.body

    await profileModel.findByIdAndUpdate(id, {name, profession})

    res.status(200).json({
        message: "Profile updated successfully"
    })
})

app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
})


module.exports = app