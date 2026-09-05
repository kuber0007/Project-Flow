import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  getWorkspaces,
} from "../services/workspaceService";

import {
  createProject,
} from "../services/projectService";


/* =========================================================
   HELPER
========================================================= */

const getStoredUser = () => {
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
   CREATE PROJECT
========================================================= */

function CreateProject() {
  const navigate = useNavigate();

  /* =======================================================
     AUTH
  ======================================================= */

  const token =
    localStorage.getItem("accessToken");

  const [user] =
    useState(getStoredUser);


  /* =======================================================
     WORKSPACE
  ======================================================= */

  const [workspaces, setWorkspaces] =
    useState([]);

  const [workspace, setWorkspace] =
    useState(null);

  const [showWorkspaceMenu, setShowWorkspaceMenu] =
    useState(false);


  /* =======================================================
     FORM
  ======================================================= */

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("NOT_STARTED");


  /* =======================================================
     UI
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     PAGE TITLE
  ======================================================= */

  useEffect(() => {
    document.title =
      "Create Project | ProjectFlow";
  }, []);


  /* =======================================================
     LOAD WORKSPACES
  ======================================================= */

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadWorkspaces = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await getWorkspaces();

        if (cancelled) {
          return;
        }

        const memberships =
          Array.isArray(result)
            ? result
            : [];

        setWorkspaces(
          memberships
        );

        const availableWorkspaces =
          memberships
            .map(
              (membership) =>
                membership?.workspace
            )
            .filter(
              (item) => item?._id
            );

        if (
          availableWorkspaces.length === 0
        ) {
          setWorkspace(null);
          return;
        }

        const savedWorkspaceId =
          localStorage.getItem(
            "selectedWorkspaceId"
          );

        const savedWorkspace =
          availableWorkspaces.find(
            (item) =>
              item._id ===
              savedWorkspaceId
          );

        const selectedWorkspace =
          savedWorkspace ||
          availableWorkspaces[0];

        setWorkspace(
          selectedWorkspace
        );

        localStorage.setItem(
          "selectedWorkspaceId",
          selectedWorkspace._id
        );
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
     WORKSPACE CHANGE
  ======================================================= */

  const handleWorkspaceChange = (
    selectedWorkspace
  ) => {
    if (!selectedWorkspace?._id) {
      return;
    }

    setWorkspace(
      selectedWorkspace
    );

    localStorage.setItem(
      "selectedWorkspaceId",
      selectedWorkspace._id
    );

    setShowWorkspaceMenu(false);
  };


  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!workspace?._id) {
      setError(
        "Please select a workspace."
      );

      return;
    }

    if (!name.trim()) {
      setError(
        "Project name is required."
      );

      return;
    }

    try {
      setSubmitting(true);

      const createdProject =
        await createProject({
          workspaceId:
            workspace._id,

          name:
            name.trim(),

          description:
            description.trim(),

          status,
        });

      /*
       * Try to get the new project's ID.
       */

      const projectId =
        createdProject?._id ||
        createdProject?.data?._id;

      /*
       * If backend returns an ID,
       * open the project directly.
       *
       * Otherwise return to projects.
       */

      if (projectId) {
        navigate(
          `/projects/${projectId}`
        );

        return;
      }

      navigate("/projects");
    } catch (err) {
      console.error(
        "Failed to create project:",
        err
      );

      setError(
        err?.message ||
          "Failed to create project"
      );
    } finally {
      setSubmitting(false);
    }
  };


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
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="create-project-loading">

        <div className="create-project-loading-card">

          <div className="projects-loading-spinner" />

          <h2>
            Loading...
          </h2>

          <p>
            Preparing your workspace.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="create-project-page">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="projects-sidebar">

        <Link
          to="/dashboard"
          className="dashboard-brand"
        >
          <span className="dashboard-brand-icon">
            ✓
          </span>

          <span>
            Project<span>Flow</span>
          </span>
        </Link>


        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="dashboard-nav-item"
          >
            <span>
              ▦
            </span>

            Dashboard
          </Link>


          <Link
            to="/projects"
            className="dashboard-nav-item active"
          >
            <span>
              □
            </span>

            Projects
          </Link>


          <Link
            to="/team"
            className="dashboard-nav-item"
          >
            <span>
              ♧
            </span>

            Team
          </Link>


          <Link
            to="/tasks"
            className="dashboard-nav-item"
          >
            <span>
              ☑
            </span>

            My Tasks
          </Link>

        </nav>


        <div className="projects-sidebar-profile">

          <div className="profile-avatar">
            {user?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </div>

          <div className="profile-info">

            <strong>
              {user?.name ||
                "User"}
            </strong>

            <span>
              Profile
            </span>

          </div>

        </div>

      </aside>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="create-project-main">


        {/* TOPBAR */}

        <header className="projects-topbar">

          <div className="projects-breadcrumb">

            <Link to="/projects">
              Projects
            </Link>

            <span>
              /
            </span>

            <strong>
              Create Project
            </strong>

          </div>


          <div className="projects-topbar-right">

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
              >

                <span className="workspace-selector-icon">
                  ◈
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
                  ˅
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
                        membership,
                        index
                      ) => {
                        const item =
                          membership?.workspace;

                        if (
                          !item?._id
                        ) {
                          return null;
                        }

                        const selected =
                          workspace?._id ===
                          item._id;

                        return (
                          <button
                            key={
                              item._id ||
                              index
                            }
                            type="button"
                            className={`workspace-dropdown-item ${
                              selected
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
                                {membership?.role ||
                                  "MEMBER"}
                              </small>

                            </span>


                            {selected && (
                              <span className="workspace-dropdown-check">
                                ✓
                              </span>
                            )}

                          </button>
                        );
                      }
                    )}

                  </div>
                )}

            </div>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="create-project-content">


          {/* HEADER */}

          <section className="create-project-heading">

            <div>

              <Link
                to="/projects"
                className="create-project-back"
              >
                ← Back to Projects
              </Link>

              <h1>
                Create Project
              </h1>

              <p>
                Create a new project in your
                selected workspace.
              </p>

            </div>

          </section>


          {/* ERROR */}

          {error && (
            <div className="create-project-error">

              <span>
                !
              </span>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* NO WORKSPACE */}

          {!workspace ? (
            <section className="create-project-empty">

              <div className="projects-empty-icon">
                ◈
              </div>

              <h2>
                No workspace available
              </h2>

              <p>
                You need a workspace before
                creating a project.
              </p>

              <Link
                to="/dashboard"
                className="projects-create-button"
              >
                Back to Dashboard
              </Link>

            </section>
          ) : (

            /* FORM */

            <form
              className="create-project-form"
              onSubmit={
                handleSubmit
              }
            >

              {/* PROJECT NAME */}

              <div className="form-field">

                <label htmlFor="project-name">
                  Project Name
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="project-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Website Redesign"
                  maxLength={100}
                  disabled={submitting}
                />

                <small>
                  Give your project a clear,
                  recognizable name.
                </small>

              </div>


              {/* DESCRIPTION */}

              <div className="form-field">

                <label htmlFor="project-description">
                  Description
                </label>

                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe what this project is about..."
                  rows={5}
                  maxLength={1000}
                  disabled={submitting}
                />

                <small>
                  Add some context so your team
                  knows what this project is about.
                </small>

              </div>


              {/* STATUS */}

              <div className="form-field">

                <label htmlFor="project-status">
                  Status
                </label>

                <select
                  id="project-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value
                    )
                  }
                  disabled={submitting}
                >

                  <option value="NOT_STARTED">
                    Not Started
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                </select>

              </div>


              {/* SELECTED WORKSPACE */}

              <div className="create-project-workspace">

                <div className="create-project-workspace-icon">
                  ◈
                </div>

                <div>

                  <small>
                    Creating in workspace
                  </small>

                  <strong>
                    {workspace.name}
                  </strong>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="create-project-actions">

                <Link
                  to="/projects"
                  className="create-project-cancel"
                >
                  Cancel
                </Link>


                <button
                  type="submit"
                  className="projects-create-button"
                  disabled={
                    submitting ||
                    !name.trim()
                  }
                >

                  {submitting ? (
                    <>
                      <span className="create-project-button-spinner" />

                      Creating...
                    </>
                  ) : (
                    <>
                      <span>
                        +
                      </span>

                      Create Project
                    </>
                  )}

                </button>

              </div>

            </form>
          )}

        </div>

      </main>

    </div>
  );
}

export default CreateProject;