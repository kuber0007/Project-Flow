import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
  changeTaskPriority,
  setTaskDueDate,
} from "../services/taskService";

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const loadTask = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTask(taskId);

      setTask(data);

      setFormData({
        title: data?.title || data?.name || "",
        description: data?.description || "",
      });
    } catch (err) {
      console.error("Failed to load task:", err);
      setError(err.message || "Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const getProjectId = () => {
    if (!task?.project) return null;

    if (typeof task.project === "string") {
      return task.project;
    }

    return task.project?._id;
  };

  const formatValue = (value) => {
    if (!value) return "Not available";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDateInputValue = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().split("T")[0];
  };

  const showSuccess = (message) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const result = await updateTask(taskId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
      });

      const updatedTask =
        result?.data || result || task;

      setTask((previous) => ({
        ...previous,
        ...updatedTask,
        title:
          updatedTask?.title ||
          formData.title.trim(),
        description:
          updatedTask?.description ||
          formData.description.trim(),
      }));

      setEditing(false);
      showSuccess("Task updated successfully");
    } catch (err) {
      console.error("Failed to update task:", err);
      setError(err.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (event) => {
    const status = event.target.value;

    try {
      setSaving(true);
      setError("");

      await changeTaskStatus(taskId, status);

      setTask((previous) => ({
        ...previous,
        status,
      }));

      showSuccess("Status updated");
    } catch (err) {
      console.error("Failed to change status:", err);
      setError(err.message || "Failed to change status");
    } finally {
      setSaving(false);
    }
  };

  const handlePriorityChange = async (event) => {
    const priority = event.target.value;

    try {
      setSaving(true);
      setError("");

      await changeTaskPriority(taskId, priority);

      setTask((previous) => ({
        ...previous,
        priority,
      }));

      showSuccess("Priority updated");
    } catch (err) {
      console.error("Failed to change priority:", err);
      setError(err.message || "Failed to change priority");
    } finally {
      setSaving(false);
    }
  };

  const handleDueDateChange = async (event) => {
    const dueDate = event.target.value || null;

    try {
      setSaving(true);
      setError("");

      await setTaskDueDate(taskId, dueDate);

      setTask((previous) => ({
        ...previous,
        dueDate,
      }));

      showSuccess("Due date updated");
    } catch (err) {
      console.error("Failed to change due date:", err);
      setError(err.message || "Failed to change due date");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await deleteTask(taskId);

      const projectId = getProjectId();

      if (projectId) {
        navigate(`/projects/${projectId}`);
      } else {
        navigate("/projects");
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError(err.message || "Failed to delete task");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="task-details-loading">
        <div className="task-details-loader"></div>
        <p>Loading task...</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="task-details-error-page">
        <div className="task-details-error-card">
          <h2>Unable to load task</h2>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => navigate("/projects")}
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="task-details-error-page">
        <div className="task-details-error-card">
          <h2>Task not found</h2>

          <button
            type="button"
            onClick={() => navigate("/projects")}
          >
            ← Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const projectId = getProjectId();

  return (
    <div className="task-details-page">

      <main className="task-details-main">

        <button
          type="button"
          className="task-details-back"
          onClick={() =>
            projectId
              ? navigate(`/projects/${projectId}`)
              : navigate("/projects")
          }
        >
          ← Back to Project
        </button>

        {success && (
          <div className="task-details-success">
            {success}
          </div>
        )}

        {error && (
          <div className="task-details-inline-error">
            {error}
          </div>
        )}

        {/* Header */}

        <div className="task-details-header">

          <div>

            <span className="task-details-label">
              TASK DETAILS
            </span>

            {editing ? (
              <input
                className="task-details-title-input"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                disabled={saving}
              />
            ) : (
              <h1>
                {task.title ||
                  task.name ||
                  "Untitled Task"}
              </h1>
            )}

            {editing ? (
              <textarea
                className="task-details-description-input"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="4"
                disabled={saving}
              />
            ) : (
              <p>
                {task.description ||
                  "No description has been added to this task."}
              </p>
            )}

          </div>

        </div>

        {/* Summary */}

        <div className="task-details-grid">

          <div className="task-details-card">

            <span>Status</span>

            <select
              value={task.status || "TODO"}
              onChange={handleStatusChange}
              disabled={saving}
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="REVIEW">Review</option>
              <option value="DONE">Done</option>
            </select>

          </div>

          <div className="task-details-card">

            <span>Priority</span>

            <select
              value={task.priority || "MEDIUM"}
              onChange={handlePriorityChange}
              disabled={saving}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>

          </div>

          <div className="task-details-card">

            <span>Due Date</span>

            <input
              type="date"
              value={getDateInputValue(task.dueDate)}
              onChange={handleDueDateChange}
              disabled={saving}
            />

          </div>

        </div>

        {/* Information */}

        <section className="task-details-section">

          <div className="task-details-section-header">
            <h2>Task Information</h2>
          </div>

          <div className="task-details-information">

            <div>
              <span>Task ID</span>
              <strong>{task._id}</strong>
            </div>

            <div>
              <span>Status</span>
              <strong>
                {formatValue(task.status)}
              </strong>
            </div>

            <div>
              <span>Priority</span>
              <strong>
                {formatValue(task.priority)}
              </strong>
            </div>

            <div>
              <span>Due Date</span>
              <strong>
                {formatDate(task.dueDate)}
              </strong>
            </div>

            <div>
              <span>Created</span>
              <strong>
                {formatDate(task.createdAt)}
              </strong>
            </div>

            <div>
              <span>Updated</span>
              <strong>
                {formatDate(task.updatedAt)}
              </strong>
            </div>

          </div>

        </section>

        {/* Assignee */}

        <section className="task-details-section">

          <div className="task-details-section-header">
            <h2>Assignee</h2>
          </div>

          <div className="task-details-assignee">

            {task.assignee ? (
              <>
                <div className="task-details-avatar">
                  {(task.assignee.name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {task.assignee.name ||
                      task.assignee.email ||
                      "Assigned User"}
                  </strong>

                  {task.assignee.email && (
                    <p>{task.assignee.email}</p>
                  )}
                </div>
              </>
            ) : (
              <p>No user assigned to this task.</p>
            )}

          </div>

        </section>

        {/* Actions */}

        <div className="task-details-actions">

          {editing ? (
            <>
              <button
                type="button"
                className="task-details-edit-button"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                className="task-details-cancel-button"
                onClick={() => {
                  setEditing(false);

                  setFormData({
                    title:
                      task.title ||
                      task.name ||
                      "",
                    description:
                      task.description || "",
                  });

                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              className="task-details-edit-button"
              onClick={() => setEditing(true)}
            >
              Edit Task
            </button>
          )}

          <button
            type="button"
            className="task-details-delete-button"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete Task"}
          </button>

        </div>

      </main>

    </div>
  );
};

export default TaskDetails;