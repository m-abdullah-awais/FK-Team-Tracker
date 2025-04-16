import workSummaryModel from "../models/workSummary.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class WorkSummaryController {
    createWorkSummary = asyncHandler(async (req, res) => {
        const { startTime, endTime, workSummary } = req.body;

        if ([startTime, endTime, workSummary].some((item) => !item?.trim())) {
            throw new ApiError(400, "All fields are required");
        }

        const newWorkSummary = new workSummaryModel.WorkSummary({
            createdBy: req.user._id,
            startTime,
            endTime,
            workSummary
        });

        await newWorkSummary.save();

        await newWorkSummary.populate({
            path: "createdBy",
            select: "-_id username email role service profilePic"
        })

        return res.status(200).json(new ApiResponse(200, "Work summary created successfully", newWorkSummary));
    })
    getAllWorkSummary = asyncHandler(async (req, res) => {

        const summarys = await workSummaryModel.WorkSummary.find({ createdBy: req.user._id })
            .populate({ path: "createdBy", select: "-_id username email role service profilePic" })
            .sort({ createdAt: -1 });

        if (!summarys) throw new ApiError(404, "No work summary found");
        return res.status(200).json(new ApiResponse(200, "Work summary fetched successfully", summarys));

    })
    getSingleWorkSummary = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const summary = await workSummaryModel.WorkSummary.findById(id).populate("createdBy", "-_id username email role service profilePic");
        if (!summary) throw new ApiError(404, "Work summary not found");
        return res.status(200).json(new ApiResponse(200, "Work summary fetched successfully", summary));
    })
    updateWorkSummary = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { rating, adminComments } = req.body;

        if (!rating && !adminComments) throw new ApiError(400, "Atleast one field is required");

        const summary = await workSummaryModel.WorkSummary.findById(id).populate("createdBy", "-_id username email role service profilePic")

        if (!summary) throw new ApiError(404, "Work summary not found");

        if (rating) summary.rating = rating;
        if (adminComments) summary.adminComments = adminComments;
        summary.isReviewed = true;

        await summary.save();

        return res.status(200).json(new ApiResponse(200, "Work summary updated successfully", summary));
    })
    deleteWorkSummary = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const summary = await workSummaryModel.WorkSummary.findByIdAndDelete(id).populate("createdBy", "-_id username email role service profilePic");
        if (!summary) throw new ApiError(404, "Work summary not found");
        return res.status(200).json(new ApiResponse(200, "Work summary deleted successfully", summary));
    })
    getAllUsersWorkSummary = asyncHandler(async (req, res) => {
        const summarys = await workSummaryModel.WorkSummary.find()
            .populate({ path: "createdBy", select: "-_id username email role service profilePic" })
            .sort({ createdAt: -1 });

        if (!summarys) throw new ApiError(404, "No work summary found");
        return res.status(200).json(new ApiResponse(200, "Work summary fetched successfully", summarys));
    })

    // searchWorkSummary = asyncHandler(async (req, res) => {

    // })
}

const workSummaryController = new WorkSummaryController();
export default workSummaryController;