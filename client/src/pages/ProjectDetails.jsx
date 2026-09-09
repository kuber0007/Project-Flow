import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProject,
    getProjectMembers,
    updateProjectMembers,
} from "../services/projectService";

import { getProjectTasks } from "../services/taskService";
import { getWorkspaceMembers } from "../services/workspaceService";

import "../styles/projectMembers.css";


const ProjectDetails = () => {

    const { projectId } = useParams();
    const navigate = useNavigate();


    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);

    const [projectMembers, setProjectMembers] =
        useState([]);

    const [workspaceMembers, setWorkspaceMembers] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [tasksLoading, setTasksLoading] =
        useState(true);

    const [membersLoading, setMembersLoading] =
        useState(false);

    const [savingMembers, setSavingMembers] =
        useState(false);


    const [error, setError] =
        useState("");

    const [tasksError, setTasksError] =
        useState("");

    const [membersError, setMembersError] =
        useState("");


    const [showMemberModal, setShowMemberModal] =
        useState(false);

    const [selectedMemberIds, setSelectedMemberIds] =
        useState([]);

    const [memberSuccess, setMemberSuccess] =
        useState("");


    /* =========================================================
       LOAD PROJECT
    ========================================================= */

    useEffect(() => {

        const loadProject = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getProject(projectId);

                setProject(data);

            } catch (err) {

                console.error(
                    "Failed to load project:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load project"
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
       LOAD TASKS
    ========================================================= */

    useEffect(() => {

        const loadTasks = async () => {

            try {

                setTasksLoading(true);
                setTasksError("");

                const data =
                    await getProjectTasks(
                        projectId
                    );

                const taskList =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(
                            data?.tasks
                        )
                            ? data.tasks
                            : Array.isArray(
                                data?.data
                            )
                                ? data.data
                                : [];

                setTasks(taskList);

            } catch (err) {

                console.error(
                    "Failed to load tasks:",
                    err
                );

                setTasksError(
                    err.message ||
                    "Failed to load tasks"
                );

            } finally {

                setTasksLoading(false);
            }
        };


        if (projectId) {
            loadTasks();
        }

    }, [projectId]);


    /* =========================================================
       LOAD PROJECT MEMBERS
    ========================================================= */

    const loadProjectMembers = async () => {

        try {

            setMembersLoading(true);
            setMembersError("");

            const data =
                await getProjectMembers(
                    projectId
                );

            const memberList =
                Array.isArray(data)
                    ? data
                    : Array.isArray(
                        data?.members
                    )
                        ? data.members
                        : [];

            setProjectMembers(
                memberList
            );

            setSelectedMemberIds(
                memberList
                    .map((member) =>
                        typeof member.user === "string"
                            ? member.user
                            : member.user?._id
                    )
                    .filter(Boolean)
            );

        } catch (err) {

            console.error(
                "Failed to load project members:",
                err
            );

            setMembersError(
                err.message ||
                "Failed to load project members"
            );

        } finally {

            setMembersLoading(false);
        }
    };


    /* =========================================================
       LOAD PROJECT MEMBERS (ON MOUNT)
       -- Without this, the "Project Members" preview card
          always shows "No project members" on page load,
          because projectMembers only ever got populated as
          a side effect of opening the manage-members modal.
    ========================================================= */

    useEffect(() => {

        if (projectId) {
            loadProjectMembers();
        }

    }, [projectId]);


    /* =========================================================
       OPEN MEMBER MODAL
    ========================================================= */

    const handleOpenMembers = async () => {

        setShowMemberModal(true);
        setMemberSuccess("");
        setMembersError("");

        try {

            setMembersLoading(true);

            const [
                currentMembers,
                allWorkspaceMembers
            ] = await Promise.all([
                getProjectMembers(
                    projectId
                ),
                getWorkspaceMembers(
                    project.workspace
                ),
            ]);


            const currentList =
                Array.isArray(
                    currentMembers
                )
                    ? currentMembers
                    : Array.isArray(
                        currentMembers?.members
                    )
                        ? currentMembers.members
                        : [];


            const workspaceList =
                Array.isArray(
                    allWorkspaceMembers
                )
                    ? allWorkspaceMembers
                    : Array.isArray(
                        allWorkspaceMembers?.members
                    )
                        ? allWorkspaceMembers.members
                        : [];


            setProjectMembers(
                currentList
            );

            setWorkspaceMembers(
                workspaceList
            );


            setSelectedMemberIds(
                currentList
                    .map((member) =>
                        typeof member.user === "string"
                            ? member.user
                            : member.user?._id
                    )
                    .filter(Boolean)
            );

        } catch (err) {

            console.error(
                "Failed to load member data:",
                err
            );

            setMembersError(
                err.message ||
                "Failed to load member data"
            );

        } finally {

            setMembersLoading(false);
        }
    };


    /* =========================================================
       CLOSE MEMBER MODAL
    ========================================================= */

    const handleCloseMembers = () => {

        if (savingMembers) {
            return;
        }

        setShowMemberModal(false);
        setMembersError("");
        setMemberSuccess("");

        setSelectedMemberIds(
            projectMembers
                .map((member) =>
                    typeof member.user === "string"
                        ? member.user
                        : member.user?._id
                )
                .filter(Boolean)
        );
    };


    /* =========================================================
       TOGGLE MEMBER
    ========================================================= */

    const handleToggleMember = (
        memberId
    ) => {

        setSelectedMemberIds(
            (previous) => {

                if (
                    previous.includes(
                        memberId
                    )
                ) {

                    return previous.filter(
                        (id) =>
                            id !== memberId
                    );
                }

                return [
                    ...previous,
                    memberId
                ];
            }
        );
    };


    /* =========================================================
       SAVE PROJECT MEMBERS
    ========================================================= */

    const handleSaveMembers = async () => {

        try {

            setSavingMembers(true);
            setMembersError("");
            setMemberSuccess("");

            const updated =
                await updateProjectMembers(
                    projectId,
                    selectedMemberIds
                );

            const updatedList =
                Array.isArray(updated)
                    ? updated
                    : Array.isArray(
                        updated?.members
                    )
                        ? updated.members
                        : [];

            setProjectMembers(
                updatedList
            );

            setSelectedMemberIds(
                updatedList
                    .map((member) =>
                        typeof member.user === "string"
                            ? member.user
                            : member.user?._id
                    )
                    .filter(Boolean)
            );

            setMemberSuccess(
                "Project members updated successfully."
            );

            setTimeout(() => {
                setShowMemberModal(false);
                setMemberSuccess("");
            }, 900);

        } catch (err) {

            console.error(
                "Failed to update project members:",
                err
            );

            setMembersError(
                err.message ||
                "Failed to update project members"
            );

        } finally {

            setSavingMembers(false);
        }
    };


    /* =========================================================
       STATUS CLASS
    ========================================================= */

    const getStatusClass = (
        status
    ) => {

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


    /* =========================================================
       TASK STATUS CLASS
    ========================================================= */

    const getTaskStatusClass = (
        status
    ) => {

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


    /* =========================================================
       PRIORITY CLASS
    ========================================================= */

    const getPriorityClass = (
        priority
    ) => {

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


    /* =========================================================
       FORMAT STATUS
    ========================================================= */

    const formatStatus = (
        status
    ) => {

        if (!status) {
            return "Unknown";
        }

        return status
            .replaceAll(
                "_",
                " "
            )
            .toLowerCase()
            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );
    };


    /* =========================================================
       FORMAT DATE
    ========================================================= */

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "Not available";
        }

        return parsedDate.toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };


    /* =========================================================
       TASK TITLE
    ========================================================= */

    const getTaskTitle = (
        task
    ) => {

        return (
            task?.title ||
            task?.name ||
            "Untitled Task"
        );
    };


    /* =========================================================
       TOTAL / COMPLETION
    ========================================================= */

    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            (task) =>
                task?.status === "DONE"
        ).length;

    const progressPercentage =
        totalTasks > 0
            ? Math.round(
                (completedTasks /
                    totalTasks) *
                100
            )
            : 0;


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <div className="project-details-loading">

                <div className="project-details-loader"></div>

                <p>
                    Loading project...
                </p>

            </div>
        );
    }


    /* =========================================================
       ERROR
    ========================================================= */

    if (error) {

        return (
            <div className="project-details-error-page">

                <div className="project-details-error-card">

                    <h2>
                        Unable to load project
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/projects"
                            )
                        }
                        className="project-details-back-button"
                    >
                        ← Back to Projects
                    </button>

                </div>

            </div>
        );
    }


    /* =========================================================
       NO PROJECT
    ========================================================= */

    if (!project) {

        return (
            <div className="project-details-error-page">

                <div className="project-details-error-card">

                    <h2>
                        Project not found
                    </h2>

                    <p>
                        The project you're looking
                        for does not exist.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/projects"
                            )
                        }
                        className="project-details-back-button"
                    >
                        ← Back to Projects
                    </button>

                </div>

            </div>
        );
    }


    /* =========================================================
       RENDER
    ========================================================= */

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

                    <span>
                        ProjectFlow
                    </span>

                </div>


                <nav className="project-details-nav">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        <span>⌂</span>
                        Dashboard
                    </button>


                    <button
                        type="button"
                        className="active"
                        onClick={() =>
                            navigate(
                                "/projects"
                            )
                        }
                    >
                        <span>▣</span>
                        Projects
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/team"
                            )
                        }
                    >
                        <span>♙</span>
                        Team
                    </button>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/tasks"
                            )
                        }
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


                {/* =========================
                    TOPBAR
                ========================= */}

                <header className="project-details-topbar">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/projects"
                            )
                        }
                        className="project-details-back-link"
                    >
                        ← Projects
                    </button>


                    <div className="project-details-user">

                        <div className="project-details-avatar">
                            U
                        </div>

                        <span>
                            User
                        </span>

                    </div>

                </header>


                {/* =========================
                    CONTENT
                ========================= */}

                <section className="project-details-content">


                    {/* =========================
                        PROJECT HEADER
                    ========================= */}

                    <div className="project-details-header">

                        <div>

                            <div className="project-details-breadcrumb">
                                Projects / {project.name}
                            </div>

                            <h1>
                                {project.name}
                            </h1>

                            <p>
                                {project.description ||
                                    "No description has been added to this project yet."}
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/projects"
                                )
                            }
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
                                    {formatStatus(
                                        project.status
                                    )}
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

                                <h2>
                                    Project Overview
                                </h2>

                                <p>
                                    Details and information
                                    about this project.
                                </p>

                            </div>

                        </div>


                        <div className="project-details-overview">

                            <div className="project-details-overview-item">

                                <span>
                                    Project Name
                                </span>

                                <strong>
                                    {project.name}
                                </strong>

                            </div>


                            <div className="project-details-overview-item">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {formatStatus(
                                        project.status
                                    )}
                                </strong>

                            </div>


                            <div className="project-details-overview-item">

                                <span>
                                    Created On
                                </span>

                                <strong>
                                    {formatDate(
                                        project.createdAt
                                    )}
                                </strong>

                            </div>


                            <div className="project-details-overview-item">

                                <span>
                                    Last Updated
                                </span>

                                <strong>
                                    {formatDate(
                                        project.updatedAt
                                    )}
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

                                <h2>
                                    Tasks
                                </h2>

                                <p>
                                    Tasks belonging
                                    to this project.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="project-details-primary-button"
                                onClick={() =>
                                    navigate(
                                        `/projects/${projectId}/tasks/new`
                                    )
                                }
                            >
                                + Add Task
                            </button>

                        </div>


                        {tasksLoading && (

                            <div className="project-details-task-message">

                                <div className="project-details-loader"></div>

                                <p>
                                    Loading tasks...
                                </p>

                            </div>
                        )}


                        {!tasksLoading &&
                            tasksError && (

                                <div className="project-details-task-error">

                                    <p>
                                        {tasksError}
                                    </p>

                                </div>
                            )}


                        {!tasksLoading &&
                            !tasksError &&
                            tasks.length === 0 && (

                                <div className="project-details-empty">

                                    <div className="project-details-empty-icon">
                                        ✓
                                    </div>

                                    <h3>
                                        No tasks yet
                                    </h3>

                                    <p>
                                        Start adding tasks
                                        to manage the work
                                        for this project.
                                    </p>

                                </div>
                            )}


                        {!tasksLoading &&
                            !tasksError &&
                            tasks.length > 0 && (

                                <div className="project-details-task-list">

                                    {tasks.map(
                                        (task) => (

                                            <div
                                                key={task._id}
                                                className="project-details-task"
                                                onClick={() =>
                                                    navigate(
                                                        `/tasks/${task._id}`
                                                    )
                                                }
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(
                                                    event
                                                ) => {

                                                    if (
                                                        event.key ===
                                                        "Enter" ||
                                                        event.key ===
                                                        " "
                                                    ) {

                                                        event.preventDefault();

                                                        navigate(
                                                            `/tasks/${task._id}`
                                                        );
                                                    }
                                                }}
                                            >

                                                <div className="project-details-task-info">

                                                    <h3>
                                                        {getTaskTitle(
                                                            task
                                                        )}
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
                                                        {formatStatus(
                                                            task.status
                                                        )}
                                                    </span>


                                                    <span
                                                        className={`project-details-task-priority ${getPriorityClass(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {formatStatus(
                                                            task.priority
                                                        )}
                                                    </span>


                                                    {task.dueDate && (

                                                        <span className="project-details-task-date">

                                                            Due:{" "}
                                                            {formatDate(
                                                                task.dueDate
                                                            )}

                                                        </span>
                                                    )}

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                    </div>


                    {/* =========================
                        PROJECT MEMBERS
                    ========================= */}

                    <div className="project-details-section">

                        <div className="project-details-section-header">

                            <div>

                                <h2>
                                    Project Members
                                </h2>

                                <p>
                                    Members assigned
                                    to this project.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="project-details-secondary-button"
                                onClick={
                                    handleOpenMembers
                                }
                            >
                                Manage Members
                            </button>

                        </div>


                        {projectMembers.length === 0 ? (

                            <div className="project-details-empty">

                                <div className="project-details-empty-icon">
                                    ♙
                                </div>

                                <h3>
                                    No project members
                                </h3>

                                <p>
                                    Add workspace members
                                    to this project.
                                </p>

                            </div>

                        ) : (

                            <div className="project-members-preview">

                                {projectMembers.map(
                                    (member) => {

                                        const user =
                                            typeof member.user ===
                                            "object"
                                                ? member.user
                                                : null;

                                        const userId =
                                            typeof member.user ===
                                            "string"
                                                ? member.user
                                                : user?._id;

                                        if (!userId) {
                                            return null;
                                        }

                                        return (
                                            <div
                                                key={userId}
                                                className="project-member-preview-item"
                                            >

                                                <div className="project-member-preview-avatar">

                                                    {(
                                                        user?.name ||
                                                        user?.email ||
                                                        "U"
                                                    )
                                                        .charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                <div>

                                                    <strong>
                                                        {user?.name ||
                                                            user?.email ||
                                                            "Workspace Member"}
                                                    </strong>

                                                    {user?.email && (
                                                        <span>
                                                            {user.email}
                                                        </span>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </div>

                </section>

            </main>


            {/* =========================
                MEMBER MODAL
            ========================= */}

            {showMemberModal && (

                <div
                    className="project-members-overlay"
                    onMouseDown={(
                        event
                    ) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseMembers();
                        }
                    }}
                >

                    <div className="project-members-modal">


                        {/* HEADER */}

                        <div className="project-members-modal-header">

                            <div>

                                <span>
                                    PROJECT SETTINGS
                                </span>

                                <h2>
                                    Manage Members
                                </h2>

                                <p>
                                    Choose which workspace
                                    members can work on this project.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="project-members-close"
                                onClick={
                                    handleCloseMembers
                                }
                                disabled={
                                    savingMembers
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* CONTENT */}

                        <div className="project-members-modal-content">

                            {membersLoading ? (

                                <div className="project-members-loading">

                                    <div className="project-members-spinner"></div>

                                    <p>
                                        Loading members...
                                    </p>

                                </div>

                            ) : membersError ? (

                                <div className="project-members-error">

                                    <p>
                                        {membersError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenMembers
                                        }
                                    >
                                        Try Again
                                    </button>

                                </div>

                            ) : workspaceMembers.length === 0 ? (

                                <div className="project-members-empty">

                                    <h3>
                                        No workspace members
                                    </h3>

                                    <p>
                                        Add members to the
                                        workspace first.
                                    </p>

                                </div>

                            ) : (

                                <div className="project-members-list">

                                    {workspaceMembers.map(
                                        (member) => {

                                            const user =
                                                typeof member.user ===
                                                "object"
                                                    ? member.user
                                                    : null;

                                            const userId =
                                                typeof member.user ===
                                                "string"
                                                    ? member.user
                                                    : user?._id;

                                            if (!userId) {
                                                return null;
                                            }

                                            const isSelected =
                                                selectedMemberIds.includes(
                                                    userId
                                                );

                                            return (

                                                <label
                                                    key={userId}
                                                    className={`project-member-option ${
                                                        isSelected
                                                            ? "selected"
                                                            : ""
                                                    }`}
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            isSelected
                                                        }
                                                        onChange={() =>
                                                            handleToggleMember(
                                                                userId
                                                            )
                                                        }
                                                        disabled={
                                                            savingMembers
                                                        }
                                                    />


                                                    <div className="project-member-option-avatar">

                                                        {(
                                                            user?.name ||
                                                            user?.email ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    <div className="project-member-option-info">

                                                        <strong>
                                                            {user?.name ||
                                                                user?.email ||
                                                                "Workspace Member"}
                                                        </strong>

                                                        {user?.email && (
                                                            <span>
                                                                {user.email}
                                                            </span>
                                                        )}

                                                    </div>


                                                    <div className="project-member-option-role">
                                                        {member.role ||
                                                            "MEMBER"}
                                                    </div>

                                                </label>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </div>


                        {/* FOOTER */}

                        <div className="project-members-modal-footer">

                            <div className="project-members-selected-count">

                                <strong>
                                    {selectedMemberIds.length}
                                </strong>

                                <span>
                                    {selectedMemberIds.length === 1
                                        ? "member selected"
                                        : "members selected"}
                                </span>

                            </div>


                            <div className="project-members-actions">

                                <button
                                    type="button"
                                    className="project-members-cancel"
                                    onClick={
                                        handleCloseMembers
                                    }
                                    disabled={
                                        savingMembers
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="project-members-save"
                                    onClick={
                                        handleSaveMembers
                                    }
                                    disabled={
                                        savingMembers ||
                                        membersLoading ||
                                        !!membersError
                                    }
                                >
                                    {savingMembers
                                        ? "Saving..."
                                        : "Save Members"}
                                </button>

                            </div>

                        </div>


                        {memberSuccess && (

                            <div className="project-members-success">
                                {memberSuccess}
                            </div>

                        )}

                    </div>

                </div>
            )}

        </div>
    );
};


export default ProjectDetails;