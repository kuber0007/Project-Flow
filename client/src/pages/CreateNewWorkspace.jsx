import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  FolderKanban,
  LayoutDashboard,
  UsersRound,
} from "lucide-react";

import {
  createWorkspace,
} from "../services/workspaceService";

import "../styles/createWorkspace.css";


/* =========================================================
   GET STORED USER
========================================================= */

const getStoredUser = () => {

  const storedUser =
    localStorage.getItem(
      "user"
    );


  if (!storedUser) {
    return null;
  }


  try {

    return JSON.parse(
      storedUser
    );

  } catch {

    localStorage.removeItem(
      "user"
    );

    return null;
  }
};


/* =========================================================
   CREATE WORKSPACE
========================================================= */

const CreateNewWorkspace = () => {

  const navigate =
    useNavigate();


  /* =======================================================
     AUTH
  ======================================================= */

  const token =
    localStorage.getItem(
      "accessToken"
    );


  const user =
    getStoredUser();


  /* =======================================================
     FORM
  ======================================================= */

  const [name, setName] =
    useState("");


  const [description, setDescription] =
    useState("");


  /* =======================================================
     UI
  ======================================================= */

  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  /* =======================================================
     PAGE TITLE
  ======================================================= */

  useEffect(() => {

    document.title =
      "Create Workspace | ProjectFlow";

  }, []);


  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");
    setSuccess("");


    const cleanName =
      name.trim();


    const cleanDescription =
      description.trim();


    if (!cleanName) {

      setError(
        "Workspace name is required."
      );

      return;
    }


    if (
      cleanName.length <
      2
    ) {

      setError(
        "Workspace name must be at least 2 characters."
      );

      return;
    }


    try {

      setSubmitting(true);


      const workspace =
        await createWorkspace({
          name:
            cleanName,

          description:
            cleanDescription,
        });


      /*
       * Backend returns the newly created
       * workspace inside result.data.
       */

      const workspaceId =
        workspace?._id ||
        workspace?.data?._id;


      if (!workspaceId) {

        throw new Error(
          "Workspace was created but its ID was not returned."
        );
      }


      /*
       * IMPORTANT:
       * Save the REAL workspace ID.
       *
       * Do NOT save WorkspaceMember._id.
       */

      localStorage.setItem(
        "selectedWorkspaceId",
        workspaceId
      );


      setSuccess(
        "Workspace created successfully."
      );


      /*
       * Give the success state a moment
       * to render before moving to dashboard.
       */

      setTimeout(() => {

        navigate(
          "/dashboard",
          {
            replace: true,
          }
        );

      }, 500);


    } catch (err) {

      console.error(
        "Failed to create workspace:",
        err
      );


      setError(
        err?.message ||
        "Failed to create workspace."
      );


    } finally {

      setSubmitting(
        false
      );
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
     PAGE
  ======================================================= */

  return (

    <div className="create-workspace-page">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="create-workspace-sidebar">

        <Link
          to="/dashboard"
          className="create-workspace-brand"
        >

          <span className="create-workspace-brand-icon">
            P
          </span>

          <span>
            Project<span>Flow</span>
          </span>

        </Link>


        <div className="create-workspace-sidebar-label">
          WORKSPACE
        </div>


        <nav className="create-workspace-nav">

          <Link
            to="/dashboard"
            className="create-workspace-nav-item"
          >
            <LayoutDashboard
              size={18}
              strokeWidth={1.9}
            />

            <span>
              Dashboard
            </span>
          </Link>


          <Link
            to="/projects"
            className="create-workspace-nav-item"
          >
            <FolderKanban
              size={18}
              strokeWidth={1.9}
            />

            <span>
              Projects
            </span>
          </Link>


          <Link
            to="/team"
            className="create-workspace-nav-item"
          >
            <UsersRound
              size={18}
              strokeWidth={1.9}
            />

            <span>
              Team
            </span>
          </Link>

        </nav>


        {/* SIDEBAR USER */}

        <div className="create-workspace-sidebar-user">

          <div className="create-workspace-user-avatar">

            {user?.name
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}

          </div>


          <div className="create-workspace-user-info">

            <strong>
              {user?.name ||
                "User"}
            </strong>

            <span>
              {user?.email ||
                "ProjectFlow user"}
            </span>

          </div>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="create-workspace-main">


        {/* TOPBAR */}

        <header className="create-workspace-topbar">

          <Link
            to="/dashboard"
            className="create-workspace-back"
          >

            <ArrowLeft
              size={17}
              strokeWidth={2}
            />

            <span>
              Dashboard
            </span>

          </Link>

        </header>


        {/* CONTENT */}

        <section className="create-workspace-content">


          {/* HEADER */}

          <div className="create-workspace-heading">

            <div className="create-workspace-heading-icon">

              <BriefcaseBusiness
                size={25}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <div className="create-workspace-eyebrow">
                NEW WORKSPACE
              </div>

              <h1>
                Create a workspace
              </h1>

              <p>
                Set up a shared space where
                your projects, tasks and team
                members can work together.
              </p>

            </div>

          </div>


          {/* FORM CARD */}

          <div className="create-workspace-card">


            {/* ERROR */}

            {error && (

              <div className="create-workspace-message error">

                <span>
                  !
                </span>

                <p>
                  {error}
                </p>

              </div>
            )}


            {/* SUCCESS */}

            {success && (

              <div className="create-workspace-message success">

                <CheckCircle2
                  size={17}
                />

                <p>
                  {success}
                </p>

              </div>
            )}


            <form
              onSubmit={
                handleSubmit
              }
              noValidate
            >


              {/* NAME */}

              <div className="create-workspace-field">

                <label htmlFor="workspace-name">
                  Workspace name
                  <span>
                    *
                  </span>
                </label>

                <input
                  id="workspace-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Acme Team"
                  maxLength={80}
                  autoComplete="off"
                  disabled={
                    submitting
                  }
                />

                <small>
                  Choose a clear name your
                  team will recognize.
                </small>

              </div>


              {/* DESCRIPTION */}

              <div className="create-workspace-field">

                <label htmlFor="workspace-description">
                  Description
                </label>

                <textarea
                  id="workspace-description"
                  value={
                    description
                  }
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="What is this workspace used for?"
                  maxLength={500}
                  disabled={
                    submitting
                  }
                />

                <div className="create-workspace-character-count">
                  {description.length}/500
                </div>

              </div>


              {/* PREVIEW */}

              <div className="create-workspace-preview">

                <div className="create-workspace-preview-icon">

                  <BriefcaseBusiness
                    size={20}
                    strokeWidth={1.8}
                  />

                </div>


                <div>

                  <span>
                    WORKSPACE PREVIEW
                  </span>

                  <strong>
                    {name.trim() ||
                      "Your workspace"}
                  </strong>

                  <p>
                    {description.trim() ||
                      "Your workspace description will appear here."}
                  </p>

                </div>

              </div>


              {/* ACTIONS */}

              <div className="create-workspace-actions">

                <Link
                  to="/dashboard"
                  className="create-workspace-cancel"
                >
                  Cancel
                </Link>


                <button
                  type="submit"
                  className="create-workspace-submit"
                  disabled={
                    submitting
                  }
                >

                  {submitting ? (

                    <>
                      <span className="create-workspace-spinner" />

                      Creating...
                    </>

                  ) : (

                    <>
                      <BriefcaseBusiness
                        size={17}
                        strokeWidth={2}
                      />

                      Create Workspace
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>


          {/* INFO */}

          <div className="create-workspace-info">

            <CheckCircle2
              size={17}
            />

            <span>
              You will automatically become
              the <strong>Owner</strong> of
              this workspace.
            </span>

          </div>

        </section>

      </main>

    </div>
  );
};


export default CreateNewWorkspace;