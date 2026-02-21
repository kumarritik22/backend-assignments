const express = require("express");
const userController = require("../controllers/user.controller");
const identifyUser = require("../middlewares/auth.middleware")

const userRouter = express.Router();

// @route POST - /api/users/follow/:username
// @description - Follow a user
// @access - Private
userRouter.post("/follow/:username", identifyUser, userController.followUserController);

// @route POST - /api/users/unfollow/:username
// @description - unfollow a user
// @access - Private
userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)

// @route PATCH - api/users/follow/:username/accept
// @description - update follow request (pending => accepted)
// @access - Private
userRouter.patch("/follow/:username/accept", identifyUser, userController.acceptRequestController)

// @route PATCH - api/users/follow/:username/reject
// @description - update follow request (pending => rejected)
// @access - Private
userRouter.patch("/follow/:username/reject", identifyUser, userController.rejectRequestController)

// @route PATCH - /api/users/privacy
// @description - allow user to make account private or public
// @access - Private
userRouter.patch("/privacy", identifyUser, userController.privacyController)



module.exports = userRouter;