import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import validator from "validator";

export const registerUser = asyncHandler(async (req,res)=>{
    //1. input from frontend
    const {name,email,password} = req.body;

    // 2.validate input(not empty)
    if([name,email,password].some(field=>!field?.trim())){
        throw new ApiError(400, "Please provide all the required fields");
    }

    // 3.validate email format
    if(!validator.isEmail(email.trim())){
        throw new ApiError(400, "Please provide a valid email address");
    }

    // 4. check existing user
    const existingUser = await User.findOne({
        email: email.toLowerCase().trim()
    });

    if(existingUser){
        throw new ApiError(400, "User with this email already exists");
    }

    // 5. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. create user
    const user = await User.create({
        name:name.trim(),
        email:email.toLowerCase().trim(),
        password:hashedPassword
    })

    // 7. remove password and send response
    const createdUser = await User.findById(user._id).select("-password");
    if(!createdUser){
        throw new ApiError(500, "User creation failed");
    }
    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"))
})
