const followModel = require("../models/follow.model");
const userModel = require("../models/user.model");

async function followUserController (req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    // Prevent self follow
    if (followeeUsername === followerUsername) {
        return res.status(400).json({
            message: "You can't follow yourself"
        })
    }

    // Check if followee exists
    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if (!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow doesn't exist."
        })
    }

    // Check if already following or request already exists
    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if (isAlreadyFollowing) {

            if (isAlreadyFollowing.status === "accepted") {
            return res.status(409).json({
                message: `You are already following ${followeeUsername}`,
                follow: isAlreadyFollowing
            });
        }

        if (isAlreadyFollowing.status === "pending") {
            return res.status(409).json({
                message: `Follow request already sent to ${followeeUsername}`,
                follow: isAlreadyFollowing
            });
        }

        if (isAlreadyFollowing.status === "rejected") {
            const newStatus = isFolloweeExists.isPrivate ? "pending" : "accepted";

            isAlreadyFollowing.status = newStatus;
            await isAlreadyFollowing.save();

            return res.status(200).json({
                message: newStatus === "pending" ? "Follow request sent again" : `You are now following ${followeeUsername}`,
                follow: isAlreadyFollowing
            })
        }
    }

    // Decide status based on privacy
    let status;

    if (isFolloweeExists.isPrivate) {
        status = "pending";
    } else {
        status = "accepted";
    }

    // Create follow record with correct status
    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: status
    });

    // Send response based on status
    if (status === "pending") {
        return res.status(201).json({
            message: "Follow request sent",
            follow: followRecord
        })
    } 

    res.status(201).json({
        message: `You are now following ${followeeUsername}`,
        follow: followRecord
    })
}

async function unfollowUserController (req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername 
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You are not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You have unfollowed ${followeeUsername}`
    })
}

async function acceptRequestController (req, res) {
    const loggedInUser = req.user.username; // followee
    const followerUsername = req.params.username;

    const followRequest = await followModel.findOne({
            followee: loggedInUser,
            follower: followerUsername
        })

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if (followRequest.followee !== loggedInUser) {
        return res.status(403).json({
            message: "You are not allowed to accept this request"
        })
    }

    if (followRequest.status !== "pending") {
        return res.status(400).json({
            message: "Request already processed"
        })
    }

    followRequest.status = "accepted";
    await followRequest.save();

    res.status(200).json({
        message: "Follow request accepted",
        followRequest
    })

}

async function rejectRequestController (req, res) {
    const loggedInUser = req.user.username; // followee
    const followerUsername = req.params.username

    const followRequest = await followModel.findOne({
            followee: loggedInUser,
            follower: followerUsername
        })

    if (!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if (followRequest.followee !== loggedInUser) {
        return res.status(403).json({
            message: "You are not allowed to reject this request"
        })
    }

    if (followRequest.status !== "pending") {
        return res.status(400).json({
            message: "Request already processed"
        })
    }

    followRequest.status = "rejected";
    await followRequest.save();

    res.status(200).json({
        message: "Follow request rejected",
        followRequest
    })
}

async function privacyController (req, res) {
    const username = req.user.username

    const {isPrivate} = req.body

    const updatedAccountStatus = await userModel.findOneAndUpdate(
        {
            username: username
        },
        {
            isPrivate: isPrivate
        },
        {
            new: true
        }
    )

    res.status(200).json({
        message: "Account privacy update successfully",
        username,
        isPrivate: updatedAccountStatus.isPrivate
    })
}

module.exports = {
    followUserController,
    unfollowUserController,
    acceptRequestController,
    rejectRequestController,
    privacyController
}
