import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, changePassword, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser); //tested
router.post("/login", loginUser) //tested

//secured
router.post("/logout", verifyJWT, logoutUser)
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/change-password", verifyJWT, changePassword);
router.post("/forgot-password", forgotPassword );
router.post("/reset-password/:token", resetPassword);

export default router;