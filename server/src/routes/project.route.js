import { Router } from "express";
import { 
    createProject,
    getWorkspacesProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    updateProjectMembers
} from "../controllers/project.controller.js";

const router = Router()

router.post("/:workspaceId", createProject); // tested
router.get("/workspace/:workspaceId", getWorkspacesProjects); // tested
router.get("/:projectId", getSingleProject); // tested
router.patch("/:projectId", updateProject); // tested
router.delete("/:projectId", deleteProject); // tested

router.patch("/:projectId/members", updateProjectMembers); // tested


export default router;