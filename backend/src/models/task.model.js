import mongoose from "mongoose";

class TaskModel {
    constructor() {
        this.taskSchema = new mongoose.Schema(
            {
                title: {
                    type: String,
                    required: true,
                    trim: true,
                },
                description: {
                    type: String,
                    required: true
                },
                priority: {
                    type: String,
                    enum: ["low", "medium", "high"],
                    default: "medium",
                    required: true
                },
                status: {
                    type: String,
                    enum: ["not_started", "ready", "progress", "blocked", "completed"],
                    default: "not_started",
                    required: true
                },
                dueDate: {
                    type: Date,
                    required: true
                },
                createdBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                },
                createdFor: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true
                }
            },
            {
                timestamps: true,
            }
        );

        this.Task = mongoose.model("Task", this.taskSchema);
    }
}

const taskModel = new TaskModel();
export default taskModel;
