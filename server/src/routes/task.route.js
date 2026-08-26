import { createTask, getProjectTasks, getSingleTask, updateTask, deleteTask, 
    assignTask, changeTaskStatus, changeTaskPriority, setTaskDueDate, searchTasks
} from "../controllers/task.controller.js";
import { Router } from "express";

const router = Router();

router.post("/project/:projectId", createTask) //Checked
router.get("/project/:projectId", getProjectTasks) //Checked
router.get("/:taskId", getSingleTask)
router.patch("/:taskId", updateTask)
router.delete("/:taskId", deleteTask)

router.post("/:taskId/assignee", assignTask)
router.patch("/:taskId/status", changeTaskStatus)
router.patch("/:taskId/priority", changeTaskPriority)
router.patch("/:taskId/due-date", setTaskDueDate)
router.get("/project/:projectId/search", searchTasks);

export default router;