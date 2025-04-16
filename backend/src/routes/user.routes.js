import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";
import { checkUserVerified } from "../middlewares/checkUserVerified.middleware.js";

class UserRoutes {
    constructor() {
        this.router = Router();
        this.userController = userController;
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/all", verifyJWT, authorizeRole("admin"), checkUserVerified, this.userController.getAllUsers);
        this.router.patch("/update-profile", verifyJWT, upload.single("profilePic"), checkUserVerified, this.userController.updateProfile);
        this.router.patch("/role/:userId", verifyJWT, authorizeRole("admin"), checkUserVerified, this.userController.updateUserRole);
        this.router.get("/profile", verifyJWT, checkUserVerified, this.userController.getProfile);
        // this.router.post("/verify", verifyJWT, authorizeRole("admin"), checkUserVerified, this.userController.verifyByAdmin);
    }

    getRouter() {
        return this.router;
    }
}

export default new UserRoutes().getRouter();