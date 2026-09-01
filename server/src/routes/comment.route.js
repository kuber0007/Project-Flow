import { Router } from "express";
import { addComment, getTaskComments, deleteComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/task/:taskId", addComment) // Tested
router.get("/task/:taskId", getTaskComments) //Tested
router.delete("/:commentId", deleteComment) //Tested

export default router