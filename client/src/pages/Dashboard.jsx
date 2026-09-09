import { useEffect, useState } from "react";
import {
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  Search,
  Plus,
  BriefcaseBusiness,
  ChevronDown,
  Sun,
  Settings,
  ChevronRight,
  LogOut,
  User,
  Check,
  AlertCircle,
  CircleCheck,
  ClipboardList,
  Clock3,
} from "lucide-react";

import { logoutUser } from "../services/authService";

import {
  getWorkspaces,
  getWorkspaceMembers,
} from "../services/workspaceService";

import {
  getWorkspaceProjects,
} from "../services/projectService";

import {
  getProjectTasks,
} from "../services/taskService";


/* =========================================================
   CONSTANTS
========================================================= */

const WORKSPACE_STORAGE_KEY =
  "selectedWorkspaceId";


/* =========================================================
   HELPER
========================================================= */

const getInitialUser = () => {
  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const navigate = useNavigate();

  /* =======================================================
     AUTH
  ======================================================= */

  const token =
    localStorage.getItem("accessToken");

  const [user] =
    useState(getInitialUser);


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] =
    useState(Boolean(token));

  const [
    workspaceDataLoading,
    setWorkspaceDataLoading,
  ] = useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     WORKSPACE
  ======================================================= */

  const [workspaces, setWorkspaces] =
    useState([]);

  const [workspace, setWorkspace] =
    useState(null);

  const [
    showWorkspaceMenu,
    setShowWorkspaceMenu,
  ] = useState(false);


  /* =======================================================
     WORKSPACE DATA
  ======================================================= */

  const [members, setMembers] =
    useState([]);

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);


  /* =======================================================
     PROFILE
  ======================================================= */

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);


  /* =======================================================
     PAGE TITLE
  ======================================================= */

  useEffect(() => {
    document.title =
      "Dashboard | ProjectFlow";
  }, []);


  /* =======================================================
     LOAD WORKSPACES
     
     IMPORTANT:
     getWorkspaces() already normalizes the backend
     membership response.
     
     Therefore:
     
     workspaces = [
       {
         _id,
         name,
         description,
         role,
         membershipId
       }
     ]
  ======================================================= */

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const loadWorkspaces =
      async () => {
        try {
          setLoading(true);
          setError("");

          const result =
            await getWorkspaces();

          if (cancelled) {
            return;
          }

          /*
           * NEW WORKSPACE DATA SCHEME
           *
           * The service has already converted:
           *
           * membership.workspace
           *
           * into:
           *
           * workspace
           */

          const workspaceList =
            Array.isArray(result)
              ? result
              : Array.isArray(
                result?.workspaces
              )
                ? result.workspaces
                : [];

          setWorkspaces(
            workspaceList
          );

          /* =============================================
             NO WORKSPACES
          ============================================= */

          if (
            workspaceList.length === 0
          ) {
            setWorkspace(null);

            localStorage.removeItem(
              WORKSPACE_STORAGE_KEY
            );

            return;
          }

          /* =============================================
             RESTORE SAVED WORKSPACE
          ============================================= */

          const savedWorkspaceId =
            localStorage.getItem(
              WORKSPACE_STORAGE_KEY
            );

          const savedWorkspace =
            workspaceList.find(
              (item) =>
                String(
                  item?._id ||
                  item?.id
                ) ===
                String(
                  savedWorkspaceId
                )
            );

          /*
           * Use saved workspace if it still exists.
           * Otherwise use first available workspace.
           */

          const selectedWorkspace =
            savedWorkspace ||
            workspaceList[0];

          setWorkspace(
            selectedWorkspace
          );

          const selectedWorkspaceId =
            selectedWorkspace?._id ||
            selectedWorkspace?.id;

          if (
            selectedWorkspaceId
          ) {
            localStorage.setItem(
              WORKSPACE_STORAGE_KEY,
              selectedWorkspaceId
            );
          }
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load workspaces:",
            err
          );

          setError(
            err?.message ||
            "Failed to load workspaces"
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadWorkspaces();

    return () => {
      cancelled = true;
    };
  }, [token]);


  /* =======================================================
     LOAD SELECTED WORKSPACE DATA
  ======================================================= */

  useEffect(() => {
    if (!workspace?._id) {
      setMembers([]);
      setProjects([]);
      setTasks([]);

      return;
    }

    let cancelled = false;

    const loadWorkspaceData =
      async () => {
        try {
          setWorkspaceDataLoading(
            true
          );

          setError("");

          const [
            membersResult,
            projectsResult,
          ] = await Promise.all([
            getWorkspaceMembers(
              workspace._id
            ),

            getWorkspaceProjects(
              workspace._id
            ),
          ]);

          if (cancelled) {
            return;
          }

          const workspaceMembers =
            Array.isArray(
              membersResult
            )
              ? membersResult
              : [];

          const workspaceProjects =
            Array.isArray(
              projectsResult
            )
              ? projectsResult
              : [];

          setMembers(
            workspaceMembers
          );

          setProjects(
            workspaceProjects
          );


          /* =============================================
             LOAD TASKS
          ============================================= */

          if (
            workspaceProjects.length ===
            0
          ) {
            setTasks([]);
            return;
          }

          const taskResults =
            await Promise.all(
              workspaceProjects.map(
                async (project) => {
                  if (!project?._id) {
                    return [];
                  }

                  try {
                    const result =
                      await getProjectTasks(
                        project._id
                      );

                    const projectTasks =
                      Array.isArray(
                        result
                      )
                        ? result
                        : [];

                    return projectTasks.map(
                      (task) => ({
                        ...task,

                        projectId:
                          project._id,

                        projectName:
                          project?.name ||
                          "Untitled Project",
                      })
                    );
                  } catch (
                  taskError
                  ) {
                    console.error(
                      `Failed to load tasks for project ${project._id}:`,
                      taskError
                    );

                    return [];
                  }
                }
              )
            );

          if (cancelled) {
            return;
          }

          setTasks(
            taskResults.flat()
          );
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load workspace data:",
            err
          );

          setMembers([]);
          setProjects([]);
          setTasks([]);

          setError(
            err?.message ||
            "Unable to load the selected workspace."
          );
        } finally {
          if (!cancelled) {
            setWorkspaceDataLoading(
              false
            );
          }
        }
      };

    loadWorkspaceData();

    return () => {
      cancelled = true;
    };
  }, [workspace]);


  /* =======================================================
     AUTH REDIRECT
  ======================================================= */

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  /* =======================================================
     USER
  ======================================================= */

  const userName =
    user?.name || "User";


  /* =======================================================
     WORKSPACE SWITCH
  ======================================================= */

  const handleWorkspaceChange =
    (selectedWorkspace) => {
      if (
        !selectedWorkspace?._id
      ) {
        return;
      }

      setWorkspace(
        selectedWorkspace
      );

      localStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        selectedWorkspace._id
      );

      setShowWorkspaceMenu(
        false
      );
    };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(
        "Logout failed:",
        err
      );
    } finally {
      localStorage.removeItem(
        WORKSPACE_STORAGE_KEY
      );

      navigate("/login", {
        replace: true,
      });
    }
  };


  /* =======================================================
     STATS
  ======================================================= */

  const totalProjects =
    projects.length;

  const completedProjects =
    projects.filter(
      (project) =>
        String(
          project?.status || ""
        ).toUpperCase() ===
        "COMPLETED"
    ).length;

  const totalTasks =
    tasks.length;

  const todoTasks =
    tasks.filter(
      (task) =>
        String(
          task?.status || ""
        ).toUpperCase() ===
        "TODO"
    );

  const today =
    new Date();

  today.setHours(
    0,
    0,
    0,
    0
  );

  const overdueTasks =
    tasks.filter((task) => {
      if (!task?.dueDate) {
        return false;
      }

      const status =
        String(
          task?.status || ""
        ).toUpperCase();

      if (
        status === "DONE"
      ) {
        return false;
      }

      const dueDate =
        new Date(
          task.dueDate
        );

      if (
        Number.isNaN(
          dueDate.getTime()
        )
      ) {
        return false;
      }

      dueDate.setHours(
        0,
        0,
        0,
        0
      );

      return (
        dueDate < today
      );
    });


  /* =======================================================
     HELPERS
  ======================================================= */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "No date";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "No date";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  const getProjectStatusClass =
    (status) => {
      const normalized =
        String(
          status || ""
        ).toUpperCase();

      if (
        normalized ===
        "ACTIVE"
      ) {
        return "active";
      }

      if (
        normalized ===
        "COMPLETED"
      ) {
        return "completed";
      }

      return "not-started";
    };


  const getProjectStatusLabel =
    (status) => {
      if (!status) {
        return "NOT STARTED";
      }

      return String(
        status
      )
        .replaceAll(
          "_",
          " "
        )
        .toUpperCase();
    };


  const getPriorityLabel =
    (priority) => {
      if (!priority) {
        return "NO PRIORITY";
      }

      return `${String(
        priority
      )
        .replaceAll(
          "_",
          " "
        )
        .toUpperCase()} priority`;
    };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="dashboard-loading">

        <div className="dashboard-loading-card">

          <div className="dashboard-loading-spinner" />

          <h2>
            Loading your dashboard...
          </h2>

          <p>
            Getting your workspaces
            and projects ready.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="dashboard-page">

      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="dashboard-sidebar">

        <Link
          to="/dashboard"
          className="dashboard-brand"
        >
          <span className="dashboard-brand-icon">
            P
          </span>

          <span>
            Project<span>Flow</span>
          </span>
        </Link>


        {/* NAVIGATION */}

        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="dashboard-nav-item active"
          >
            <LayoutDashboard size={18} strokeWidth={1.8} />
            <span>Dashboard</span>
          </Link>


          <Link
            to="/projects"
            className="dashboard-nav-item"
          >
            <FolderKanban size={18} strokeWidth={1.8} />
            <span>Projects</span>
          </Link>

          <Link
            to="/team"
            className="dashboard-nav-item"
          >
            <Users size={18} strokeWidth={1.8} />
            <span>Team</span>
          </Link>


          <div className="dashboard-task-link">

            <Link
              to="/tasks"
              className="dashboard-nav-item"
            >
              <CheckSquare
                size={18}
                strokeWidth={1.8}
              />

              <span>
                My Tasks
              </span>

              <small>
                {todoTasks.length}
              </small>
            </Link>

            <span className="dashboard-arrow">
              <ChevronRight
                size={15}
                strokeWidth={1.8}
              />
            </span>

          </div>

        </nav>


        {/* PROJECT LIST */}

        <div className="sidebar-projects">

          <div className="sidebar-section-title">

            <span>
              PROJECTS
            </span>

            <Link
              to="/projects"
              aria-label="View all projects"
            >
              <ChevronRight
                size={14}
                strokeWidth={1.8}
              />
            </Link>

          </div>


          {projects.length ===
            0 ? (
            <div className="sidebar-empty-projects">
              No projects yet
            </div>
          ) : (
            projects
              .slice(0, 5)
              .map(
                (
                  project,
                  index
                ) => (
                  <Link
                    key={
                      project?._id ||
                      index
                    }
                    to={`/projects/${project?._id}`}
                    className="sidebar-project"
                  >

                    <span
                      className={`project-dot ${index % 2 === 0
                        ? "blue"
                        : "purple"
                        }`}
                    />

                    <span className="sidebar-project-name">
                      {project?.name ||
                        "Untitled Project"}
                    </span>

                  </Link>
                )
              )
          )}

        </div>


        {/* PROFILE */}

        <div className="sidebar-profile-wrapper">

          <button
            type="button"
            className="sidebar-profile"
            onClick={() =>
              setShowProfileMenu(
                (previous) =>
                  !previous
              )
            }
          >

            <div className="profile-avatar">
              {userName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="profile-info">

              <strong>
                {userName}
              </strong>

              <span>
                Profile
              </span>

            </div>

            <span className="profile-arrow">
              <ChevronDown
                size={15}
                strokeWidth={1.8}
              />
            </span>

          </button>


          {showProfileMenu && (
            <div className="profile-dropdown">

              <div className="profile-dropdown-user">

                <strong>
                  {userName}
                </strong>

                <span>
                  {user?.email || ""}
                </span>

              </div>


              <button
                type="button"
                className="profile-logout-button"
                onClick={
                  handleLogout
                }
              >

                <span>
                  <Settings
                    size={15}
                    strokeWidth={1.8}
                  />
                </span>

                Logout

              </button>

            </div>
          )}

        </div>

      </aside>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <Search
              size={17}
              strokeWidth={1.8}
            />

            <input
              type="search"
              placeholder="Search projects..."
            />

          </div>


          <div className="dashboard-top-actions">

            {/* WORKSPACE SELECTOR */}

            <div className="workspace-selector">

              <button
                type="button"
                className="workspace-selector-button"
                onClick={() =>
                  setShowWorkspaceMenu(
                    (previous) =>
                      !previous
                  )
                }
                disabled={
                  workspaces.length ===
                  0
                }
              >

                <span className="workspace-selector-icon">

                  <BriefcaseBusiness
                    size={16}
                    strokeWidth={1.8}
                  />

                </span>


                <span className="workspace-selector-content">

                  <small>
                    WORKSPACE
                  </small>

                  <strong>
                    {workspace?.name ||
                      "No workspace"}
                  </strong>

                </span>


                <span className="workspace-selector-arrow">

                  <ChevronDown
                    size={15}
                    strokeWidth={1.8}
                  />

                </span>

              </button>


              {showWorkspaceMenu &&
                workspaces.length >
                0 && (
                  <div className="workspace-dropdown">

                    <div className="workspace-dropdown-header">
                      Select workspace
                    </div>


                    {workspaces.map(
                      (
                        item,
                        index
                      ) => {

                        if (
                          !item?._id
                        ) {
                          return null;
                        }

                        const selected =
                          String(
                            workspace?._id
                          ) ===
                          String(
                            item._id
                          );

                        return (
                          <button
                            key={
                              item._id ||
                              index
                            }
                            type="button"
                            className={`workspace-dropdown-item ${selected
                              ? "selected"
                              : ""
                              }`}
                            onClick={() =>
                              handleWorkspaceChange(
                                item
                              )
                            }
                          >

                            <span className="workspace-dropdown-icon">

                              {item?.name
                                ?.charAt(
                                  0
                                )
                                ?.toUpperCase() ||
                                "W"}

                            </span>


                            <span className="workspace-dropdown-info">

                              <strong>
                                {item?.name ||
                                  "Unnamed workspace"}
                              </strong>

                              <small>
                                {item?.role ||
                                  "MEMBER"}
                              </small>

                            </span>


                            {selected && (
                              <span className="workspace-dropdown-check">

                                <Check
                                  size={16}
                                  strokeWidth={2}
                                />

                              </span>
                            )}

                          </button>
                        );
                      }
                    )}


                    {/* CREATE NEW WORKSPACE */}

                    <div
                      style={{
                        height:
                          "1px",
                        margin:
                          "6px 4px",
                        background:
                          "#eef2f7",
                      }}
                    />


                    <button
                      type="button"
                      className="workspace-dropdown-item"
                      onClick={() =>
                        navigate(
                          "/workspaces/new"
                        )
                      }
                    >

                      <span className="workspace-dropdown-icon">

                        <Plus
                          size={16}
                          strokeWidth={1.9}
                        />

                      </span>


                      <span className="workspace-dropdown-info">

                        <strong>
                          Create new workspace
                        </strong>

                        <small>
                          Start a new workspace
                        </small>

                      </span>

                    </button>

                  </div>
                )}

            </div>


            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Toggle theme"
            >

              <Sun
                size={17}
                strokeWidth={1.8}
              />

            </button>


            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Settings"
            >

              <Settings
                size={17}
                strokeWidth={1.8}
              />

            </button>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="dashboard-content-area">

          {/* ERROR */}

          {error && (
            <div className="dashboard-error">

              <span>

                <AlertCircle
                  size={15}
                  strokeWidth={1.8}
                />

              </span>

              <p>
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Retry
              </button>

            </div>
          )}


          {/* NO WORKSPACE */}

          {!workspace ? (
            <section className="dashboard-empty-state">

              <div className="dashboard-empty-icon">

                <BriefcaseBusiness
                  size={25}
                  strokeWidth={1.7}
                />

              </div>

              <h2>
                No workspace found
              </h2>

              <p>
                You don't have a workspace yet.
              </p>

              <Link
                to="/workspaces/new"
                className="empty-state-button"
              >
                Create Workspace
              </Link>

            </section>
          ) : (
            <>

              {/* =================================================
                  HEADING
              ================================================= */}

              <section className="dashboard-heading">

                <div>

                  <h1>
                    Welcome back, {userName}
                  </h1>

                  <p>
                    Here's what's happening
                    with your projects today.
                  </p>

                </div>


                <Link
                  to="/projects/new"
                  className="new-project-button"
                >

                  <Plus
                    size={17}
                    strokeWidth={2}
                  />

                  New Project

                </Link>

              </section>


              {/* =================================================
                  DATA LOADING
              ================================================= */}

              {workspaceDataLoading ? (
                <div className="dashboard-inline-loading">

                  <div className="dashboard-loading-spinner" />

                  <span>
                    Loading workspace data...
                  </span>

                </div>
              ) : (
                <>

                  {/* =================================================
                      STATS
                  ================================================= */}

                  <section className="dashboard-stats-grid">

                    <article className="dashboard-stat-card">

                      <div className="stat-card-top">

                        <span>
                          Total Projects
                        </span>

                        <span className="stat-icon blue">

                          <FolderKanban
                            size={16}
                            strokeWidth={1.8}
                          />

                        </span>

                      </div>

                      <strong>
                        {totalProjects}
                      </strong>

                      <p>
                        all projects
                      </p>

                    </article>


                    <article className="dashboard-stat-card">

                      <div className="stat-card-top">

                        <span>
                          Completed Projects
                        </span>

                        <span className="stat-icon green">

                          <CheckSquare
                            size={16}
                            strokeWidth={1.8}
                          />

                        </span>

                      </div>

                      <strong>
                        {completedProjects}
                      </strong>

                      <p>
                        of {totalProjects} total
                      </p>

                    </article>


                    <article className="dashboard-stat-card">

                      <div className="stat-card-top">

                        <span>
                          Total Tasks
                        </span>

                        <span className="stat-icon purple">

                          <CheckSquare
                            size={16}
                            strokeWidth={1.8}
                          />

                        </span>

                      </div>

                      <strong>
                        {totalTasks}
                      </strong>

                      <p>
                        across all projects
                      </p>

                    </article>


                    <article className="dashboard-stat-card">

                      <div className="stat-card-top">

                        <span>
                          Overdue Tasks
                        </span>

                        <span className="stat-icon orange">

                          <AlertCircle
                            size={16}
                            strokeWidth={1.8}
                          />

                        </span>

                      </div>

                      <strong>
                        {overdueTasks.length}
                      </strong>

                      <p>
                        need attention
                      </p>

                    </article>

                  </section>


                  {/* =================================================
                      MAIN GRID
                  ================================================= */}

                  <section className="dashboard-main-grid">

                    {/* PROJECT OVERVIEW */}

                    <div className="dashboard-panel project-overview-panel">

                      <div className="panel-header">

                        <div>

                          <h2>
                            Project Overview
                          </h2>

                          <p>
                            Track your projects
                          </p>

                        </div>

                        <Link
                          to="/projects"
                        >
                          View all →
                        </Link>

                      </div>


                      {projects.length ===
                        0 ? (
                        <div className="dashboard-panel-empty">

                          <span>

                            <FolderKanban
                              size={26}
                              strokeWidth={1.7}
                            />

                          </span>

                          <h3>
                            No projects yet
                          </h3>

                          <p>
                            Create your first
                            project to get started.
                          </p>

                          <Link
                            to="/projects/new"
                            className="panel-empty-link"
                          >
                            Create Project →
                          </Link>

                        </div>
                      ) : (
                        <div className="project-overview-list">

                          {projects
                            .slice(0, 5)
                            .map(
                              (
                                project,
                                index
                              ) => (
                                <Link
                                  key={
                                    project?._id ||
                                    index
                                  }
                                  to={`/projects/${project?._id}`}
                                  className="overview-project"
                                >

                                  <div className="overview-project-color">

                                    <span
                                      className={
                                        index %
                                          2 ===
                                          0
                                          ? "blue"
                                          : "purple"
                                      }
                                    />

                                  </div>


                                  <div className="overview-project-info">

                                    <div className="project-title-row">

                                      <div>

                                        <h3>
                                          {project?.name ||
                                            "Untitled Project"}
                                        </h3>

                                        <p>
                                          {project?.description ||
                                            "No project description"}
                                        </p>

                                      </div>


                                      <span
                                        className={`status-badge ${getProjectStatusClass(
                                          project?.status
                                        )}`}
                                      >
                                        {getProjectStatusLabel(
                                          project?.status
                                        )}
                                      </span>

                                    </div>


                                    <div className="project-meta">

                                      <span>
                                        Created{" "}
                                        {formatDate(
                                          project?.createdAt
                                        )}
                                      </span>

                                    </div>

                                  </div>

                                </Link>
                              )
                            )}

                        </div>
                      )}

                    </div>


                    {/* RIGHT COLUMN */}

                    <div className="dashboard-side-panels">

                      {/* TODO */}

                      <div className="dashboard-panel task-panel">

                        <div className="panel-header compact">

                          <div className="panel-title-with-icon">

                            <span className="panel-small-icon">

                              <CheckSquare
                                size={13}
                                strokeWidth={1.8}
                              />

                            </span>

                            <h2>
                              To Do
                            </h2>

                          </div>


                          <span className="task-count green-count">
                            {todoTasks.length}
                          </span>

                        </div>


                        {todoTasks.length ===
                          0 ? (
                          <div className="task-panel-empty">
                            No tasks to do
                          </div>
                        ) : (
                          <div className="task-list">

                            {todoTasks
                              .slice(0, 3)
                              .map(
                                (
                                  task,
                                  index
                                ) => (
                                  <Link
                                    key={
                                      task?._id ||
                                      index
                                    }
                                    to={`/tasks/${task?._id}`}
                                    className="task-card"
                                  >

                                    <h3>
                                      {task?.title ||
                                        "Untitled Task"}
                                    </h3>

                                    <div>

                                      <span>
                                        {getPriorityLabel(
                                          task?.priority
                                        )}
                                      </span>

                                      {task?.dueDate && (
                                        <span>
                                          • Due:{" "}
                                          {formatDate(
                                            task.dueDate
                                          )}
                                        </span>
                                      )}

                                    </div>

                                  </Link>
                                )
                              )}

                          </div>
                        )}

                      </div>


                      {/* OVERDUE */}

                      <div className="dashboard-panel task-panel">

                        <div className="panel-header compact">

                          <div className="panel-title-with-icon">

                            <span className="panel-small-icon warning">

                              <AlertCircle
                                size={13}
                                strokeWidth={1.8}
                              />

                            </span>

                            <h2>
                              Overdue
                            </h2>

                          </div>


                          <span className="task-count red-count">
                            {overdueTasks.length}
                          </span>

                        </div>


                        {overdueTasks.length ===
                          0 ? (
                          <div className="task-panel-empty">
                            No overdue tasks 🎉
                          </div>
                        ) : (
                          <div className="task-list">

                            {overdueTasks
                              .slice(0, 3)
                              .map(
                                (
                                  task,
                                  index
                                ) => (
                                  <Link
                                    key={
                                      task?._id ||
                                      index
                                    }
                                    to={`/tasks/${task?._id}`}
                                    className="task-card"
                                  >

                                    <h3>
                                      {task?.title ||
                                        "Untitled Task"}
                                    </h3>

                                    <div>

                                      <span>
                                        {getPriorityLabel(
                                          task?.priority
                                        )}
                                      </span>

                                      <span>
                                        • Due:{" "}
                                        {formatDate(
                                          task?.dueDate
                                        )}
                                      </span>

                                    </div>

                                  </Link>
                                )
                              )}

                          </div>
                        )}

                      </div>

                    </div>

                  </section>


                  {/* =================================================
                      WORKSPACE OVERVIEW
                  ================================================= */}

                  <section className="dashboard-panel activity-panel">

                    <div className="panel-header">

                      <div>

                        <h2>
                          Workspace Overview
                        </h2>

                        <p>
                          Current workspace information
                        </p>

                      </div>

                    </div>


                    <div className="activity-item">

                      <div className="activity-icon">

                        <BriefcaseBusiness
                          size={16}
                          strokeWidth={1.8}
                        />

                      </div>


                      <div>

                        <strong>
                          {workspace?.name ||
                            "Current workspace"}
                        </strong>

                        <p>
                          {members.length}{" "}
                          {members.length ===
                            1
                            ? "member"
                            : "members"}{" "}
                          in this workspace
                        </p>

                      </div>


                      <time>
                        {projects.length}{" "}
                        {projects.length ===
                          1
                          ? "project"
                          : "projects"}
                      </time>

                    </div>


                    <div className="activity-item">

                      <div className="activity-icon purple">

                        <CheckSquare
                          size={16}
                          strokeWidth={1.8}
                        />

                      </div>


                      <div>

                        <strong>
                          Task progress
                        </strong>

                        <p>
                          {todoTasks.length}{" "}
                          tasks currently waiting
                          to be completed
                        </p>

                      </div>


                      <time>
                        {totalTasks} total
                      </time>

                    </div>

                  </section>

                </>
              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
}


export default Dashboard;