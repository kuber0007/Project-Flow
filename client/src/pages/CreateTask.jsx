import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createTask } from "../services/taskService";

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "TODO",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear validation error when user starts typing
    if (name === "title" && value.trim()) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = formData.title.trim();

    if (!title) {
      setError("Task title is required");
      return;
    }

    if (!projectId) {
      setError("Project ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createTask(
        projectId,
        {
          title,
          description: formData.description.trim(),
          priority: formData.priority,
          status: formData.status,
          dueDate: formData.dueDate || null,
        }
      );

      navigate(`/projects/${projectId}`);
    } catch (err) {
      console.error("Failed to create task:", err);

      setError(
        err.message || "Failed to create task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-page">

      <main className="create-task-main">

        <div className="create-task-content">

          <button
            type="button"
            className="create-task-back"
            onClick={() =>
              navigate(`/projects/${projectId}`)
            }
            disabled={loading}
          >
            ← Back to Project
          </button>

          <div className="create-task-header">

            <h1>Create Task</h1>

            <p>
              Add a new task to this project.
            </p>

          </div>

          <form
            className="create-task-form"
            onSubmit={handleSubmit}
          >

            {error && (
              <div className="create-task-error">
                {error}
              </div>
            )}

            {/* Task Title */}

            <div className="create-task-field">

              <label htmlFor="title">
                Task Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter task title"
                disabled={loading}
                autoFocus
              />

            </div>

            {/* Description */}

            <div className="create-task-field">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the task..."
                rows="5"
                disabled={loading}
              />

            </div>

            {/* Status + Priority */}

            <div className="create-task-row">

              <div className="create-task-field">

                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={loading}
                >

                  <option value="TODO">
                    To Do
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="REVIEW">
                    Review
                  </option>

                  <option value="DONE">
                    Done
                  </option>

                </select>

              </div>

              <div className="create-task-field">

                <label htmlFor="priority">
                  Priority
                </label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={loading}
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

            <div className="create-task-field">

              <label htmlFor="dueDate">
                Due Date
              </label>

              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                disabled={loading}
              />

            </div>

            {/* Actions */}

            <div className="create-task-actions">

              <button
                type="button"
                className="create-task-cancel"
                onClick={() =>
                  navigate(`/projects/${projectId}`)
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="create-task-submit"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Task"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
};

export default CreateTask;