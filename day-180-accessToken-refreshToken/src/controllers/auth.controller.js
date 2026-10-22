import { getAccessTokenService, loginService, registerService } from "../services/auth.service.js";

export const registerController = async (req, res) => {
    const { newUser, accessToken, refreshToken } = await registerService(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 10 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
        message: "User registered successfully",
        user: newUser
    });
};

export const loginController = async (req, res) => {
    const { accessToken, refreshToken, isAlreadyExist } = await loginService(req.body);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 10 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "User logged in successfully",
        user: isAlreadyExist
    });
};

export const getAccessTokenController = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized request"
        });
    }

    const accessToken = await getAccessTokenService(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 10 * 60 * 1000
    });

    return res.status(200).json({
        message: "Access token generated."
    });
};

export const logoutController = async (req, res) => {
    
}