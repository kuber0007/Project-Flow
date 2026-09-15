import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, changePassword, forgotPassword, resetPassword , updateAvatar} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", registerUser); //tested
router.post("/login", loginUser) //tested

//secured
router.post("/logout", verifyJWT, logoutUser)
router.get("/me", verifyJWT, getCurrentUser);
router.patch("/change-password", verifyJWT, changePassword);
router.post("/forgot-password", forgotPassword );
router.post("/reset-password/:token", resetPassword);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateAvatar);

export default router;