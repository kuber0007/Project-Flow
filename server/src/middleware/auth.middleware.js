import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(403, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {
            _id : decodedToken.userId
        }

        next()
    } catch(error) {
        throw new ApiError(401, "Invalid or expired access token");
    }
})

export {verifyJWT}