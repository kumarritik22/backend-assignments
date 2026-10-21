import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

export const registerService = async (data) => {
    try {
        const { name, email, password } = data;

        if (!email || !password) {
            throw new Error("All fields are required.");
        }

        const isAlreadyExist = await userModel.findOne({ email });

        if (isAlreadyExist) {
            throw new Error("User already exists with this email.");
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const newUser = await userModel.create({
            name,
            email,
            password: hashPassword
        });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        newUser.refreshToken = refreshToken;
        await newUser.save();

        return { newUser, accessToken, refreshToken }
    } catch (error) {
        throw new Error(error);
    }
};

export const loginService = async (data) => {
    try {
        const { email, password } = data;

        if (!email || !password) {
            throw new Error("All fields are required.");
        }

        const isAlreadyExist = await userModel.findOne({ email });

        if (!isAlreadyExist) {
            throw new Error("User not found.");
        }

        const hashPassword = bcrypt.compareSync(password, isAlreadyExist.password);

        if (!hashPassword) {
            throw new Error("Invalid credentials");
        }

        const accessToken = generateAccessToken(isAlreadyExist._id);
        const refreshToken = generateRefreshToken(isAlreadyExist._id);

        isAlreadyExist.refreshToken = refreshToken;
        await isAlreadyExist.save();

        return { 
            accessToken, 
            refreshToken, 
            isAlreadyExist 
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const getAccessTokenService = async (refreshToken) => {
    const decode = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decode) throw new Error("Unauthorized");

    const user = await userModel.findById(decode.id);

    if (refreshToken !== user.refreshToken) throw new Error("Unauthorized");

    const accessToken = generateAccessToken(user._id);

    return accessToken;
};