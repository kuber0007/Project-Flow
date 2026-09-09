import apiRequest from "./api";

/* =========================================================
   CREATE PROJECT
========================================================= */

const createProject = async ({
  workspaceId,
  name,
  description = "",
  status = "NOT_STARTED",
}) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  if (!name?.trim()) {
    throw new Error("Project name is required");
  }

  const result = await apiRequest(`/projects/${workspaceId}`, {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      status,
    }),
  });

  return result?.data ?? result;
};

/* =========================================================
   GET WORKSPACE PROJECTS
========================================================= */

const getWorkspaceProjects = async (workspaceId) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const result = await apiRequest(
    `/projects/workspace/${workspaceId}`
  );

  return result?.data ?? result;
};

/* =========================================================
   GET SINGLE PROJECT
========================================================= */

const getProject = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(`/projects/${projectId}`);

  return result?.data ?? result;
};

/* =========================================================
   GET PROJECT MEMBERS
========================================================= */

const getProjectMembers = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(
    `/projects/${projectId}/members`
  );

  return result?.data ?? result;
};

/* =========================================================
   SEARCH / FILTER PROJECTS
========================================================= */

const searchProjects = async (
  workspaceId,
  {
    search = "",
    status = "",
    createdBy = "",
  } = {}
) => {
  if (!workspaceId) {
    throw new Error("Workspace ID is required");
  }

  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  if (createdBy) {
    params.set("createdBy", createdBy);
  }

  const queryString = params.toString();

  const endpoint =
    `/projects/workspace/${workspaceId}/search` +
    (queryString ? `?${queryString}` : "");

  const result = await apiRequest(endpoint);

  return result?.data ?? result;
};

/* =========================================================
   UPDATE PROJECT
========================================================= */

const updateProject = async (projectId, data) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(`/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

  return result?.data ?? result;
};

/* =========================================================
   DELETE PROJECT
========================================================= */

const deleteProject = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
  });

  return result?.data ?? result;
};

/* =========================================================
   UPDATE PROJECT MEMBERS
========================================================= */

const updateProjectMembers = async (projectId, members) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(
    `/projects/${projectId}/members`,
    {
      method: "PATCH",
      body: JSON.stringify({
        members,
      }),
    }
  );

  return result?.data ?? result;
};

export {
  createProject,
  getWorkspaceProjects,
  getProject,
  getProjectMembers,
  searchProjects,
  updateProject,
  deleteProject,
  updateProjectMembers,
};