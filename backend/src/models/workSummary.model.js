import mongoose from "mongoose";

class WorkSummaryModel {
    constructor() {
        this.workSummarySchema = new mongoose.Schema(
            {
                startTime: {
                    type: Date,
                    reuired: true
                },
                endTime: {
                    type: Date,
                    reuired: true
                },
                workSummary: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    min: [0, "Rating must be at least 0"],
                    max: [5, "Rating must be at most 5"],
                    default: 0
                },
                adminComments: {
                    type: String,
                    default: ""
                },
                isReviewed: {
                    type: Boolean,
                    default: false
                },
                createdBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
            },
            {
                timestamps: true,
            }
        );

        this.WorkSummary = mongoose.model("WorkSummary", this.workSummarySchema);
    }
}

const workSummaryModel = new WorkSummaryModel();
export default workSummaryModel;