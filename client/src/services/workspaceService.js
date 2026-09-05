import apiRequest from "./api";


/* ================= GET MY WORKSPACES ================= */

const getWorkspaces = async () => {
  const result = await apiRequest("/workspaces");

  return result?.data ?? result;
};


/* ================= GET SINGLE WORKSPACE ================= */

const getWorkspace = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const result = await apiRequest(
    `/workspaces/${workspaceId}`
  );

  return result?.data ?? result;
};


/* ================= GET WORKSPACE MEMBERS ================= */

const getWorkspaceMembers = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const result = await apiRequest(
    `/workspaces/${workspaceId}/members`
  );

  return result?.data ?? result;
};


/* ================= GET WORKSPACE MEMBER ================= */

const getWorkspaceMember = async (
  workspaceId,
  memberId
) => {
  if (!workspaceId || !memberId) {
    throw new Error(
      "Workspace ID and member ID are required"
    );
  }

  const result = await apiRequest(
    `/workspaces/${workspaceId}/members/${memberId}`
  );

  return result?.data ?? result;
};


/* ================= GET WORKSPACE INVITATIONS ================= */

const getWorkspaceInvitations = async (
  workspaceId
) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const result = await apiRequest(
    `/workspaces/${workspaceId}/invitations`
  );

  return result?.data ?? result;
};


export {
  getWorkspaces,
  getWorkspace,
  getWorkspaceMembers,
  getWorkspaceMember,
  getWorkspaceInvitations,
};