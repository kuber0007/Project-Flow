import { createTask } from "../controllers/task.controller.js";
import { Router } from "express";

const router = Router();

router.post("/project/:projectId", createTask)

export default router;