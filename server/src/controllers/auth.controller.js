import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    registerUser as registerUserService,
    loginUser as loginUserService
} from "../services/auth.service.js";

//1. Register 
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await registerUserService({
        name,
        email,
        password
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                result,
                "User registered successfully"
            )
        );
});

// 2. Login 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUserService({
        email,
        password
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "User logged in successfully"
            )
        );
});

// 3. Logout 
const logoutUser = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "User logged out successfully"
        )
    );
});

export { registerUser, loginUser, logoutUser };