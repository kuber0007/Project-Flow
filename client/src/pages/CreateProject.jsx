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

import Sidebar from "../components/Sidebar";
import WorkspaceDropdown from "../components/WorkspaceDropdown";


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


  /* =======================================================
     WORKSPACE
  ======================================================= */

  const [workspaces, setWorkspaces] =
    useState([]);

  const [workspace, setWorkspace] =
    useState(null);


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
          memberships.filter(
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

      <Sidebar active="projects" />


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

            <WorkspaceDropdown
              workspaces={workspaces}
              workspace={workspace}
              onChange={handleWorkspaceChange}
            />

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