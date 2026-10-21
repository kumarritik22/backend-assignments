import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized request"
            });
        }

        const decode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized request"
            });
        }

        const user = await userModel.findById(decode.id);

        req.user = user;

        next();
        
    } catch (error) {
        throw new Error(error);
    }
};