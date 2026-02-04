const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: String,
    profession: String,
})

const profileModel = mongoose.model("profiles", profileSchema)



module.exports = profileModel