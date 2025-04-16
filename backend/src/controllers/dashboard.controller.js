import userModel from "../models/user.model.js";
import workSummaryModel from "../models/workSummary.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class DashboardController {
    getAdminDashboardStats = asyncHandler(async (req, res) => {
        const totalUsers = await userModel.User.countDocuments();
        const totalReports = await workSummaryModel.WorkSummary.countDocuments();
        const pendingReviews = await workSummaryModel.WorkSummary.countDocuments({ isReviewed: false });

        // const reportsPerTeam = await workSummaryModel.WorkSummary.aggregate([
        //   {
        //     $lookup: {
        //       from: 'users',
        //       localField: 'createdBy',
        //       foreignField: '_id',
        //       as: 'user'
        //     }
        //   },
        //   { $unwind: '$user' },
        //   {
        //     $group: {
        //       _id: '$user.username',
        //       reports: { $sum: 1 }
        //     }
        //   },
        //   {
        //     $project: {
        //       name: '$_id',
        //       reports: 1,
        //       _id: 0
        //     }
        //   }
        // ]);

        const dateNow = new Date();

        const calculateWorkingHours = async (days) => {
            const dateFrom = new Date(dateNow);
            dateFrom.setDate(dateFrom.getDate() - days);

            const summaries = await workSummaryModel.WorkSummary.aggregate([
                {
                    $match: {
                        startTime: { $gte: dateFrom, $lte: dateNow }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $group: {
                        _id: '$user.username',
                        totalHours: {
                            $sum: {
                                $divide: [
                                    { $subtract: ['$endTime', '$startTime'] },
                                    1000 * 60 * 60
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        user: '$_id',
                        hours: { $round: ['$totalHours', 1] },
                        _id: 0
                    }
                }
            ]);

            return summaries;
        };

        const workingHours = {
            '7d': await calculateWorkingHours(7),
            '15d': await calculateWorkingHours(15),
            '30d': await calculateWorkingHours(30),
        };

        res.status(200).json(new ApiResponse(200, "Dashboard stats fetched successfully", {
            totalUsers,
            totalReports,
            pendingReviews,
            //   reportsPerTeam,
            workingHours
        }));
    });




    getTeamDashboardStats = asyncHandler(async (req, res) => {
        if (!req.user) {
            throw new ApiError(400, "No User")
        }

        // Get all reports stats for the user
        const totalReports = await workSummaryModel.WorkSummary.countDocuments({
            createdBy: req.user._id
        });

        const pendingReports = await workSummaryModel.WorkSummary.countDocuments({
            createdBy: req.user._id,
            isReviewed: false
        });

        const reviewedReports = await workSummaryModel.WorkSummary.countDocuments({
            createdBy: req.user._id,
            isReviewed: true
        });

        res.status(200).json(new ApiResponse(200, "Dashboard stats fetched successfully", {
            totalReports,
            pendingReports,
            reviewedReports
        }));
    })

}

const dashboardController = new DashboardController();
export default dashboardController;