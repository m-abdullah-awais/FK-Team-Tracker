import taskModel from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class TaskController {
    createTask = asyncHandler(async (req, res) => {
        const { title, description, priority, status, dueDate, createdBy, createdFor } = req.body;

        if (!title || !description || !dueDate || !createdBy || !createdFor) {
            throw new ApiError(400, "All required fields must be provided");
        }

        const newTask = await taskModel.Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            createdBy,
            createdFor
        });

        if (!newTask) throw new ApiError(400, "Task creation failed");

        return res.status(201).json(new ApiResponse(201, newTask, "Task created successfully"));
    });

    getAllTasks = asyncHandler(async (req, res) => {
        const tasks = await taskModel.Task.find().populate("createdBy createdFor").sort({ createdAt: -1 });
        if (!tasks) throw new ApiError(400, "No tasks found");
        return res.status(200).json(new ApiResponse(200, tasks, "All tasks fetched successfully"));
    });

    getTaskById = asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (!id) throw new ApiError(400, "Provide Task Id");

        const task = await taskModel.Task.findById(id).populate("createdBy createdFor");

        if (!task) throw new ApiError(400, "Task not found");

        return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"));
    });

    updateTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const updatedTask = await taskModel.Task.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTask) throw new ApiError(400, "Task not found or update failed");

        return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"));
    });

    deleteTask = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const deletedTask = await taskModel.Task.findByIdAndDelete(id);

        if (!deletedTask) throw new ApiError(400, "Task not found or delete failed");

        return res.status(200).json(new ApiResponse(200, deletedTask, "Task deleted successfully"));
    });

    getUserTask = asyncHandler(async (req, res) => {
        const { userId } = req.params;

        if (!userId) throw new ApiError(400, "Please provide UserId");

        const tasks = await taskModel.Task.find({
            $or: [{ createdBy: userId }, { createdFor: userId }]
        }).populate("createdBy createdFor").sort({ createdAt: -1 });

        if (!tasks) throw new ApiError(400, "No User tasks found");

        return res.status(200).json(new ApiResponse(200, tasks, "User tasks fetched successfully"));
    });

}

const taskController = new TaskController();
export default taskController;
