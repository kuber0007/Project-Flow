import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
    createWorkspace as createWorkspaceService,
    getUserWorkspaces as getUserWorkspacesService,
    getWorkspaceById,
    updateWorkspace as updateWorkspaceServices,
    deleteWorkspace as deleteWorkspaceService,
    getWorkspaceMembers as getWorkspaceMembersService,
    getWorkspaceMember as getWorkspaceMemberService,
    updateMemberRole as updateMemberRoleService,
    removeWorkspaceMember as removeWorkspaceMemberService,
    leaveWorkspace as leaveWorkspaceService,
    createWorkspaceInvite as createWorkspaceInviteService,
    getWorkspaceInvitations as getWorkspaceInvitationsService,
    cancelWorkspaceInvitation as cancelWorkspaceInvitationService,
    acceptWorkspaceInvitation as acceptWorkspaceInvitationService,
    rejectWorkspaceInvitation as rejectWorkspaceInvitationService,
    getWorkspaceSettings as getWorkspaceSettingsService,
    updateWorkspaceSettings as updateWorkspaceSettingsService,
    transferOwnership as transferOwnershipService
} from "../services/workspace.service.js";
import Workspace from "../models/workspace.model.js";

// 1. POST create workspace
const createWorkspace = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name?.trim()) {
        throw new ApiError(400, "Workspace name is required")
    }

    const workspace = await createWorkspaceService({
        name: name?.trim(),
        description: description?.trim(),
        userId: req.user._id,
    })

    return res
        .json(
            new ApiResponse(
                200,
                workspace,
                "Workspace created Successfully"
            )
        )
})

// 2. GET workspaces api
const getWorkspaces = asyncHandler(async (req, res) => {
    const workspaces = await getUserWorkspacesService(req.user._id)

    return res
        .json(
            new ApiResponse(
                200,
                workspaces,
                "Worspaces fetched Successfully"
            )
        )
})

// 3. GET workspace
const getWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params

    const result = await getWorkspaceById(
        workspaceId, req.user.id
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                "Workspace Fetched Successfully"
            )
        )
})

// 4. UPDATE workspace
const updateWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params
    const { name, description } = req.body

    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Name can't be Empty")
    }

    const workspace = await updateWorkspaceServices(workspaceId,
        req.user._id,
        {
            name: name?.trim(),
            description: description?.trim()
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                workspace,
                "Workspace updated Successfully"
            )
        )


})

// 5. DELETE workspace
const deleteWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;

    await deleteWorkspaceService(
        workspaceId,
        req.user._id
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Workspace deleted successfully"
            )
        );
});

// 6. GET all members
const getWorkspaceMembers = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params

    const members = await getWorkspaceMembersService(
        workspaceId,
        req.user._id        
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, members, "Members Fetched Successfully")
        )
})

// 7. GET Member
const getWorkspaceMember = asyncHandler(async (req, res) => {
    const { workspaceId, userId } = req.params
    const member = await getWorkspaceMemberService(workspaceId, userId, "6a7724654b6d32df48ceb3a5")

    return res
        .status(200)
        .json(new ApiResponse(
            200, member, "Member Details Fetched Successfully"
        ))

})

// 8. PATCH Member role
const updateMemberRole = asyncHandler(async (req, res) => {
    const { workspaceId, userId } = req.params;
    const { role } = req.body
    const member = await updateMemberRoleService(workspaceId, req.user._id, userId, role)

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                member,
                "Member role updated successfully"
            )
        )
})

// 9. DELETE Member
const removeWorkspaceMember = asyncHandler(async (req, res) => {
    const { workspaceId, userId } = req.params

    await removeWorkspaceMemberService(
        workspaceId,
        req.user._id,
        userId
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Member removed successfully"
            )
        )
})

// 10. Leave Workspace
const leaveWorkspace = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params

    await leaveWorkspaceService(workspaceId, req.user._id)

    return res
        .json(
            new ApiResponse(200, null, "You left the workspace successfully")
        )
})

// 11. Invite User
const createWorkspaceInvite = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    if (!email?.trim()) {
        throw new ApiError(400, "Email is required");
    }

    const invitation = await createWorkspaceInviteService(
        workspaceId,
        req.user._id,
        email,
        role
    )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                invitation,
                "Workspace invitation created successfully"
            )
        )
})

// 12. Get Invitations
const getWorkspaceInvitations = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const invitations = await getWorkspaceInvitationsService(workspaceId, req.user._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                invitations,
                "Workspace invitations fetched successfully"
            )
        );
})

// 13. cancel invitation
const cancelWorkspaceInvitation = asyncHandler(async (req, res) => {
    const { workspaceId, invitationId } = req.params;
    await cancelWorkspaceInvitationService(
        workspaceId,
        req.user._id,
        invitationId,
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Invitation cancelled successfully"
            )
        );
})

// 14. accept invitation
const acceptWorkspaceInvitation = asyncHandler(async (req, res) => {
    const { invitationId } = req.params;

    const member = await acceptWorkspaceInvitationService(
        invitationId,
        req.user._id
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                member,
                "Invitation accepted successfully"
            )
        );
});

// 15. reject invitation 
const rejectWorkspaceInvitation = asyncHandler(async (req, res) => {
    const { invitationId } = req.params;

    const invitation = await rejectWorkspaceInvitationService(
        invitationId,
        "6a86efc0cfac1a1f86ce2363"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                invitation,
                "Invitation rejected successfully"
            )
        );
})

// 16. Get Workspace Settings
const getWorkspaceSettings = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params

    const settings = await getWorkspaceSettingsService(workspaceId, req.user._id)

    return res
        .status(200)
        .json(
            new ApiResponse(200,
                settings,
                "Workspace Setting Fetched Successfully"
            )
        )
})

// 17. Update Workspace Settings 
const updateWorkspaceSettings = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params;
    const { name, description, logo } = req.body;

    if (name !== undefined && !name.trim()) {
        throw new ApiError(400, "Workspace name cannot be empty");
    }

    const workspace = await updateWorkspaceSettingsService(
        workspaceId,
        "6a7725074b6d32df48ceb3a6",
        {
            name,
            description,
            logo,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                workspace,
                "Workspace settings updated successfully"
            )
        );
})

// 18. Transfer Ownership
const transferOwnership = asyncHandler(async(req,res)=>{
    const {workspaceId} = req.params
    const { newOwnerId } = req.body;
    const workspace = transferOwnershipService(workspaceId, req.user._id, newOwnerId)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            workspace,
            "Ownership transfered Successfully"
        )
    )
})

export {
    createWorkspace,
    getWorkspaces,
    getWorkspace,
    updateWorkspace,
    deleteWorkspace,
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
};

