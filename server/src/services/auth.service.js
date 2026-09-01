import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { generateAccessToken } from "../utils/token.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = async ({ name, email, password }) => {

    // 1. Validate required fields
    if ([name, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "Please provide all the required fields");
    }

    // 2. Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Validate email
    if (!validator.isEmail(normalizedEmail)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    // 4. Check existing user
    const existingUser = await User.findOne({
        email: normalizedEmail
    });
    if (existingUser) {
        throw new ApiError(
            409,
            "User with this email already exists"
        );
    }

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 6. Create user
    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword
    });

    // 7. Remove password from response
    const createdUser = await User
        .findById(user._id)
        .select("-password");

    if (!createdUser) {
        throw new ApiError(
            500,
            "User creation failed"
        );
    }

    return createdUser;
};

const loginUser = async ({email, password}) =>{

    // 1. validate inputs
    if(!email?.trim() || !password?.trim()){
        throw new ApiError(400, "Email and password are required")
    }

    // 2. find user 
    const user = await User.findOne({
        email:email.trim().toLowerCase()
    })
    if(!user){
        throw new ApiError(401, "Invalid email or password")
    }

    // 3. compare password 
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw new ApiError(
            401,
            "Invalid email or password"
        );
    }

    // 4. Generate JWT
    const accessToken = generateAccessToken(user._id);

    // 5. remove password
    const loggedInUser = await User.findById(user._id)
    .select("-password")

    return {user:loggedInUser, accessToken}
}

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

const changePassword = async (userId, {oldPassword,newPassword}) =>{
    if(!oldPassword?.trim() || !newPassword?.trim()){
        throw new ApiError(400, "Old and new Password are Required")
    }

    const user = await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not Found")
    }
    
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password)
    if(!isOldPasswordValid){
        throw new ApiError(400, "Old Password is Incorrect")
    }

    if(oldPassword === newPassword){
        throw new ApiError(400, "Password should not be same as old password")
    }

    user.password =  await bcrypt.hash(newPassword,12)

    await user.save()
    return true;
}

export { registerUser, loginUser, getCurrentUser, changePassword };