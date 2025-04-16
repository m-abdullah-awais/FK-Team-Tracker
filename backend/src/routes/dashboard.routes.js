import express from "express";
import dashboardController from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";
import { checkUserVerified } from "../middlewares/checkUserVerified.middleware.js";

class DashboardRoutes {
    constructor() {
        this.router = express.Router();
        this.dashboardController = dashboardController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/admin/stats", verifyJWT, authorizeRole("admin"), checkUserVerified, this.dashboardController.getAdminDashboardStats);
        this.router.get("/team/stats", verifyJWT, authorizeRole("admin", "team"), checkUserVerified, this.dashboardController.getTeamDashboardStats);
    }
    getRouter() {
        return this.router;
    }
}

export default new DashboardRoutes().getRouter();