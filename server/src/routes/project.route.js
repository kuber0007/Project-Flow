import { Router } from "express";
import { 
    createProject,
    getWorkspacesProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    updateProjectMembers,
    searchProjects
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.use(verifyJWT);

router.post("/:workspaceId", createProject); // tested
router.get("/workspace/:workspaceId", getWorkspacesProjects); // tested
router.get("/workspace/:workspaceId/search", searchProjects); //tested
router.get("/:projectId", getSingleProject); // tested
router.patch("/:projectId", updateProject); // tested
router.delete("/:projectId", deleteProject); // tested

router.patch("/:projectId/members", updateProjectMembers); // tested


export default router;