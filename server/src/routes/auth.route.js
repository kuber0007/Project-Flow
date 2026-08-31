import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser); //tested
router.post("/login", loginUser) //tested

//secured
router.post("/logout", verifyJWT, logoutUser)

export default router;