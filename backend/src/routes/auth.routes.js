import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

class AuthRoutes {
    constructor() {
        this.router = Router();
        this.authController = authController;
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/register", this.authController.register);
        this.router.post("/login", this.authController.login);
        this.router.post("/logout", verifyJWT ,this.authController.logout);
        this.router.post("/refresh-token", this.authController.refreshAccessToken);
        this.router.post("/send-otp", this.authController.sendOtpToUser);
        this.router.post("/verify-otp", this.authController.verifyOtp);
        this.router.post("/forgot-password", this.authController.forgotPassword);
        this.router.post("/reset-password/:token", this.authController.resetPassword);
    }

    getRouter() {
        return this.router;
    }
}

export default new AuthRoutes().getRouter();