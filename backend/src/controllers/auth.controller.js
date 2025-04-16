import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { send_Mail } from "../utils/nodemailer.js";
import crypto from "crypto";

class AuthController {
    async generateTokens(userId) {
        try {
            const user = await userModel.User.findById(userId);
            if (!user) throw new ApiError(404, "User not found");

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;

            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error) {
            throw new ApiError(500, "Error in generating tokens");
        }
    }


    register = asyncHandler(async (req, res) => {
        const { username, email, password, role, service } = req.body;

        if ([username, email, password, role].some((item) => !item?.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        const existingUser = await userModel.User.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const user = await userModel.User.create({ username, email, password, role, service });
        if (!user) {
            throw new ApiError(500, "Error creating new user");
        }
        user.gender = undefined

        user.password = undefined;
        user.refreshToken = undefined;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        res.status(200).json(new ApiResponse(200, "User successfully created", user));
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if (!email) throw new ApiError(400, "Email is required");

        const user = await userModel.User.findOne({ email });
        if (!user || !(await user.isPasswordCorrect(password))) {
            throw new ApiError(400, "Invalid email or password");
        }

        if (user.verification !== "approved") {
            throw new ApiError(406, "Please wait for the admin to approve your account");
        }

        const { accessToken, refreshToken } = await this.generateTokens(user._id);
        user.gender = undefined

        user.password = undefined;
        user.refreshToken = undefined;
        user.otp = undefined;
        user.otpExpiry = undefined;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        res.status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json(new ApiResponse(200, "Successfully Logged In", { user, accessToken, refreshToken }));


    });

    logout = asyncHandler(async (req, res) => {
        await userModel.User.findByIdAndUpdate(req.user?._id, { refreshToken: null });

        res.status(200)
            .clearCookie("accessToken")
            .clearCookie("refreshToken")
            .clearCookie("connect.sid")
            .json(new ApiResponse(200, "Successfully Logged out"));
    });

    refreshAccessToken = asyncHandler(async (req, res) => {
        const incomingRefreshToken = req.body?.refreshToken || req.cookies.refreshToken;
        if (!incomingRefreshToken) throw new ApiError(400, "Please provide refresh token");

        try {
            const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
            const user = await userModel.User.findById(decoded?._id);

            if (!user || incomingRefreshToken !== user.refreshToken) {
                throw new ApiError(400, "Invalid refresh token");
            }

            const { accessToken, refreshToken } = await this.generateTokens(user._id);

            res.status(200)
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None'
                })
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None'
                })
                .json(new ApiResponse(200, "Tokens refreshed", { accessToken, refreshToken }));
        } catch (error) {
            throw new ApiError(400, error.message || "Invalid refresh token");
        }
    });

    generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    sendOtpToUser = asyncHandler(async (req, res) => {
        const { email } = req.body;
        if (!email) throw new ApiError(400, "Email is required");

        let user = await userModel.User.findOne({ email });
        if (!user) throw new ApiError(404, "User not found");

        const otp = this.generateOTP();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await user.save();

        // for testing purpose
        console.log("Testing OTP: ", otp);

        const receiverEmail = email;
        const subject = "Your OTP code";
        const text = `Your OTP code is ${otp}. It is valid for 5 minutes.`;

        await send_Mail(receiverEmail, subject, text);

        res.status(200).json(new ApiResponse(200, `OTP sent to your mail: ${email}`));
    });

    verifyOtp = asyncHandler(async (req, res) => {
        const { email, otp } = req.body;
        if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

        const user = await userModel.User.findOne({ email });
        if (!user) throw new ApiError(404, "User not found");

        if (user.otp !== otp) throw new ApiError(400, "Invalid OTP");
        if (user.otpExpiry < new Date()) throw new ApiError(400, "OTP expired");

        user.otp = null;
        user.otpExpiry = null;
        // user.isVerified = true;
        // await user.save();

        res.status(200).json(new ApiResponse(200, "OTP verified successfully"));
    });

    forgotPassword = asyncHandler(async (req, res) => {
        const { email } = req.body;

        if (!email) throw new ApiError(400, "Email is required");

        const user = await userModel.User.findOne({ email });
        if (!user) throw new ApiError(404, "User not found");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.passwordResetToken = hashedToken;
        user.passwordResetExpires = Date.now() + 3600000;

        await user.save();

        const resetURL = `${req.protocol}://${req.get("host") + req.baseUrl}/reset-password/${resetToken}`;

        // for testing purpose
        console.log("Testing: ", resetURL);

        const receiverEmail = user.email;
        const subject = "Password Reset";
        const text = `You requested a password reset. Click the link to reset your password: \n\n${resetURL}`;

        await send_Mail(receiverEmail, subject, text);

        res.status(200).json(new ApiResponse(200, "Password reset link sent to your email"));
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword) throw new ApiError(400, "New password is required");

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await userModel.User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) throw new ApiError(400, "Invalid or expired reset token");

        user.password = newPassword;

        user.passwordResetToken = null;
        user.passwordResetExpires = null;

        await user.save();

        res.status(200).json(new ApiResponse(200, "Password reset successfully"));
    });

}

const authController = new AuthController();
export default authController;