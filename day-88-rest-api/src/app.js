const express = require("express")
const app = express()

app.use(express.json())

const notes = []

app.get("./", (req,res) => {
    res.send("Hello World")
})

// Post method /notes

app.post("/notes", (req, res) => {
    console.log(req.body)
    notes.push(req.body)

    console.log(notes)
    res.send("note created");
})


module.exports = app 