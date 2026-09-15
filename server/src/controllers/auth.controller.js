import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
    registerUser as registerUserService,
    loginUser as loginUserService,
    getCurrentUser as getCurrentUserService,
    changePassword as changePasswordService,
    forgotPassword as forgotPasswordService,
    resetPassword as resetPasswordService,
} from "../services/auth.service.js";

import User from "../models/user.model.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

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

// 4. Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await getCurrentUserService(req.user._id);

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Current user fetched successfully"
        )
    );
});

// 5. Change password 
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    await changePasswordService(req.user._id, { oldPassword, newPassword })

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Password changed successfully"
        )
    );

})

// 6. Forgot password
const forgotPassword = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    await forgotPasswordService(email);

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "If an account with that email exists, a password reset link has been sent"
      )
    );
  }
);

// 7. Reset password
const resetPassword = asyncHandler(
  async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    await resetPasswordService(
      token,
      newPassword
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        null,
        "Password reset successfully"
      )
    );
  }
);

// 8. Upload / Update Avatar
const updateAvatar = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      throw new ApiError(
        400,
        "Please select an image to upload."
      );
    }

    const user =
      await User.findById(
        req.user._id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    const uploaded =
      await uploadToCloudinary(
        req.file.buffer,
        "projectflow/avatars"
      );

    if (!uploaded?.secure_url) {
      throw new ApiError(
        500,
        "Avatar upload failed."
      );
    }

    const oldPublicId =
      user.avatarPublicId;

    user.avatar =
      uploaded.secure_url;

    user.avatarPublicId =
      uploaded.public_id;

    await user.save();

    if (oldPublicId) {
      try {
        await deleteFromCloudinary(
          oldPublicId
        );
      } catch (deleteError) {
        console.error(
          "Failed to delete old avatar:",
          deleteError
        );
      }
    }

    const updatedUser =
      await User.findById(
        user._id
      ).select("-password");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "Avatar updated successfully"
        )
      );
  }
);

export { registerUser, loginUser, logoutUser, getCurrentUser, changePassword, forgotPassword, resetPassword, updateAvatar};