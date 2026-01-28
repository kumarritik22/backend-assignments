const express = require("express")

const app = express()

app.use(express.json())

const profiles = []

app.post("/profiles", (req, res) => {
    console.log(req.body)
    profiles.push(req.body)
    res.send("profile created")
})

app.get("/profiles", (req, res) => {
    res.send(profiles)
})

app.listen(3000, ()=> {
    console.log("Server is running on port number 3000")
})