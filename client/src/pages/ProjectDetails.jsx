import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getProject,
    getProjectMembers,
    updateProjectMembers,
} from "../services/projectService";

import { getProjectTasks } from "../services/taskService";
import { getWorkspaceMembers } from "../services/workspaceService";

import Sidebar from "../components/Sidebar";

import "../styles/projectMembers.css";


const ProjectDetails = () => {

    const { projectId } = useParams();
    const navigate = useNavigate();


    /* =========================================================
       PROJECT / TASK STATE
    ========================================================= */

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);


    /* =========================================================
       PROJECT MEMBER STATE
    ========================================================= */

    const [projectMembers, setProjectMembers] =
        useState([]);

    const [workspaceMembers, setWorkspaceMembers] =
        useState([]);

    const [selectedMemberIds, setSelectedMemberIds] =
        useState([]);


    /* =========================================================
       LOADING STATE
    ========================================================= */

    const [loading, setLoading] =
        useState(true);

    const [tasksLoading, setTasksLoading] =
        useState(true);

    const [membersLoading, setMembersLoading] =
        useState(false);

    const [savingMembers, setSavingMembers] =
        useState(false);


    /* =========================================================
       ERROR STATE
    ========================================================= */

    const [error, setError] =
        useState("");

    const [tasksError, setTasksError] =
        useState("");

    const [membersError, setMembersError] =
        useState("");


    /* =========================================================
       MEMBER MODAL STATE
    ========================================================= */

    const [showMemberModal, setShowMemberModal] =
        useState(false);

    const [memberSuccess, setMemberSuccess] =
        useState("");


    /* =========================================================
       HELPER:
       GET USER FROM A MEMBER OBJECT
       
       WorkspaceMember / ProjectMember can return:
       
       {
           user: {
               _id,
               name,
               email
           }
       }

       OR:

       {
           user: "USER_ID"
       }
    ========================================================= */

    const getMemberUser = (member) => {

        if (!member) {
            return null;
        }

        if (
            member.user &&
            typeof member.user === "object"
        ) {
            return member.user;
        }

        return null;
    };


    /* =========================================================
       HELPER:
       GET USER ID

       IMPORTANT:
       We ALWAYS want USER ID here.

       We do NOT want:
       WorkspaceMember._id
       ProjectMember._id
       
       We want:
       member.user._id
       OR
       member.user
    ========================================================= */

    const getMemberUserId = (member) => {

        if (!member) {
            return null;
        }

        if (
            typeof member.user === "string"
        ) {
            return member.user;
        }

        if (
            member.user &&
            typeof member.user === "object"
        ) {
            return member.user._id || null;
        }

        /*
         * Some APIs may directly return a user object.
         */
        if (member._id) {
            return member._id;
        }

        return null;
    };


    /* =========================================================
       HELPER:
       NORMALIZE API LIST
    ========================================================= */

    const normalizeList = (result) => {

        if (Array.isArray(result)) {
            return result;
        }

        if (
            Array.isArray(
                result?.data
            )
        ) {
            return result.data;
        }

        if (
            Array.isArray(
                result?.members
            )
        ) {
            return result.members;
        }

        if (
            Array.isArray(
                result?.data?.members
            )
        ) {
            return result.data.members;
        }

        return [];
    };


    /* =========================================================
       LOAD PROJECT
    ========================================================= */

    useEffect(() => {

        let cancelled = false;


        const loadProject = async () => {

            try {

                setLoading(true);
                setError("");


                const data =
                    await getProject(
                        projectId
                    );


                if (!cancelled) {

                    setProject(
                        data
                    );
                }


            } catch (err) {

                console.error(
                    "Failed to load project:",
                    err
                );


                if (!cancelled) {

                    setError(
                        err.message ||
                        "Failed to load project"
                    );
                }


            } finally {

                if (!cancelled) {

                    setLoading(false);
                }
            }
        };


        if (projectId) {

            loadProject();
        }


        return () => {

            cancelled = true;
        };

    }, [projectId]);


    /* =========================================================
       LOAD TASKS
    ========================================================= */

    useEffect(() => {

        let cancelled = false;


        const loadTasks = async () => {

            try {

                setTasksLoading(true);
                setTasksError("");


                const data =
                    await getProjectTasks(
                        projectId
                    );


                const taskList =
                    normalizeList(
                        data
                    );


                if (!cancelled) {

                    setTasks(
                        taskList
                    );
                }


            } catch (err) {

                console.error(
                    "Failed to load tasks:",
                    err
                );


                if (!cancelled) {

                    setTasksError(
                        err.message ||
                        "Failed to load tasks"
                    );
                }


            } finally {

                if (!cancelled) {

                    setTasksLoading(false);
                }
            }
        };


        if (projectId) {

            loadTasks();
        }


        return () => {

            cancelled = true;
        };

    }, [projectId]);


    /* =========================================================
       GET WORKSPACE ID SAFELY

       project.workspace can be:

       "WORKSPACE_ID"

       OR:

       {
           _id: "WORKSPACE_ID"
       }
    ========================================================= */

    const getWorkspaceId = () => {

        if (!project?.workspace) {
            return null;
        }


        if (
            typeof project.workspace ===
            "string"
        ) {
            return project.workspace;
        }


        return (
            project.workspace?._id ||
            null
        );
    };


    /* =========================================================
       LOAD PROJECT MEMBERS

       IMPORTANT FIX

       We fetch:

       1. Current project members
       2. Current workspace members

       Then compare them using USER IDs.

       This prevents stale ProjectMember records from
       breaking the update operation.
    ========================================================= */

    const loadProjectMembers = async (
        openModal = false
    ) => {

        if (!projectId) {
            return;
        }


        const workspaceId =
            getWorkspaceId();


        if (!workspaceId) {

            setMembersError(
                "Project workspace could not be determined."
            );

            return;
        }


        try {

            setMembersLoading(true);
            setMembersError("");


            const [
                projectMembersResult,
                workspaceMembersResult,
            ] = await Promise.all([

                getProjectMembers(
                    projectId
                ),

                getWorkspaceMembers(
                    workspaceId
                ),

            ]);


            /* =================================================
               NORMALIZE BOTH RESPONSES
            ================================================= */

            const currentProjectMembers =
                normalizeList(
                    projectMembersResult
                );


            const currentWorkspaceMembers =
                normalizeList(
                    workspaceMembersResult
                );


            /* =================================================
               CREATE SET OF CURRENT WORKSPACE USER IDS

               Example:

               WorkspaceMember:
               {
                   _id: "MEMBERSHIP_ID",
                   user: "USER_ID"
               }

               We store:

               USER_ID

               NOT:

               MEMBERSHIP_ID
            ================================================= */

            const validWorkspaceUserIds =
                new Set();


            currentWorkspaceMembers.forEach(
                (member) => {

                    const userId =
                        getMemberUserId(
                            member
                        );


                    if (userId) {

                        validWorkspaceUserIds.add(
                            String(userId)
                        );
                    }
                }
            );


            /* =================================================
               KEEP ONLY PROJECT MEMBERS WHO ARE STILL
               CURRENT MEMBERS OF THIS WORKSPACE.

               This handles old/stale ProjectMember records.

               Example:

               ProjectMember:
               A ✅
               B ✅
               C ❌ old workspace member

               WorkspaceMember:
               A
               B

               Result:

               A
               B
            ================================================= */

            const validProjectMembers =
                currentProjectMembers.filter(
                    (member) => {

                        const userId =
                            getMemberUserId(
                                member
                            );


                        if (!userId) {
                            return false;
                        }


                        return validWorkspaceUserIds.has(
                            String(userId)
                        );
                    }
                );


            /* =================================================
               SET CLEAN STATE
            ================================================= */

            setProjectMembers(
                validProjectMembers
            );


            setWorkspaceMembers(
                currentWorkspaceMembers
            );


            /* =================================================
               SELECTED IDS MUST ALWAYS BE USER IDS
            ================================================= */

            const selectedIds =
                validProjectMembers
                    .map(
                        (member) =>
                            getMemberUserId(
                                member
                            )
                    )
                    .filter(Boolean)
                    .map(String);


            setSelectedMemberIds(
                selectedIds
            );


            if (openModal) {

                setShowMemberModal(
                    true
                );
            }


        } catch (err) {

            console.error(
                "Failed to load project members:",
                err
            );


            setMembersError(
                err.message ||
                "Failed to load project members"
            );


            if (openModal) {

                setShowMemberModal(
                    true
                );
            }


        } finally {

            setMembersLoading(
                false
            );
        }
    };


    /* =========================================================
       LOAD MEMBERS AUTOMATICALLY AFTER PROJECT LOAD

       This fixes:

       Refresh
       ↓
       Project members disappear

       Now:

       Refresh
       ↓
       Project loads
       ↓
       Workspace ID available
       ↓
       Members load
    ========================================================= */

    useEffect(() => {

        if (
            projectId &&
            project &&
            getWorkspaceId()
        ) {

            loadProjectMembers(
                false
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        projectId,
        project?.workspace,
    ]);


    /* =========================================================
       OPEN MEMBER MODAL
    ========================================================= */

    const handleOpenMembers = async () => {

        setMemberSuccess("");
        setMembersError("");


        await loadProjectMembers(
            true
        );
    };


    /* =========================================================
       CLOSE MEMBER MODAL
    ========================================================= */

    const handleCloseMembers = () => {

        if (savingMembers) {
            return;
        }


        setShowMemberModal(
            false
        );


        setMembersError("");
        setMemberSuccess("");


        /*
         * Restore selected IDs from the last saved
         * project member state.
         */
        const savedIds =
            projectMembers
                .map(
                    (member) =>
                        getMemberUserId(
                            member
                        )
                )
                .filter(Boolean)
                .map(String);


        setSelectedMemberIds(
            savedIds
        );
    };


    /* =========================================================
       TOGGLE MEMBER
    ========================================================= */

    const handleToggleMember = (
        memberId
    ) => {

        if (!memberId) {
            return;
        }


        const normalizedId =
            String(memberId);


        setSelectedMemberIds(
            (previous) => {

                const previousIds =
                    previous.map(
                        String
                    );


                if (
                    previousIds.includes(
                        normalizedId
                    )
                ) {

                    return previousIds.filter(
                        (id) =>
                            id !== normalizedId
                    );
                }


                /*
                 * Safety check:
                 * Only allow users who currently belong
                 * to this workspace.
                 */

                const belongsToWorkspace =
                    workspaceMembers.some(
                        (member) => {

                            const userId =
                                getMemberUserId(
                                    member
                                );

                            return (
                                userId &&
                                String(userId) ===
                                    normalizedId
                            );
                        }
                    );


                if (
                    !belongsToWorkspace
                ) {

                    return previousIds;
                }


                return [
                    ...previousIds,
                    normalizedId,
                ];
            }
        );
    };


    /* =========================================================
       SAVE PROJECT MEMBERS

       IMPORTANT FIX

       Before sending anything to backend:

       - remove duplicates
       - remove empty IDs
       - make sure every ID belongs to workspace
       - send USER IDs only
    ========================================================= */

    const handleSaveMembers = async () => {

        try {

            setSavingMembers(true);
            setMembersError("");
            setMemberSuccess("");


            /* =================================================
               NORMALIZE SELECTED IDS
            ================================================= */

            const cleanSelectedIds = [
                ...new Set(
                    selectedMemberIds
                        .filter(Boolean)
                        .map(String)
                ),
            ];


            /* =================================================
               BUILD CURRENT WORKSPACE USER ID SET
            ================================================= */

            const validWorkspaceUserIds =
                new Set();


            workspaceMembers.forEach(
                (member) => {

                    const userId =
                        getMemberUserId(
                            member
                        );


                    if (userId) {

                        validWorkspaceUserIds.add(
                            String(userId)
                        );
                    }
                }
            );


            /* =================================================
               VALIDATE SELECTED USERS

               This is a frontend safety check.

               Backend ALSO validates this.

               The backend remains the final authority.
            ================================================= */

            const invalidIds =
                cleanSelectedIds.filter(
                    (id) =>
                        !validWorkspaceUserIds.has(
                            String(id)
                        )
                );


            if (
                invalidIds.length > 0
            ) {

                throw new Error(
                    "One or more selected members do not belong to this workspace."
                );
            }


            /* =================================================
               SEND ONLY VALID USER IDS
            ================================================= */

            await updateProjectMembers(
                projectId,
                cleanSelectedIds
            );


            /* =================================================
               IMPORTANT:
               RE-FETCH DATABASE STATE

               Do NOT rely only on PATCH response.

               MongoDB becomes the source of truth.
            ================================================= */

            await loadProjectMembers(
                false
            );


            setMemberSuccess(
                "Project members updated successfully."
            );


            /*
             * Close after a short success message.
             */
            setTimeout(() => {

                setShowMemberModal(
                    false
                );

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

            setSavingMembers(
                false
            );
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
                (
                    completedTasks /
                    totalTasks
                ) * 100
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


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <Sidebar active="projects" />

                        {/* =================================================
                MAIN
            ================================================= */}

            <main className="project-details-main">


                {/* =================================================
                    TOPBAR
                ================================================= */}

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


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="project-details-content">


                    {/* =================================================
                        PROJECT HEADER
                    ================================================= */}

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


                    {/* =================================================
                        PROJECT SUMMARY
                    ================================================= */}

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


                    {/* =================================================
                        PROJECT OVERVIEW
                    ================================================= */}

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


                    {/* =================================================
                        TASKS
                    ================================================= */}

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


                    {/* =================================================
                        PROJECT MEMBERS
                    ================================================= */}

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
                                disabled={
                                    membersLoading
                                }
                            >
                                {membersLoading
                                    ? "Loading..."
                                    : "Manage Members"}
                            </button>

                        </div>


                        {membersError &&
                            !showMemberModal && (

                                <div className="project-details-task-error">

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
                            )}


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
                                            getMemberUser(
                                                member
                                            );

                                        const userId =
                                            getMemberUserId(
                                                member
                                            );


                                        if (!userId) {
                                            return null;
                                        }


                                        return (

                                            <div
                                                key={
                                                    String(
                                                        userId
                                                    )
                                                }
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


            {/* =================================================
                MEMBER MODAL
            ================================================= */}

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


                        {/* =================================================
                            HEADER
                        ================================================= */}

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
                                aria-label="Close member management"
                            >
                                ×
                            </button>

                        </div>


                        {/* =================================================
                            CONTENT
                        ================================================= */}

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
                                        disabled={
                                            membersLoading ||
                                            savingMembers
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
                                                getMemberUser(
                                                    member
                                                );

                                            const userId =
                                                getMemberUserId(
                                                    member
                                                );


                                            if (!userId) {
                                                return null;
                                            }


                                            const normalizedUserId =
                                                String(
                                                    userId
                                                );


                                            const isSelected =
                                                selectedMemberIds
                                                    .map(String)
                                                    .includes(
                                                        normalizedUserId
                                                    );


                                            return (

                                                <label
                                                    key={
                                                        normalizedUserId
                                                    }
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
                                                                normalizedUserId
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


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="project-members-modal-footer">

                            <div className="project-members-selected-count">

                                <strong>
                                    {
                                        selectedMemberIds.length
                                    }
                                </strong>

                                <span>
                                    {
                                        selectedMemberIds.length ===
                                        1
                                            ? "member selected"
                                            : "members selected"
                                    }
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


                        {/* =================================================
                            SUCCESS MESSAGE
                        ================================================= */}

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