import { Router } from "express";

import {
    createProject,
    getWorkspacesProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    updateProjectMembers,
    searchProjects
} from "../controllers/project.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();


router.use(verifyJWT);


/* ================= PROJECT CREATION ================= */

router.post(
    "/:workspaceId",
    createProject
);


/* ================= WORKSPACE PROJECTS ================= */

router.get(
    "/workspace/:workspaceId",
    getWorkspacesProjects
);


/* ================= PROJECT SEARCH ================= */

router.get(
    "/workspace/:workspaceId/search",
    searchProjects
);


/* ================= PROJECT MEMBERS ================= */

/*
   IMPORTANT:
   This must come BEFORE /:projectId
   so "members" is treated as a route,
   not as a project ID.
*/

router.get(
    "/:projectId/members",
    getProjectMembers
);

router.patch(
    "/:projectId/members",
    updateProjectMembers
);


/* ================= SINGLE PROJECT ================= */

router.get(
    "/:projectId",
    getSingleProject
);


/* ================= UPDATE PROJECT ================= */

router.patch(
    "/:projectId",
    updateProject
);


/* ================= DELETE PROJECT ================= */

router.delete(
    "/:projectId",
    deleteProject
);


export default router;