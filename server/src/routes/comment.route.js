import { Router } from "express";
import { addComment } from "../controllers/comment.controller.js";

const router = Router();

router.post("/task/:taskId", addComment); // Tested


export default router