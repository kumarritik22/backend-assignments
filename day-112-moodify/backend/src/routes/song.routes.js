const express = require("express");
const songController = require("../controllers/song.controller");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// @access POST /api/songs/
// @description it is used to upload songs.
router.post("/", upload.single("song"), songController.uploadSong)

// @access GET /api/songs/
// @description 
router.get("/", songController.getSong)

module.exports = router;