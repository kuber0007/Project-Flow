import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import WorkspaceDropdown from "../components/WorkspaceDropdown";


import {
  getWorkspaces,
} from "../services/workspaceService";

import {
  getWorkspaceProjects,
  searchProjects,
} from "../services/projectService";


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {
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


const getStatusClass = (status) => {
  switch (status) {
    case "ACTIVE":
      return "active";

    case "COMPLETED":
      return "completed";

    case "NOT_STARTED":
    default:
      return "not-started";
  }
};


const formatStatus = (status) => {
  switch (status) {
    case "NOT_STARTED":
      return "Not Started";

    case "ACTIVE":
      return "Active";

    case "COMPLETED":
      return "Completed";

    default:
      return "Not Started";
  }
};


/* =========================================================
   PROJECTS PAGE
========================================================= */

function Projects() {
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
     PROJECTS
  ======================================================= */

  const [projects, setProjects] =
    useState([]);


  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");


  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  const [loading, setLoading] =
    useState(Boolean(token));

  const [projectsLoading, setProjectsLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =======================================================
     PAGE TITLE
  ======================================================= */

  useEffect(() => {
    document.title =
      "Projects | ProjectFlow";
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

        const workspaceList =
          Array.isArray(result)
            ? result
            : [];

        setWorkspaces(
          workspaceList
        );

        const availableWorkspaces =
          workspaceList.filter(
            (item) => item?._id
          );

        if (
          availableWorkspaces.length === 0
        ) {
          setWorkspace(null);

          localStorage.removeItem(
            "selectedWorkspaceId"
          );

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
     LOAD PROJECTS
  ======================================================= */

  useEffect(() => {
    if (!workspace?._id) {
      return;
    }

    let cancelled = false;

    const loadProjects = async () => {
      try {
        setProjectsLoading(true);
        setError("");

        /*
         * No search/filter:
         * use normal workspace project endpoint.
         */

        if (
          !search.trim() &&
          !status
        ) {
          const result =
            await getWorkspaceProjects(
              workspace._id
            );

          if (cancelled) {
            return;
          }

          setProjects(
            Array.isArray(result)
              ? result
              : []
          );

          return;
        }


        /*
         * Search/filter:
         *
         * GET
         * /api/projects/workspace/:workspaceId/search
         *
         * Supported filters:
         * search
         * status
         * createdBy
         */

        const result =
          await searchProjects(
            workspace._id,
            {
              search:
                search.trim(),
              status,
            }
          );

        if (cancelled) {
          return;
        }

        setProjects(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load projects:",
          err
        );

        setProjects([]);

        setError(
          err?.message ||
          "Failed to load projects"
        );
      } finally {
        if (!cancelled) {
          setProjectsLoading(false);
        }
      }
    };

    /*
     * Small delay so the API isn't called
     * on every single keystroke immediately.
     */

    const timer =
      setTimeout(
        loadProjects,
        search.trim()
          ? 300
          : 0
      );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    workspace,
    search,
    status,
  ]);


  /* =======================================================
     WORKSPACE SWITCH
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

    setSearch("");
    setStatus("");
  };


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
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
     INITIAL LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="projects-loading-page">

        <div className="projects-loading-card">

          <div className="projects-loading-spinner" />

          <h2>
            Loading projects...
          </h2>

          <p>
            Getting your workspace ready.
          </p>

        </div>

      </div>
    );
  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="projects-page">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar
        active="projects"
        projects={projects}
        showProjects
      />


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="projects-main">


        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="projects-topbar">

          <div className="projects-topbar-left">

            <div className="projects-breadcrumb">

              <Link to="/dashboard">
                Dashboard
              </Link>

              <span>
                /
              </span>

              <strong>
                Projects
              </strong>

            </div>

          </div>


          <div className="projects-topbar-right">

            {/* WORKSPACE SELECTOR */}

            <WorkspaceDropdown
              workspaces={workspaces}
              workspace={workspace}
              onChange={handleWorkspaceChange}
            />


            <Link
              to="/dashboard"
              className="projects-dashboard-link"
            >
              Dashboard
            </Link>

          </div>

        </header>


        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="projects-content">


          {/* PAGE HEADING */}

          <section className="projects-heading">

            <div>

              <h1>
                Projects
              </h1>

              <p>
                Manage the projects in your
                current workspace.
              </p>

            </div>


            <Link
              to="/projects/new"
              className="projects-create-button"
            >
              <span>
                +
              </span>

              New Project
            </Link>

          </section>


          {/* ERROR */}

          {error && (
            <div className="projects-error">

              <span>
                !
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
            <section className="projects-empty">

              <div className="projects-empty-icon">
                ◈
              </div>

              <h2>
                No workspace available
              </h2>

              <p>
                You need a workspace before
                you can create projects.
              </p>

            </section>
          ) : (
            <>


              {/* =================================================
                  SEARCH / FILTER BAR
              ================================================= */}

              <section className="projects-toolbar">

                <div className="projects-search">

                  <span>
                    ⌕
                  </span>

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search projects..."
                  />

                  {search && (
                    <button
                      type="button"
                      className="projects-search-clear"
                      onClick={() =>
                        setSearch("")
                      }
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}

                </div>


                <div className="projects-filter">

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    aria-label="Filter projects by status"
                  >

                    <option value="">
                      All statuses
                    </option>

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


                {(search || status) && (
                  <button
                    type="button"
                    className="projects-clear-filters"
                    onClick={
                      handleClearFilters
                    }
                  >
                    Clear filters
                  </button>
                )}

              </section>


              {/* =================================================
                  RESULTS HEADER
              ================================================= */}

              <div className="projects-results-header">

                <div>

                  <strong>
                    {projects.length}
                  </strong>

                  <span>
                    {projects.length === 1
                      ? " project"
                      : " projects"}
                  </span>

                </div>

                {projectsLoading && (
                  <span className="projects-refreshing">
                    Updating...
                  </span>
                )}

              </div>


              {/* =================================================
                  PROJECTS
              ================================================= */}

              {projectsLoading &&
                projects.length === 0 ? (
                <div className="projects-grid-loading">

                  <div className="projects-loading-spinner" />

                  <span>
                    Loading projects...
                  </span>

                </div>
              ) : projects.length ===
                0 ? (
                <section className="projects-empty">

                  <div className="projects-empty-icon">
                    □
                  </div>

                  <h2>
                    No projects found
                  </h2>

                  <p>
                    {search || status
                      ? "Try changing your search or filters."
                      : "Create your first project to get started."}
                  </p>

                  {!search &&
                    !status && (
                      <Link
                        to="/projects/new"
                        className="projects-create-button"
                      >
                        <span>
                          +
                        </span>

                        Create Project
                      </Link>
                    )}

                </section>
              ) : (
                <section className="projects-grid">

                  {projects.map(
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
                        className="project-card"
                      >

                        {/* CARD TOP */}

                        <div className="project-card-top">

                          <div
                            className={`project-card-icon ${index % 2 ===
                              0
                              ? "blue"
                              : "purple"
                              }`}
                          >
                            {project?.name
                              ?.charAt(
                                0
                              )
                              ?.toUpperCase() ||
                              "P"}
                          </div>


                          <span
                            className={`project-card-status ${getStatusClass(
                              project?.status
                            )}`}
                          >
                            {formatStatus(
                              project?.status
                            )}
                          </span>

                        </div>


                        {/* CARD BODY */}

                        <div className="project-card-body">

                          <h2>
                            {project?.name ||
                              "Untitled Project"}
                          </h2>

                          <p>
                            {project?.description ||
                              "No project description available."}
                          </p>

                        </div>


                        {/* CARD FOOTER */}

                        <div className="project-card-footer">

                          <span>
                            ◷
                          </span>

                          <span>
                            Created{" "}
                            {formatDate(
                              project?.createdAt
                            )}
                          </span>

                          <span className="project-card-arrow">
                            →
                          </span>

                        </div>

                      </Link>
                    )
                  )}

                </section>
              )}

            </>
          )}

        </div>

      </main>

    </div>
  );
}

export default Projects;
