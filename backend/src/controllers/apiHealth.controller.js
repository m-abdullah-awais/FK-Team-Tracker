import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

class ApiHealthController {
    checkApiHealth = asyncHandler(async (req, res) => {
        const healthStatus = {
            status: "OK",
            message: "API is running smoothly",
            timestamp: new Date().toISOString()
        };

        res.status(200).json(new ApiResponse(200, "API Health Check Passed", healthStatus));
    });
}

const apiHealthController = new ApiHealthController();
export default apiHealthController;