import express from "express";
import cookieController from "../controllers/cookie.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

class CookieRoutes {
    constructor() {
        this.router = express.Router();
        this.cookieController = cookieController;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/all", verifyJWT, this.cookieController.getAllCookies);
        this.router.get("/single/:cookieName", verifyJWT, this.cookieController.getSingleCookie);
        this.router.post("/set", verifyJWT, this.cookieController.setCookie);
        this.router.put("/update", verifyJWT, this.cookieController.updateCookie);
        this.router.delete("/delete/:cookieName", verifyJWT, this.cookieController.deleteCookie);
    }
    getRouter() {
        return this.router;
    }
}

export default new CookieRoutes().getRouter();