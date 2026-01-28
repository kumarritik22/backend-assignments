const express = require("express")

const app = express()

app.use(express.json())

const profiles = []

// POST /profiles
app.post("/profiles", (req, res)=> { 
    profiles.push(req.body)
    res.status(201).json({
        message: "Profile created successfully"
    }) 
})

// GET /profiles
app.get("/profiles", (req, res)=> {
    res.status(200).json({
        profiles: profiles
    })
})

// DELETE /profiles
app.delete("/profiles/:index", (req, res)=> {
    delete profiles[req.params.index]
    res.status(204).json({
        message: "Profile deleted successfully"
    })
})

// PATCH /profiles
app.patch("/profiles/:index", (req, res)=> {
    profiles[req.params.index].profession = req.body.profession
    res.status(200).json({
        message: "Profession updated successfully"
    })
})

// PUT /profiles
app.put("/profiles/:index", (req, res)=> {
    profiles[req.params.index] = req.body
    res.status(200).json({
        message: "Profile updated successfully"
    })
})


module.exports = app