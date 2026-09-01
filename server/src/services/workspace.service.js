import Workspace from "../models/workspace.model.js"
import WorkspaceMember from "../models/workspaceMember.model.js"
import WorkspaceInvitation from "../models/workspaceInvitation.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import User from "../models/user.model.js"

//1.api ========== POST /api/workspaces
const createWorkspace = async ({ name, description, userId }) => {
    const workspace = await Workspace.create({
        name,
        description,
        owner: userId
    });

    await WorkspaceMember.create({
        workspace: workspace._id,
        user: userId,
        role: "OWNER"
    });

    return workspace
}

// 2. api ========= GET /api/workspaces
const getUserWorkspaces = async (userId) => {
    const memberships = await WorkspaceMember.find({ user: userId })
        .populate("workspace")
        .sort({ createdAt: -1 })

    return memberships
}

// 3. api ========= GET /api/workspaces/:workspaceId
const getWorkspaceById = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })
    if (!membership) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    const workspace = await Workspace.findById(workspaceId)

    if (!workspace) {
        throw new ApiError(400, "Workspace not found")
    }

    return {
        workspace,
        role: membership.role
    }
}

// 4. api ==========PATCH /api/workspaces/:workspaceId
const updateWorkspace = async (workspaceId, userId, { name, description }) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })
    if (!membership) {
        throw new ApiError(403, "You don't have access to this Workspace")
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
        throw new ApiError(403, "Only OWNER or ADMIN can update the workspace!")
    }

    const workspace = await Workspace.findByIdAndUpdate(
        workspaceId,
        {
            ...(name !== undefined && { name }),
            ...(description !== undefined && { description })
        },
        {
            new: true,
            runValidators: true
        }
    )
    if (!workspace) {
        throw new ApiError(400, "Workspace not Found")
    }

    return workspace;
}

// 5. api =========== DELETE /api/workspaces/:workspaceId
const deleteWorkspace = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })

    if (!membership) {
        throw new ApiError(
            403,
            "You do not have access to this workspace"
        )
    }

    if (membership.role !== "OWNER") {
        throw new ApiError(
            403,
            "Only the workspace owner can delete the workspace"
        );
    }

    const workspace = await Workspace.findByIdAndDelete(workspaceId);

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    return workspace;
}

// 6. api ============ GET /api/workspaces/:workspaceId/members
const getWorkspaceMembers = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId,
    });

    if (!membership) {
        throw new ApiError(403, "You do not have access to this workspace");
    }

    const members = await WorkspaceMember.find({
        workspace: workspaceId,
    })
        .populate("user", "name email avatar")
        .sort({ createdAt: 1 });

    return members;
}

// 7. api ============= GET /api/workspaces/:workspaceId/members/:userId
const getWorkspaceMember = async (workspaceId, userId, requestorId) => {
    const requester = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requestorId
    })

    if (!requester) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    const member = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    }).populate(
        "user", "name email,avatar"
    )

    if (!member) {
        throw new ApiError(400, "Workspace member not found")
    }

    return member;
}

// 8. api ============= PATCH /api/workspaces/:workspaceId/members/:userId
const updateMemberRole = async (workspaceId, userId, requestorId, role) => {
    const requester = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requestorId
    })

    if (!requester) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(requester.role)) {
        throw new ApiError(403, "You cannot change member roles")
    }

    if (!["ADMIN", "MEMBER", "VIEWER"].includes(role)) {
        throw new ApiError(400, "Invalid member role");
    }
    const member = await WorkspaceMember.findOneAndUpdate({
        workspace: workspaceId,
        user: userId
    },
        { role },
        {
            new: true,
            runValidators: true,
        }
    ).populate("user", "name email avatar");

    if (!member) {
        throw new ApiError(404, "Workspace member not found");
    }

    return member;
}

// 9. api ============= DELETE /api/workspaces/:workspaceId/members/:userId
const removeWorkspaceMember = async (workspaceId, userId, requestorId) => {
    const requester = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requestorId
    })

    if (!requester) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER","ADMIN"].includes(requester.role)) {
        throw new ApiError(403, "You cannot change member roles")
    }

    const member = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })

    if (!member) {
        throw new ApiError(404, "Member not Found")
    }

    if (member.role === "OWNER") {
        throw new ApiError(403, "Member not Found")
    }

    if (
        requester.role === "ADMIN" &&
        member.role === "ADMIN"
    ) {
        throw new ApiError(
            403,
            "Admin cannot remove another admin"
        );
    }

    await WorkspaceMember.deleteOne({
        _id: member._id,
    });

    return member;
}

// 10. api ============ POST /api/workspaces/:workspaceId/leave
const leaveWorkspace = async (workspaceId, userId) => {
    const member = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })

    if (!member) {
        throw new ApiError(404, "You are not member of this Workspace")
    }

    if (member.role === "OWNER") {
        throw new ApiError(400, "Owner cannot leave the workspace. Transfer ownership first.")
    }

    await WorkspaceMember.deleteOne({
        _id: member._id,
    })
}

// 11. api ============= POST /api/workspaces/:workspaceId/invitations
const createWorkspaceInvite = async (workspaceId, requestorId, email, role) => {

    //workspace of user with the user data / requestor
    const requestor = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requestorId
    })

    if (!requestor) {
        throw new ApiError(403, "You do not have access to this workspace");
    }

    //dont allow to invite if not owner or admin
    if (!["OWNER", "ADMIN"].includes(requestor.role)) {
        throw new ApiError(403, "You cannot invite members");
    }

    if (!["ADMIN", "MEMBER", "VIEWER"].includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    //it should not exist already
    const existingMembersWorkspace = await WorkspaceMember.findOne({
        workspace: workspaceId,
    }).populate({
        path: "user",
        match: { email: email.toLowerCase() },
    });

    if (existingMembersWorkspace?.user) {
        throw new ApiError(400, "This user exists already");
    }

    //check if already sent a invite
    const existingInvitation = await WorkspaceInvitation.findOne({
        workspace: workspaceId,
        email: email.toLowerCase(),
        status: "PENDING",
    });

    if (existingInvitation) {
        throw new ApiError(409, "Invitation already exists");
    }

    //send an invite
    const invitation = await WorkspaceInvitation.create({
        workspace: workspaceId,
        email: email.toLowerCase(),
        role,
        invitedBy: requestorId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return invitation;
}

// 12. api ============= GET /api/workspaces/:workspaceId/invitations
const getWorkspaceInvitations = async (workspaceId, requesterId) => {
    const requester = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requesterId
    });
    if (!requester) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(requester.role)) {
        throw new ApiError(403, "You don't have permission to see this page")
    }

    const invitations = await WorkspaceInvitation.find({
        workspace: workspaceId,
        status: "PENDING"
    })
        .populate("invitedBy", "name email")
        .sort({ createdAt: -1 });

    return invitations;
}

// 13. api ============= DELETE /api/workspaces/:workspaceId/invitations/:invitationId
const cancelWorkspaceInvitation = async (workspaceId, requestorId, invitationId) => {
    const requestor = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: requestorId
    })
    if (!requestor) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(requestor.role)) {
        throw new ApiError(403, "You cannot cancel invitations");
    }

    const invitation = await WorkspaceInvitation.findOne({
        _id: invitationId,
        workspace: workspaceId,
        status: "PENDING",
    });

    if (!invitation) {
        throw new ApiError(404, "Pending invitation not found");
    }

    await WorkspaceInvitation.deleteOne({
        _id: invitation._id,
    });

    return invitation;
}

// 14. api ============= POST /api/workspace-invitations/:invitationId/accept
const acceptWorkspaceInvitation = async (invitationId, userId) => {
    //1. Find the invitation
    const invitation = await WorkspaceInvitation.findOne({
        _id: invitationId,
        status: "PENDING",
    });

    // 2. Pending Invitation exists?
    if (!invitation) {
        throw new ApiError(404, "Pending invitation not found");
    }

    // 3. Checks if it is expired or not?
    if (invitation.expiresAt < new Date()) {
        invitation.status = "EXPIRED";
        await invitation.save();

        throw new ApiError(400, "Invitation has expired");
    }

    // 4.check and store the user
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 5. check if the invitation is sent to this mail or not?
    if (user.email !== invitation.email) {
        throw new ApiError(
            403,
            "This invitation is not for your email"
        );
    }

    // 6. Check if he is not already member of workspace
    const existingMember = await WorkspaceMember.findOne({
        workspace: invitation.workspace,
        user: userId,
    });

    if (existingMember) {
        throw new ApiError(409, "You are already a workspace member");
    }

    // 7. make it member
    const member = await WorkspaceMember.create({
        workspace: invitation.workspace,
        user: userId,
        role: invitation.role,
    });

    invitation.status = "ACCEPTED";
    await invitation.save();

    return member;
}

// 15. api ============= POST /api/workspace/workspace-invitations/:invitationId/reject
const rejectWorkspaceInvitation = async (invitationId, userId) => {
    const invitation = await WorkspaceInvitation.findOne({
        _id: invitationId,
        status: "PENDING",
    });

    if (!invitation) {
        throw new ApiError(404, "Pending invitation not found");
    }

    if (invitation.expiresAt < new Date()) {
        invitation.status = "EXPIRED";
        await invitation.save();

        throw new ApiError(400, "Invitation has expired");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.email !== invitation.email) {
        throw new ApiError(
            403,
            "This invitation is not for your email"
        );
    }

    invitation.status = "REJECTED";
    await invitation.save();

    return invitation;
};

// 16. api ============= GET WORKSPACE_ID/settings
const getWorkspaceSettings = async (workspaceId, userId) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })

    if (!membership) {
        throw new ApiError(400, "You do not have access to this workspace")
    }

    const workspace = await Workspace.findById(workspaceId).select("name description logo owner")

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    return workspace
}

// 17. api ============= PATCH workspace_ID/settings
const updateWorkspaceSettings = async (workspaceId, userId, { name, description, logo }) => {
    const membership = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId,
    });

    if (!membership) {
        throw new ApiError(
            403,
            "You do not have access to this workspace"
        );
    }

    if (!["OWNER", "ADMIN"].includes(membership.role)) {
        throw new ApiError(
            403,
            "Only OWNER or ADMIN can update settings"
        );
    }

    const workspace = await Workspace.findByIdAndUpdate(
        workspaceId,
        {
            ...(name !== undefined && { name: name.trim() }),
            ...(description !== undefined && {
                description: description.trim(),
            }),
            ...(logo !== undefined && { logo }),
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!workspace) {
        throw new ApiError(404, "Workspace not found");
    }

    return workspace;
};

// 18. api ============= PATCH :workspaceId/transfer-ownership
const transferOwnership = async (workspaceId, currentOwnerId, newOwnerId) => {

    const currentOwner = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: currentOwnerId,
        role: "OWNER"
    });

    if (!currentOwner) {
        throw new ApiError(
            403,
            "Only the workspace owner can transfer ownership"
        );
    }

    const newOwner = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: newOwnerId
    });

    if (!newOwner) {
        throw new ApiError(
            404,
            "New owner must be a workspace member"
        );
    }

    if (
        currentOwnerId.toString() ===
        newOwnerId.toString()
    ) {
        throw new ApiError(
            400,
            "You are already the workspace owner"
        );
    }

    currentOwner.role = "ADMIN";
    newOwner.role = "OWNER";

    await currentOwner.save();
    await newOwner.save();

    const workspace =
        await Workspace.findByIdAndUpdate(
            workspaceId,
            { owner: newOwnerId },
            { new: true, runValidators: true }
        );

    return workspace;
};

export {
    createWorkspace,
    getUserWorkspaces,
    getWorkspaceById,
    updateWorkspace,
    deleteWorkspace,
    //5
    getWorkspaceMembers,
    getWorkspaceMember,
    updateMemberRole,
    removeWorkspaceMember,
    leaveWorkspace,
    //10
    createWorkspaceInvite,
    getWorkspaceInvitations,
    cancelWorkspaceInvitation,
    acceptWorkspaceInvitation,
    rejectWorkspaceInvitation,
    //15
    getWorkspaceSettings,
    updateWorkspaceSettings,
    transferOwnership
}