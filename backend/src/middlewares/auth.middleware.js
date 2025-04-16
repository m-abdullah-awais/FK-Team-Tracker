import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {

        const token = req.header('Authorization')?.split(" ")[1] || req.header('authorization')?.split(" ")[1] || req.cookies?.accessToken;

        if (!token) {
            throw new ApiError(401, "Authentication token is required");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.User.findById(decodedToken?._id);

        if (!user) throw new ApiError(401, "Invalid or expired token");

        req.user = user;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new ApiError(401, "Invalid token");
        }
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token has expired");
        }
        throw new ApiError(401, error?.message || "Authentication error");
    }
});