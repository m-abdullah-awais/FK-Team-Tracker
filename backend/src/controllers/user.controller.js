import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

class UserController {

  getAllUsers = asyncHandler(async (req, res) => {
    const users = await userModel.User.find().select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");
    if (!users) throw new ApiError(400, "No Users found");
    res.status(200).json(new ApiResponse(200, "All users fetched successfully", users));
  })

  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) throw new ApiError(500, "User is not logged in");

    const {
      username,
      phone,
      gender,
      address,
      service,
      verification
    } = req.body;

    const user = await userModel.User.findById(userId);
    if (!user) throw new ApiError(404, "User does not exist");

    let profilePicUrl = user.profilePic;
    if (req.file?.path) {
      const cloudinaryRes = await uploadOnCloudinary(req.file.path);
      if (!cloudinaryRes) throw new ApiError(500, "Error uploading profile picture");
      profilePicUrl = cloudinaryRes.url;
    }

    const updatedUser = await userModel.User.findByIdAndUpdate(
      userId,
      {
        username: username || user.username,
        phone: phone || user.phone,
        gender: gender || user.gender,
        address: address || user.address,
        service: service || user.service,
        verification: verification || user.verification,
        profilePic: profilePicUrl
      },
      { new: true }
    ).select("-password -refreshToken -otp -otpExpiry");

    const userWithStats = await userModel.User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) }
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
          totalReports: { $size: "$reports" },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: "$reports" }, 0] },
              then: { $avg: "$reports.rating" },
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
                    1000 * 60 * 60
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
          __v: 0,
          reports: 0
        }
      }
    ]);

    const updatedUserWithStats = userWithStats[0];

    res.status(200).json(new ApiResponse(200, "Profile updated successfully", updatedUserWithStats));
  });

  updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) throw new ApiError(400, "Please provide userId");
    const { role } = req.body;
    if (!role) throw new ApiError(400, "Please provide role to update");
    const user = await userModel.User.findByIdAndUpdate(userId, { role }, { new: true }).select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");

    if (!user) throw new ApiError(400, "User not exist");
    res.status(200).json(new ApiResponse(200, `User role updated successfully to '${user.role}'`, user));
  })

  getProfile = asyncHandler(async (req, res) => {
    // const user = await userModel.User.findById(req.user?._id).select("-password -refreshToken -otp -otpExpiry -passwordResetToken -passwordResetExpires -__v");


    const user = await userModel.User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id)
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
                    1000 * 60 * 60
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
          __v: 0,
          reports: 0
        }
      }
    ]);

    if (!user) throw new ApiError(400, "User not found")

    res.status(200).json(new ApiResponse(200, "User Profile Fetched Successfully", user[0]));
  })

}

const userController = new UserController();
export default userController;