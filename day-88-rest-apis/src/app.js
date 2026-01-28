const express = require("express")

const app = express() 

app.use(express.json())

const profiles = []


// POST /profiles
app.post("/profiles", (req, res) => {
    console.log(req.body)
    profiles.push(req.body)
    console.log(profiles)
    res.send("profile created")
})

// GET /profiles
app.get("/profiles", (req, res) => {
    res.send(profiles)
})

// DELETE /profiles
app.delete("/profiles/:index", (req, res) => {
    delete profiles[req.params.index]
    res.send("Profile deleted successfully")
})

// PATCH /profiles
app.patch("/profiles/:index", (req, res) => {
    profiles[req.params.index].profession = req.body.profession
    res.send("Profile updated successfully")
})


module.exports = app 