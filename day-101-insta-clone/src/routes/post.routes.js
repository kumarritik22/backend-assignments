const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});

const postRouter = express.Router();

// POST - /api/posts [proctected route]
// req.body - {caption, img-file}
postRouter.post("/", upload.single("image"), postController.createPostController)


// GET - /api/posts/ [protected route]
postRouter.get("/", postController.getPostController)


// GET - /api/posts/details/:postId
// return detail about specific post with the id. also check whether the post belongs to the user that the request come from.
postRouter.get("/details/:postId", postController.getPostDetailsController)


module.exports = postRouter;