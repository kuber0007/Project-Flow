import apiRequest from "./api";


/* ================= CREATE TASK ================= */

const createTask = async (
  projectId,
  taskData
) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(
    `/tasks/project/${projectId}`,
    {
      method: "POST",
      body: JSON.stringify(taskData),
    }
  );

  return result?.data ?? result;
};


/* ================= GET PROJECT TASKS ================= */

const getProjectTasks = async (projectId) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const result = await apiRequest(
    `/tasks/project/${projectId}`
  );

  return result?.data ?? result;
};


/* ================= GET SINGLE TASK ================= */

const getTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}`
  );

  return result?.data ?? result;
};


/* ================= UPDATE TASK ================= */

const updateTask = async (
  taskId,
  taskData
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}`,
    {
      method: "PATCH",
      body: JSON.stringify(taskData),
    }
  );

  return result?.data ?? result;
};


/* ================= DELETE TASK ================= */

const deleteTask = async (taskId) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );

  return result?.data ?? result;
};


/* ================= ASSIGN TASK ================= */

const assignTask = async (
  taskId,
  assigneeId
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  if (!assigneeId) {
    throw new Error("Assignee ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}/assignee`,
    {
      method: "PATCH",
      body: JSON.stringify({
        assigneeId,
      }),
    }
  );

  return result?.data ?? result;
};


/* ================= CHANGE STATUS ================= */

const changeTaskStatus = async (
  taskId,
  status
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status,
      }),
    }
  );

  return result?.data ?? result;
};


/* ================= CHANGE PRIORITY ================= */

const changeTaskPriority = async (
  taskId,
  priority
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}/priority`,
    {
      method: "PATCH",
      body: JSON.stringify({
        priority,
      }),
    }
  );

  return result?.data ?? result;
};


/* ================= SET DUE DATE ================= */

const setTaskDueDate = async (
  taskId,
  dueDate
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/tasks/${taskId}/due-date`,
    {
      method: "PATCH",
      body: JSON.stringify({
        dueDate,
      }),
    }
  );

  return result?.data ?? result;
};


/* ================= SEARCH / FILTER TASKS ================= */

const searchTasks = async (
  projectId,
  filters = {}
) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const params = new URLSearchParams();

  if (filters.search) {
    params.append("search", filters.search);
  }

  if (filters.status) {
    params.append("status", filters.status);
  }

  if (filters.priority) {
    params.append("priority", filters.priority);
  }

  if (filters.assignee) {
    params.append("assignee", filters.assignee);
  }

  const queryString = params.toString();

  const endpoint =
    `/tasks/project/${projectId}/search` +
    (queryString ? `?${queryString}` : "");

  const result = await apiRequest(endpoint);

  return result?.data ?? result;
};


export {
  createTask,
  getProjectTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTask,
  changeTaskStatus,
  changeTaskPriority,
  setTaskDueDate,
  searchTasks,
};