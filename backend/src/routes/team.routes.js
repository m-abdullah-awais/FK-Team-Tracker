import { Router } from "express";
import teamController from "../controllers/team.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";
import { checkUserVerified } from "../middlewares/checkUserVerified.middleware.js";

class TeamRoutes {
    constructor() {
        this.router = Router();
        this.teamController = teamController;
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/members", verifyJWT, authorizeRole("admin"), checkUserVerified, this.teamController.getAllTeamMembers);
        this.router.get("/all", verifyJWT, checkUserVerified, this.teamController.getAllTeamData);
        this.router.patch("/verify/:userId", verifyJWT, authorizeRole("admin"), checkUserVerified, this.teamController.verifyRequest);
        this.router.patch("/decline/:userId", verifyJWT, authorizeRole("admin"), checkUserVerified, this.teamController.declineRequest);
    }

    getRouter() {
        return this.router;
    }
}

export default new TeamRoutes().getRouter();