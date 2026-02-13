const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});

const postRouter = express.Router();

// POST - /api/posts [proctected route]
// req.body - {caption, img-file}

postRouter.post("/", upload.single("image"), postController.createPostController)

module.exports = postRouter;