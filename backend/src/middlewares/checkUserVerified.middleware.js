import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const checkUserVerified = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.verified === "approved") {
        return next(new ApiError(403, "User is not verified! Please verify your account."));
    }
    next();
})