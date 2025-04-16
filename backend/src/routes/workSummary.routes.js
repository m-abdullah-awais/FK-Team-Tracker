import express from "express";
import workSummaryController from "../controllers/workSummary.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";

class WorkSummaryRoutes {
    constructor() {
        this.router = express.Router();
        this.workSummaryController = workSummaryController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/all", verifyJWT, this.workSummaryController.getAllWorkSummary);
        this.router.get("/single/:id", verifyJWT, this.workSummaryController.getSingleWorkSummary);
        this.router.post("/create", verifyJWT, this.workSummaryController.createWorkSummary);

        this.router.patch("/update/:id", verifyJWT, authorizeRole("admin"), this.workSummaryController.updateWorkSummary);
        this.router.delete("/delete/:id", verifyJWT, authorizeRole("admin"), this.workSummaryController.deleteWorkSummary);
        this.router.get("/all-users-summary", verifyJWT, authorizeRole("admin"), this.workSummaryController.getAllUsersWorkSummary);

        // this.router.get("/search", verifyJWT, this.workSummaryController.searchWorkSummary);
    }
    getRouter() {
        return this.router;
    }
}

export default new WorkSummaryRoutes().getRouter();