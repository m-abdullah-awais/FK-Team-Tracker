import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class CookieController {
    
    getAllCookies = asyncHandler(async (req, res) => {
        if (!req.cookies || Object.keys(req.cookies).length === 0) {
            throw new ApiError(400, "No cookies found");
        }
        res.status(200).json(new ApiResponse(200, "All cookies fetched successfully", req.cookies));
    });

    getSingleCookie = asyncHandler(async (req, res) => {
        const cookieName = req.params.cookieName;
        const cookie = req.cookies[cookieName];

        if (!cookie) throw new ApiError(404, `Cookie with name ${cookieName} not found`);

        res.status(200).json(new ApiResponse(200, `Cookie '${cookieName}' fetched successfully`, { [cookieName]: cookie }));
    });

    setCookie = asyncHandler(async (req, res) => {
        const { name, value, options } = req.body;

        if (!name || !value) throw new ApiError(400, "Cookie name and value are required");

        res.cookie(name, value, options || { httpOnly: true, secure: false, maxAge: 3600000 });

        res.status(200).json(new ApiResponse(200, `Cookie '${name}' set successfully`));
    });

    deleteCookie = asyncHandler(async (req, res) => {
        const cookieName = req.params.cookieName;
        
        if (!req.cookies[cookieName]) throw new ApiError(404, `Cookie with name ${cookieName} not found`);

        res.clearCookie(cookieName);

        res.status(200).json(new ApiResponse(200, `Cookie '${cookieName}' deleted successfully`));
    });
    

    updateCookie = asyncHandler(async (req, res) => {
        const { name, value, options } = req.body;

        if (!name || !value) throw new ApiError(400, "Cookie name and value are required");

        if(!req.cookies[name]) throw new ApiError(400, `Cookie not found`);

        res.cookie(name, value, options || { httpOnly: true, secure: false, maxAge: 3600000 });

        res.status(200).json(new ApiResponse(200, "Cookie updated successfully"));
    });
}

const cookieController = new CookieController();
export default cookieController;
