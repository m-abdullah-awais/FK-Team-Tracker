import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

class TeamController {

    getAllTeamMembers = asyncHandler(async (req, res) => {
        const users = await userModel.User.aggregate([
            {
                $match: {
                    verification: "approved"
                }
            },
            {
                $lookup: {
                    from: "worksummaries",
                    localField: "_id",
                    foreignField: "createdBy",
                    as: "reports"
                }
            },
            {
                $addFields: {
                    totalReports: {
                        $size: "$reports"
                    },
                    averageRating: {
                        $cond: {
                            if: {
                                $gt: [{ $size: "$reports" }, 0]
                            },
                            then: {
                                $avg: "$reports.rating"
                            },
                            else: 0
                        }
                    },
                    totalHoursWorked: {
                        $sum: {
                            $map: {
                                input: "$reports",
                                as: "report",
                                in: {
                                    $divide: [
                                        { $subtract: [{ $toDate: "$$report.endTime" }, { $toDate: "$$report.startTime" }] },
                                        1000 * 60 * 60  // Convert from milliseconds to hours
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    refreshToken: 0,
                    otp: 0,
                    otpExpiry: 0,
                    passwordResetToken: 0,
                    passwordResetExpires: 0,
                    __v: 0,
                    reports: 0
                }
            }
        ]);

        if (!users || users.length === 0) throw new ApiError(400, "No Team Members found");
        res.status(200).json(new ApiResponse(200, "All team members fetched successfully", users));
    });


    getAllTeamData = asyncHandler(async (req, res) => {
        const users = await userModel.User.find().select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");
        if (!users) throw new ApiError(400, "No Users found");
        res.status(200).json(new ApiResponse(200, "All pending requests fetched successfully", users));
    })

    verifyRequest = asyncHandler(async (req, res) => {
        const { userId } = req.params;

        if (!userId) throw new ApiError(400, "Please provide userId");

        const user = await userModel.User.findByIdAndUpdate(userId, { verification: "approved" }, { new: true }).select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");

        if (!user) throw new ApiError(400, "User not exist");
        res.status(200).json(new ApiResponse(200, "User verified successfully", user));
    })

    declineRequest = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        if (!userId) throw new ApiError(400, "Please provide userId");

        const user = await userModel.User.findByIdAndUpdate(userId, { verification: "declined" }, { new: true }).select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");

        if (!user) throw new ApiError(400, "User not exist");
        res.status(200).json(new ApiResponse(200, "User request declined successfully", user));
    })

}

const teamController = new TeamController();
export default teamController;