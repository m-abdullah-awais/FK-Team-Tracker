import { ApiError } from "../utils/ApiError.js"

const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {       
        if (!allowedRoles.includes(req.user.role)) {
            const rolesList = allowedRoles.join(", ");
            throw new ApiError(403, `Access Denied! Only [${rolesList}] can access this resource.`);
        }
        next();
    }
}

export { authorizeRole };