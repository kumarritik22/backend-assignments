const express = require("express");

const app = express()

app.get("/", (req, res)=> {
    res.send("Hello World")
})

app.get("/home", (req, res)=> {
    res.send("This is Home Page.")
})

app.get("/service", (req, res)=> {
    res.send("This is your Service Page.")
})

app.listen(3000);