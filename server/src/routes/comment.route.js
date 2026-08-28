import { Router } from "express";
import { addComment, getTaskComments, deleteComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/task/:taskId", addComment) // Tested
router.get("/task/:taskId", getTaskComments) //Tested
router.delete("/:commentId", deleteComment) //Tested

export default router