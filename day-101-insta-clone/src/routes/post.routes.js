const express = require("express");
const postController = require("../controllers/post.controller");
const multer = require("multer");
const upload = multer({storage: multer.memoryStorage()});
const identifyUser = require("../middlewares/auth.middleware");

const postRouter = express.Router();

// @route POST /api/posts [proctected route]
// @description Create a post with the content and image (optional) provided in the request body. The post should be associated with the user that the request come from
postRouter.post("/", upload.single("image"), identifyUser, postController.createPostController)


// @route GET /api/posts/ [protected route]
// @description Get all the posts created by the user that the request come from. also return the total number of posts created by the user
postRouter.get("/", identifyUser, postController.getPostController)


// @route GET /api/posts/details/:postId
// @description return detail about specific post with the id. also check whether the post belongs to the user that the request come from.
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

// @route POST /api/posts/like/:postId
// @description like a post with the id provided in the request params.
postRouter.post("/like/:postId", identifyUser, postController.likePostController)


module.exports = postRouter;