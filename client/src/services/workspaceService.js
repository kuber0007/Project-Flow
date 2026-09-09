import apiRequest from "./api";


/* =========================================================
   GET MY WORKSPACES
========================================================= */

const getWorkspaces = async () => {
  const result =
    await apiRequest("/workspaces");

  return result?.data ?? result;
};


/* =========================================================
   GET SINGLE WORKSPACE
========================================================= */

const getWorkspace = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}`
    );

  return result?.data ?? result;
};


/* =========================================================
   GET WORKSPACE MEMBERS
========================================================= */

const getWorkspaceMembers = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/members`
    );

  return result?.data ?? result;
};


/* =========================================================
   GET SINGLE WORKSPACE MEMBER
========================================================= */

const getWorkspaceMember = async (
  workspaceId,
  memberId
) => {
  if (!workspaceId || !memberId) {
    throw new Error(
      "Workspace ID and member ID are required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/members/${memberId}`
    );

  return result?.data ?? result;
};


/* =========================================================
   UPDATE MEMBER ROLE
========================================================= */

const updateMemberRole = async (
  workspaceId,
  memberId,
  role
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  if (!memberId) {
    throw new Error(
      "Member ID is required"
    );
  }

  if (!role) {
    throw new Error(
      "Member role is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/members/${memberId}`,
      {
        method: "PATCH",

        body: JSON.stringify({
          role,
        }),
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   REMOVE WORKSPACE MEMBER
========================================================= */

const removeWorkspaceMember = async (
  workspaceId,
  memberId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  if (!memberId) {
    throw new Error(
      "Member ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/members/${memberId}`,
      {
        method: "DELETE",
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   LEAVE WORKSPACE
========================================================= */

const leaveWorkspace = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/leave`,
      {
        method: "DELETE",
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   GET WORKSPACE INVITATIONS
========================================================= */

const getWorkspaceInvitations = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/invitations`
    );

  return result?.data ?? result;
};


/* =========================================================
   CREATE WORKSPACE INVITATION
========================================================= */

const createWorkspaceInvitation = async (
  workspaceId,
  email,
  role
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  if (!email?.trim()) {
    throw new Error(
      "Email is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/invite`,
      {
        method: "POST",

        body: JSON.stringify({
          email: email.trim(),
          role,
        }),
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   CANCEL WORKSPACE INVITATION
========================================================= */

const cancelWorkspaceInvitation = async (
  workspaceId,
  invitationId
) => {
  if (!workspaceId || !invitationId) {
    throw new Error(
      "Workspace ID and invitation ID are required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/invitations/${invitationId}`,
      {
        method: "DELETE",
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   ACCEPT WORKSPACE INVITATION
========================================================= */

const acceptWorkspaceInvitation = async (
  invitationId
) => {
  if (!invitationId) {
    throw new Error(
      "Invitation ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/workspace-invitations/${invitationId}/accept`,
      {
        method: "POST",
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   REJECT WORKSPACE INVITATION
========================================================= */

const rejectWorkspaceInvitation = async (
  invitationId
) => {
  if (!invitationId) {
    throw new Error(
      "Invitation ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/workspace-invitations/${invitationId}/reject`,
      {
        method: "POST",
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   GET WORKSPACE SETTINGS
========================================================= */

const getWorkspaceSettings = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/settings`
    );

  return result?.data ?? result;
};


/* =========================================================
   UPDATE WORKSPACE SETTINGS
========================================================= */

const updateWorkspaceSettings = async (
  workspaceId,
  data
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/settings`,
      {
        method: "PATCH",

        body: JSON.stringify(data),
      }
    );

  return result?.data ?? result;
};


/* =========================================================
   TRANSFER OWNERSHIP
========================================================= */

const transferOwnership = async (
  workspaceId,
  newOwnerId
) => {
  if (!workspaceId) {
    throw new Error(
      "Workspace ID is required"
    );
  }

  if (!newOwnerId) {
    throw new Error(
      "New owner ID is required"
    );
  }

  const result =
    await apiRequest(
      `/workspaces/${workspaceId}/transfer-ownership`,
      {
        method: "PATCH",

        body: JSON.stringify({
          newOwnerId,
        }),
      }
    );

  return result?.data ?? result;
};


export {
  getWorkspaces,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaceMember,
  updateMemberRole,
  removeWorkspaceMember,
  leaveWorkspace,
  getWorkspaceInvitations,
  createWorkspaceInvitation,
  cancelWorkspaceInvitation,
  acceptWorkspaceInvitation,
  rejectWorkspaceInvitation,
  getWorkspaceSettings,
  updateWorkspaceSettings,
  transferOwnership,
};