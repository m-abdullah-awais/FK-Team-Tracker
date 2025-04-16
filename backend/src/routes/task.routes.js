import { Router } from "express";
import taskController from "../controllers/task.controller.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";
import { checkUserVerified } from "../middlewares/checkUserVerified.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

class TeamRoutes {
    constructor() {
        this.router = Router();
        this.taskController = taskController;
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/create", verifyJWT, authorizeRole("admin"), checkUserVerified, this.taskController.getAllTasks);
        this.router.get("/all", verifyJWT, authorizeRole("admin"), checkUserVerified, this.taskController.getAllTasks);
        this.router.get("/single/:id", verifyJWT, authorizeRole("admin", "team"), checkUserVerified, this.taskController.getTaskById);
        this.router.patch("/update/:id", verifyJWT, authorizeRole("admin", "team"), checkUserVerified, this.taskController.updateTask);
        this.router.delete("/delete/:id", verifyJWT, authorizeRole("admin"), checkUserVerified, this.taskController.deleteTask);
        this.router.get("/member-task/:userId", verifyJWT, authorizeRole("admin", "team"), checkUserVerified, this.taskController.getUserTask);
    }

    getRouter() {
        return this.router;
    }
}

export default new TeamRoutes().getRouter();