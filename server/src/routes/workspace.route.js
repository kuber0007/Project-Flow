import express from "express"
import { createWorkspace, 
    deleteWorkspace, 
    getWorkspace, 
    getWorkspaces, 
    updateWorkspace, 
    getWorkspaceMembers, 
    getWorkspaceMember,
    updateMemberRole,
    removeWorkspaceMember,
    leaveWorkspace,
    createWorkspaceInvite,
    getWorkspaceInvitations,
    cancelWorkspaceInvitation,
    acceptWorkspaceInvitation,
    rejectWorkspaceInvitation,
    getWorkspaceSettings,
    updateWorkspaceSettings,
    transferOwnership
} from "../controllers/workspace.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router()

router.use(verifyJWT);

router.post("/",createWorkspace)//tested
router.get("/",getWorkspaces) //tested
router.get("/:workspaceId",getWorkspace) //tested
router.patch("/:workspaceId",updateWorkspace) //tested
router.delete("/:workspaceId",deleteWorkspace) //tested

router.get("/:workspaceId/members",getWorkspaceMembers) // - tested
router.get("/:workspaceId/members/:userId",getWorkspaceMember) // - tested
router.patch("/:workspaceId/members/:userId",updateMemberRole) // - tested
router.delete("/:workspaceId/members/:userId",removeWorkspaceMember) // - tested
router.delete("/:workspaceId/leave",leaveWorkspace) 

router.post("/:workspaceId/invite",createWorkspaceInvite) // - tested
router.get("/:workspaceId/invitations",getWorkspaceInvitations) // - tested
router.delete("/:workspaceId/invitations/:invitationId",cancelWorkspaceInvitation) // - tested
router.post("/workspace-invitations/:invitationId/accept",acceptWorkspaceInvitation) // - tested
router.post("/workspace-invitations/:invitationId/reject",rejectWorkspaceInvitation) // -tested

router.get("/:workspaceId/settings",getWorkspaceSettings) // - tested
router.patch("/:workspaceId/settings",updateWorkspaceSettings) // - tested
router.patch("/:workspaceId/transfer-ownership",transferOwnership)



export default router