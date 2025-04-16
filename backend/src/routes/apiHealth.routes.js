import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import apiHealthController from "../controllers/apiHealth.controller.js";

class ApiHealthRoutes {
    constructor() {
        this.router = express.Router();
        this.apiHealthController = apiHealthController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/check", verifyJWT, this.apiHealthController.checkApiHealth);
    }
    getRouter() {
        return this.router;
    }
}

export default new ApiHealthRoutes().getRouter();