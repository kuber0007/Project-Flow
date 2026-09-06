import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProject } from "../services/projectService";
import { getProjectTasks } from "../services/taskService";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [error, setError] = useState("");
    const [tasksError, setTasksError] = useState("");

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getProject(projectId);

                setProject(data);
            } catch (err) {
                console.error("Failed to load project:", err);
                setError(err.message || "Failed to load project");
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            loadProject();
        }
    }, [projectId]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setTasksLoading(true);
                setTasksError("");

                const data = await getProjectTasks(projectId);

                const taskList = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.tasks)
                        ? data.tasks
                        : Array.isArray(data?.data)
                            ? data.data
                            : [];

                setTasks(taskList);
            } catch (err) {
                console.error("Failed to load tasks:", err);
                setTasksError(err.message || "Failed to load tasks");
            } finally {
                setTasksLoading(false);
            }
        };

        if (projectId) {
            loadTasks();
        }
    }, [projectId]);

    const getStatusClass = (status) => {
        switch (status) {
            case "ACTIVE":
                return "status-active";

            case "COMPLETED":
                return "status-completed";

            case "NOT_STARTED":
                return "status-not-started";

            default:
                return "";
        }
    };

    const getTaskStatusClass = (status) => {
        switch (status) {
            case "TODO":
                return "task-status-todo";

            case "IN_PROGRESS":
                return "task-status-progress";

            case "REVIEW":
                return "task-status-review";

            case "DONE":
                return "task-status-done";

            default:
                return "";
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "LOW":
                return "task-priority-low";

            case "MEDIUM":
                return "task-priority-medium";

            case "HIGH":
                return "task-priority-high";

            case "URGENT":
                return "task-priority-urgent";

            default:
                return "";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";

        return status
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

    const getTaskTitle = (task) => {
        return task?.title || task?.name || "Untitled Task";
    };

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task?.status === "DONE"
    ).length;

    const progressPercentage =
        totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

    if (loading) {
        return (
            <div className="project-details-loading">
                <div className="project-details-loader"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-details-error-page">
                <div className="project-details-error-card">
                    <h2>Unable to load project</h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                        className="project-details-back-button"
                    >
                        ← Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-details-error-page">
                <div className="project-details-error-card">
                    <h2>Project not found</h2>

                    <p>
                        The project you're looking for does not exist.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                        className="project-details-back-button"
                    >
                        ← Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-details-page">

            {/* =========================
          SIDEBAR
      ========================= */}

            <aside className="project-details-sidebar">

                <div className="project-details-logo">

                    <div className="project-details-logo-icon">
                        P
                    </div>

                    <span>ProjectFlow</span>

                </div>

                <nav className="project-details-nav">

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>

                    <button
                        type="button"
                        className="active"
                        onClick={() => navigate("/projects")}
                    >
                        <span>▣</span>
                        Projects
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/team")}
                    >
                        <span>♙</span>
                        Team
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/tasks")}
                    >
                        <span>✓</span>
                        Tasks
                    </button>

                </nav>

                <div className="project-details-sidebar-bottom">

                    <button type="button">
                        <span>⚙</span>
                        Settings
                    </button>

                </div>

            </aside>

            {/* =========================
          MAIN
      ========================= */}

            <main className="project-details-main">

                {/* Topbar */}

                <header className="project-details-topbar">

                    <button
                        type="button"
                        onClick={() => navigate("/projects")}
                        className="project-details-back-link"
                    >
                        ← Projects
                    </button>

                    <div className="project-details-user">

                        <div className="project-details-avatar">
                            U
                        </div>

                        <span>User</span>

                    </div>

                </header>

                {/* Content */}

                <section className="project-details-content">

                    {/* =========================
              PROJECT HEADER
          ========================= */}

                    <div className="project-details-header">

                        <div>

                            <div className="project-details-breadcrumb">
                                Projects / {project.name}
                            </div>

                            <h1>{project.name}</h1>

                            <p>
                                {project.description ||
                                    "No description has been added to this project yet."}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={() => navigate("/projects")}
                            className="project-details-header-button"
                        >
                            ← Back
                        </button>

                    </div>

                    {/* =========================
              PROJECT SUMMARY
          ========================= */}

                    <div className="project-details-grid">

                        <div className="project-details-card">

                            <div className="project-details-card-title">
                                Project Status
                            </div>

                            <div className="project-details-status-wrapper">

                                <span
                                    className={`project-details-status ${getStatusClass(
                                        project.status
                                    )}`}
                                >
                                    {formatStatus(project.status)}
                                </span>

                            </div>

                        </div>

                        <div className="project-details-card">

                            <div className="project-details-card-title">
                                Total Tasks
                            </div>

                            <div className="project-details-card-value">
                                {totalTasks}
                            </div>

                        </div>

                        <div className="project-details-card">

                            <div className="project-details-card-title">
                                Completion
                            </div>

                            <div className="project-details-card-value">
                                {progressPercentage}%
                            </div>

                        </div>

                    </div>

                    {/* =========================
              PROJECT OVERVIEW
          ========================= */}

                    <div className="project-details-section">

                        <div className="project-details-section-header">

                            <div>

                                <h2>Project Overview</h2>

                                <p>
                                    Details and information about this project.
                                </p>

                            </div>

                        </div>

                        <div className="project-details-overview">

                            <div className="project-details-overview-item">

                                <span>Project Name</span>

                                <strong>
                                    {project.name}
                                </strong>

                            </div>

                            <div className="project-details-overview-item">

                                <span>Status</span>

                                <strong>
                                    {formatStatus(project.status)}
                                </strong>

                            </div>

                            <div className="project-details-overview-item">

                                <span>Created On</span>

                                <strong>
                                    {formatDate(project.createdAt)}
                                </strong>

                            </div>

                            <div className="project-details-overview-item">

                                <span>Last Updated</span>

                                <strong>
                                    {formatDate(project.updatedAt)}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* =========================
              TASKS
          ========================= */}

                    <div className="project-details-section">

                        <div className="project-details-section-header">

                            <div>

                                <h2>Tasks</h2>

                                <p>
                                    Tasks belonging to this project.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="project-details-primary-button"
                                onClick={() =>
                                    navigate(`/projects/${projectId}/tasks/new`)
                                }
                            >
                                + Add Task
                            </button>

                        </div>

                        {/* Task loading */}

                        {tasksLoading && (

                            <div className="project-details-task-message">
                                <div className="project-details-loader"></div>
                                <p>Loading tasks...</p>
                            </div>

                        )}

                        {/* Task error */}

                        {!tasksLoading && tasksError && (

                            <div className="project-details-task-error">
                                <p>{tasksError}</p>
                            </div>

                        )}

                        {/* No tasks */}

                        {!tasksLoading &&
                            !tasksError &&
                            tasks.length === 0 && (

                                <div className="project-details-empty">

                                    <div className="project-details-empty-icon">
                                        ✓
                                    </div>

                                    <h3>No tasks yet</h3>

                                    <p>
                                        Start adding tasks to manage the work
                                        for this project.
                                    </p>

                                </div>

                            )}

                        {/* Tasks */}

                        {!tasksLoading &&
                            !tasksError &&
                            tasks.length > 0 && (

                                <div className="project-details-task-list">

                                    {tasks.map((task) => (

                                        <div
                                            key={task._id}
                                            className="project-details-task"
                                        >

                                            <div className="project-details-task-info">

                                                <h3>
                                                    {getTaskTitle(task)}
                                                </h3>

                                                {task.description && (

                                                    <p>
                                                        {task.description}
                                                    </p>

                                                )}

                                            </div>

                                            <div className="project-details-task-meta">

                                                <span
                                                    className={`project-details-task-status ${getTaskStatusClass(
                                                        task.status
                                                    )}`}
                                                >
                                                    {formatStatus(task.status)}
                                                </span>

                                                <span
                                                    className={`project-details-task-priority ${getPriorityClass(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {formatStatus(task.priority)}
                                                </span>

                                                {task.dueDate && (

                                                    <span className="project-details-task-date">
                                                        Due: {formatDate(task.dueDate)}
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                    </div>

                    {/* =========================
              PROJECT MEMBERS
          ========================= */}

                    <div className="project-details-section">

                        <div className="project-details-section-header">

                            <div>

                                <h2>Project Members</h2>

                                <p>
                                    Members assigned to this project.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="project-details-secondary-button"
                            >
                                Manage Members
                            </button>

                        </div>

                        <div className="project-details-empty">

                            <div className="project-details-empty-icon">
                                ♙
                            </div>

                            <h3>Project members</h3>

                            <p>
                                Member management will be connected next.
                            </p>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default ProjectDetails;