const API_BASE_URL = "http://localhost:8000/api";

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...(options.headers || {}),
    },
  });

  const result = await response.json();

  if (response.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  if (!response.ok) {
    throw new Error(
      result?.message || "Something went wrong"
    );
  }

  return result;
};

export const getWorkspaces = () =>
  apiRequest("/workspaces");

export const getWorkspace = (workspaceId) =>
  apiRequest(`/workspaces/${workspaceId}`);

export const getWorkspaceMembers = (workspaceId) =>
  apiRequest(`/workspaces/${workspaceId}/members`);

export const getWorkspaceInvitations = (workspaceId) =>
  apiRequest(`/workspaces/${workspaceId}/invitations`);

export const getWorkspaceProjects = (workspaceId) =>
  apiRequest(`/projects/workspace/${workspaceId}`);

export const getProjectTasks = (projectId) =>
  apiRequest(`/tasks/project/${projectId}`);

export const getNotifications = () =>
  apiRequest("/notifications");

export const getUnreadNotifications = () =>
  apiRequest("/notifications/unread");

export default apiRequest;