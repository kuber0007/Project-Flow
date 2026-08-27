import { createTask, getProjectTasks, getSingleTask, updateTask, deleteTask, 
    assignTask, changeTaskStatus, changeTaskPriority, setTaskDueDate, searchTasks
} from "../controllers/task.controller.js";
import { Router } from "express";

const router = Router();

router.post("/project/:projectId", createTask) //Checked
router.get("/project/:projectId", getProjectTasks) //Checked
router.get("/:taskId", getSingleTask) //Checked
router.patch("/:taskId", updateTask) //Checked
router.delete("/:taskId", deleteTask) //Checked

router.post("/:taskId/assignee", assignTask) //Checked
router.patch("/:taskId/status", changeTaskStatus) //Checked
router.patch("/:taskId/priority", changeTaskPriority) //Checked
router.patch("/:taskId/due-date", setTaskDueDate) //Checked
router.get("/project/:projectId/search", searchTasks); //.............

export default router;