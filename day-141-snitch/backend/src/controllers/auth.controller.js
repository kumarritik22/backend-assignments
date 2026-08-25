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
            subject: "Verify your Velora account", 
            htmlContent: `
                <div style="background-color: #0a0a0a; color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 60px 20px; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 40px 30px; text-align: center;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">
                            Velora
                        </h1>
                        
                        <!-- Main Content -->
                        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 22px; font-weight: normal; color: #ffffff; margin-bottom: 16px;">
                            Welcome, ${user.fullname}
                        </h2>
                        <p style="color: #888888; font-size: 15px; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                            Thank you for joining Velora. To secure your account and gain exclusive access to our curated collections, please verify your email address.
                        </p>
                        
                        <!-- Premium Gold CTA Button -->
                        <a href="${verificationUrl}" style="display: inline-block; background-color: #C9A96E; color: #000000; text-decoration: none; padding: 14px 36px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;">
                            Verify Email
                        </a>
                        
                        <!-- Footer / Fallback Link -->
                        <div style="margin-top: 40px; border-top: 1px solid #2a2a2a; padding-top: 20px;">
                            <p style="color: #555555; font-size: 12px; margin-bottom: 10px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="font-size: 12px; word-break: break-all; margin: 0;">
                                <a href="${verificationUrl}" style="color: #C9A96E; text-decoration: none;">${verificationUrl}</a>
                            </p>
                        </div>
                        
                    </div>
                </div>
            `, 
            textContent: `Welcome to Velora, ${user.fullname}!\n\nTo secure your account and gain exclusive access to our curated collections, please verify your email address by visiting the link below:\n\n${verificationUrl}\n\nIf you did not request this, you can safely ignore this email.`
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
            subject: "Verify your Velora account", 
            htmlContent: `
                <div style="background-color: #0a0a0a; color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 60px 20px; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 40px 30px; text-align: center;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">
                            Velora
                        </h1>
                        
                        <!-- Main Content -->
                        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 22px; font-weight: normal; color: #ffffff; margin-bottom: 16px;">
                            Welcome, ${user.fullname}
                        </h2>
                        <p style="color: #888888; font-size: 15px; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                            Thank you for joining Velora. To secure your account and gain exclusive access to our curated collections, please verify your email address.
                        </p>
                        
                        <!-- Premium Gold CTA Button -->
                        <a href="${verificationUrl}" style="display: inline-block; background-color: #C9A96E; color: #000000; text-decoration: none; padding: 14px 36px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;">
                            Verify Email
                        </a>
                        
                        <!-- Footer / Fallback Link -->
                        <div style="margin-top: 40px; border-top: 1px solid #2a2a2a; padding-top: 20px;">
                            <p style="color: #555555; font-size: 12px; margin-bottom: 10px;">
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="font-size: 12px; word-break: break-all; margin: 0;">
                                <a href="${verificationUrl}" style="color: #C9A96E; text-decoration: none;">${verificationUrl}</a>
                            </p>
                        </div>
                        
                    </div>
                </div>
            `, 
            textContent: `Welcome to Velora, ${user.fullname}!\n\nTo secure your account and gain exclusive access to our curated collections, please verify your email address by visiting the link below:\n\n${verificationUrl}\n\nIf you did not request this, you can safely ignore this email.`
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
            subject: "Password Reset Request - Velora",
            htmlContent: `
                <div style="background-color: #0a0a0a; color: #ffffff; font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 60px 20px; line-height: 1.6;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #111111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 40px 30px; text-align: center;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; letter-spacing: 0.15em; color: #ffffff; text-transform: uppercase; margin-top: 0; margin-bottom: 30px;">
                            Velora
                        </h1>
                        
                        <!-- Main Content -->
                        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 22px; font-weight: normal; color: #ffffff; margin-bottom: 16px;">
                            Password Reset
                        </h2>
                        <p style="color: #888888; font-size: 15px; margin-bottom: 32px; max-width: 400px; margin-left: auto; margin-right: auto;">
                            Hello ${user.fullname},<br><br>
                            We received a request to reset the password for your Velora account. Click the button below to securely set a new password.
                        </p>
                        
                        <!-- Premium Gold CTA Button -->
                        <a href="${resetUrl}" style="display: inline-block; background-color: #C9A96E; color: #000000; text-decoration: none; padding: 14px 36px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;">
                            Reset Password
                        </a>
                        
                        <!-- Footer / Fallback Link -->
                        <div style="margin-top: 40px; border-top: 1px solid #2a2a2a; padding-top: 20px;">
                            <p style="color: #555555; font-size: 12px; margin-bottom: 10px;">
                                If you did not make this request, you can safely ignore this email. Your password will remain unchanged.<br><br>
                                If the button doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style="font-size: 12px; word-break: break-all; margin: 0;">
                                <a href="${resetUrl}" style="color: #C9A96E; text-decoration: none;">${resetUrl}</a>
                            </p>
                        </div>
                        
                    </div>
                </div>
            `,
            textContent: `Hello ${user.fullname},\n\nWe received a request to reset the password for your Velora account. To securely set a new password, please visit the link below:\n\n${resetUrl}\n\nIf you did not make this request, you can safely ignore this email. Your password will remain unchanged.`
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