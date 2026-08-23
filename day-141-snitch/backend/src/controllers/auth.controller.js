import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { sendEmail } from "../services/email.service.js";
import crypto from "node:crypto";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user._id,
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    res.cookie("token", token)

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const register = async (req, res) => {
    const {email, contact, fullname, password, isSeller} = req.body

    try {
        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or contact already exists"
            });
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const user = await userModel.create({
            fullname,
            email,
            contact,
            password,
            role: isSeller ? "seller" : "buyer",
            emailVerificationToken: token,
            emailVerificationTokenExpiresAt: expiresAt
        });

        const verificationUrl = config.FRONTEND_URL + "/verify-email/" + user.emailVerificationToken

        await sendEmail({ 
            to: user.email, 
            toName: user.fullname,
            subject: "Verify your Velora email", 
            htmlContent: `Welcome to Velora, ${user.fullname}! <br />
                Please verify your email address <br /> <a href="${verificationUrl}">Verify Email</a>`, 
            textContent: `Welcome to Velora, ${user.fullname}!
            Please verify your email address by visiting: ${verificationUrl}`
        })

        await sendTokenResponse(user, res, "Registration successful. Please check your email to verify your account.")

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordMatching = await user.comparePassword(password);

        if (!isPasswordMatching) {
            return res.status(400).json({
                message: "Wrong password"
            })
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                message: "Please verify your email first.",
                success: false
            })
        }

        await sendTokenResponse(user, res, "User logged in successfully.")
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const logout = async (req, res) => {
    res.clearCookie("token")

    return res.status(200).json({
        message: "User logged out successfully.",
        success: true
    })
}

export const googleCallback = async (req, res) => {
    const { id, displayName, emails, photos } = req.user;

    const email = emails[0].value;
    const profilePic = photos[0].value;

    let user = await userModel.findOne({
        email
    });

    if (!user) {
        user = await userModel.create({
            email,
            googleId: id,
            fullname: displayName,
            isEmailVerified: true
        });
    } else {
        user.isEmailVerified = true;
        await user.save()
    }

    const token = jwt.sign({
        id: user.id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token);

    res.redirect("http://localhost:5173");
}

export const getMe = async (req, res) => {
    const user = req.user

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const user = await userModel.findOne({ emailVerificationToken:token })

        if (!user) {
            return res.status(404).json({
                message: "Verification token is invalid",
                success: false
            })
        }

        if (Date.now() > user.emailVerificationTokenExpiresAt.getTime()) {
            return res.status(404).json({
                message: "Verification link is expired.",
                success: false
            })
        }

        user.isEmailVerified = true

        user.emailVerificationToken = null
        user.emailVerificationTokenExpiresAt = null

        await user.save();

        return res.status(200).json({
            message: "Email verified successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: "Email doesn't exist",
                success: false
            })
        }

        if (user.isEmailVerified === true ) {
            return res.status(200).json({
                message: "Email is already verified",
                success: true
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const verificationUrl = config.FRONTEND_URL + "/verify-email/" + token

        await sendEmail({
            to: user.email,
            toName: user.fullname,
            subject: "Verify your Velora email",
            htmlContent: `Welcome to Velora, ${user.fullname}! <br />
                Please verify your email address <br /> <a href="${verificationUrl}">Verify Email</a>`, 
            textContent: `Welcome to Velora, ${user.fullname}!
            Please verify your email address by visiting: ${verificationUrl}`
        })

        user.emailVerificationToken = token
        user.emailVerificationTokenExpiresAt = expiresAt

        await user.save();

        return res.status(200).json({
            message: "Verification email sent successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Email doesn't exist",
                success: false
            })
        }

        if (user.googleId) {
            return res.status(400).json({
                message: "This account uses Google login. Please continue with Google.",
                success: false
            })
        }

        const token = crypto.randomBytes(32).toString("hex")
        const expiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        );

        const resetUrl = config.FRONTEND_URL + "/reset-password/" + token

        await sendEmail({
            to: user.email,
            toName: user.fullname,
            subject: "Password reset request",
            htmlContent: `Welcome to Velora, ${user.fullname}! <br />
                You requested a password reset for your Velora account. Click the button below to set a new password <br /> <a href="${resetUrl}">Reset Password</a>`,
            textContent: `Welcome to Velora, ${user.fullname}!
            You requested a password reset for your Velora account. Set a new password by visiting: ${resetUrl}`
        })

        user.passwordResetToken = token
        user.passwordResetTokenExpiresAt = expiresAt

        await user.save();

        return res.status(200).json({
            message: "Password reset email sent successfully.",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params

        const { newPassword } = req.body

        const user = await userModel.findOne({ passwordResetToken: token })

        if (!user) {
            return res.status(404).json({
                message: "Invalid or expired reset token",
                success: false
            })
        }

        if (Date.now() > user.passwordResetTokenExpiresAt.getTime()) {
            return res.status(404).json({
                message: "Reset link has expired.",
                success: false
            })
        }

        user.password = newPassword

        user.passwordResetToken = null
        user.passwordResetTokenExpiresAt = null

        await user.save();

        return res.status(200).json({
            message: "Password reset successfully.",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}