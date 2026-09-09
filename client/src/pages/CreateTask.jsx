import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTask } from "../services/taskService";
import { getProject } from "../services/projectService";

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PROJECT
  ========================================================= */

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProject(projectId);
        setProject(data);
      } catch (err) {
        setError(
          err?.message || "Failed to load project"
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     CREATE TASK
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
      };

      if (formData.dueDate) {
        taskData.dueDate = formData.dueDate;
      }

      await createTask(projectId, taskData);

      // Go back to project details after successful creation
      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(
        err?.message || "Failed to create task"
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="create-task-page">
        <div className="create-task-container">
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR / PROJECT NOT FOUND
  ========================================================= */

  if (!project && error) {
    return (
      <div className="create-task-page">
        <div className="create-task-container">
          <div className="create-task-error">
            {error}
          </div>

          <button
            type="button"
            onClick={() => navigate("/projects")}
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="create-task-page">
      <div className="create-task-container">

        {/* Header */}
        <div className="create-task-header">
          <div>
            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate(`/projects/${projectId}`)
              }
            >
              ← Back to Project
            </button>

            <h1>Create Task</h1>

            {project && (
              <p>
                Create a new task in{" "}
                <strong>{project.name}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="create-task-error">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          className="create-task-form"
          onSubmit={handleSubmit}
        >
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              Task Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              disabled={creating}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe the task..."
              value={formData.description}
              onChange={handleChange}
              disabled={creating}
              rows={6}
            />
          </div>

          {/* Status + Priority */}
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={creating}
              >
                <option value="TODO">
                  To Do
                </option>

                <option value="IN_PROGRESS">
                  In Progress
                </option>

                <option value="IN_REVIEW">
                  In Review
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={creating}
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>
            </div>

          </div>

          {/* Due Date */}
          <div className="form-group">
            <label htmlFor="dueDate">
              Due Date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={creating}
            />
          </div>

          {/* Actions */}
          <div className="create-task-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                navigate(`/projects/${projectId}`)
              }
              disabled={creating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-task-button"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create Task"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;