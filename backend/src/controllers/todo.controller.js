
import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class TodoController {
    createTodo = asyncHandler(async (req, res) => {
        const { title, description } = req.body;

        if (!title?.trim()) {
            throw new ApiError(400, "Title is required");
        }

        const todo = await Todo.create({
            title,
            description,
            createdBy: req.user?._id
        });

        return res.status(201).json(
            new ApiResponse(201, "Todo created successfully", todo)
        );
    });

    getAllTodos = asyncHandler(async (req, res) => {
        const todos = await Todo.find({ createdBy: req.user._id })
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, "Todos fetched successfully", todos)
        );
    });

    updateTodoStatus = asyncHandler(async (req, res) => {
        const { status } = req.body;
        const { todoId } = req.params;

        const todo = await Todo.findOneAndUpdate(
            { _id: todoId, createdBy: req.user._id },
            { status },
            { new: true }
        );

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Todo status updated successfully", todo)
        );
    });

    deleteTodo = asyncHandler(async (req, res) => {
        const { todoId } = req.params;

        const todo = await Todo.findOneAndDelete({
            _id: todoId,
            createdBy: req.user._id
        });

        if (!todo) {
            throw new ApiError(404, "Todo not found");
        }

        return res.status(200).json(
            new ApiResponse(200, "Todo deleted successfully", {})
        );
    });
}

export default new TodoController();