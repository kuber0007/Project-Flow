import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Save,
  Trash2,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";

import {
  getWorkspaceSettings,
  getWorkspaces,
  updateWorkspaceSettings,
} from "../services/workspaceService";

import apiRequest from "../services/api";


const WorkspaceSettings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [logo, setLogo] =
    useState("");

  const [role, setRole] =
    useState("MEMBER");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  /* =========================================================
     PAGE TITLE
  ========================================================= */

  useEffect(() => {
    document.title =
      "Workspace Settings | ProjectFlow";
  }, []);


  /* =========================================================
     LOAD SETTINGS
  ========================================================= */

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

        if (!workspaceId) {
          throw new Error(
            "Workspace ID is required."
          );
        }

        const [
          settings,
          workspaces,
        ] = await Promise.all([
          getWorkspaceSettings(
            workspaceId
          ),
          getWorkspaces(),
        ]);

        const workspaceData =
          settings?.workspace ||
          settings?.data ||
          settings;

        if (!workspaceData) {
          throw new Error(
            "Workspace not found."
          );
        }

        setWorkspace(workspaceData);

        setName(
          workspaceData.name || ""
        );

        setDescription(
          workspaceData.description || ""
        );

        setLogo(
          workspaceData.logo || ""
        );

        const selectedWorkspace =
          Array.isArray(workspaces)
            ? workspaces.find(
                (item) =>
                  String(item?._id) ===
                  String(workspaceId)
              )
            : null;

        setRole(
          selectedWorkspace?.role ||
          "MEMBER"
        );

      } catch (err) {
        console.error(
          "Failed to load workspace settings:",
          err
        );

        setError(
          err?.message ||
            "Failed to load workspace settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [workspaceId]);


  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanDescription =
      description.trim();

    const cleanLogo =
      logo.trim();

    if (!cleanName) {
      setError(
        "Workspace name cannot be empty."
      );
      return;
    }

    if (role !== "OWNER" && role !== "ADMIN") {
      setError(
        "Only the workspace owner or admin can update settings."
      );
      return;
    }

    try {
      setSaving(true);

      const updatedWorkspace =
        await updateWorkspaceSettings(
          workspaceId,
          {
            name: cleanName,
            description:
              cleanDescription,
            logo: cleanLogo,
          }
        );

      const updated =
        updatedWorkspace?.workspace ||
        updatedWorkspace?.data ||
        updatedWorkspace;

      setWorkspace(updated);

      setName(
        updated?.name ||
          cleanName
      );

      setDescription(
        updated?.description ||
          cleanDescription
      );

      setLogo(
        updated?.logo ||
          cleanLogo
      );

      setSuccess(
        "Workspace settings updated successfully."
      );

    } catch (err) {
      console.error(
        "Failed to update workspace settings:",
        err
      );

      setError(
        err?.message ||
          "Failed to update workspace settings."
      );
    } finally {
      setSaving(false);
    }
  };


  /* =========================================================
     DELETE WORKSPACE
  ========================================================= */

  const handleDelete = async () => {
    if (role !== "OWNER") {
      setError(
        "Only the workspace owner can delete the workspace."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${workspace?.name || "this workspace"}"? This action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await apiRequest(
        `/workspaces/${workspaceId}`,
        {
          method: "DELETE",
        }
      );

      const selectedWorkspaceId =
        localStorage.getItem(
          "selectedWorkspaceId"
        );

      if (
        String(selectedWorkspaceId) ===
        String(workspaceId)
      ) {
        localStorage.removeItem(
          "selectedWorkspaceId"
        );
      }

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Failed to delete workspace:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete workspace."
      );
    } finally {
      setDeleting(false);
    }
  };


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="workspace-settings-page">
        <Sidebar />

        <main className="workspace-settings-main">
          <div className="workspace-settings-container">
            <div className="workspace-settings-state">
              Loading workspace settings...
            </div>
          </div>
        </main>
      </div>
    );
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (!workspace) {
    return (
      <div className="workspace-settings-page">
        <Sidebar />

        <main className="workspace-settings-main">
          <div className="workspace-settings-container">

            <button
              type="button"
              className="workspace-settings-back"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <ArrowLeft
                size={17}
              />
              Back to Dashboard
            </button>

            <div className="workspace-settings-state error">
              {error ||
                "Workspace not found."}
            </div>

          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="workspace-settings-page">

      <Sidebar />


      <main className="workspace-settings-main">

        <div className="workspace-settings-container">

          {/* Header */}

          <div className="workspace-settings-header">

            <button
              type="button"
              className="workspace-settings-back"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <ArrowLeft
                size={17}
              />
              Back to Dashboard
            </button>

            <div className="workspace-settings-title-row">

              <div className="workspace-settings-icon">
                <BriefcaseBusiness
                  size={23}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h1>
                  Workspace Settings
                </h1>

                <p>
                  Manage your workspace information.
                </p>
              </div>

            </div>

          </div>


          {/* Messages */}

          {error && (
            <div className="workspace-settings-message error">
              {error}
            </div>
          )}

          {success && (
            <div className="workspace-settings-message success">
              {success}
            </div>
          )}


          {/* General settings */}

          <section className="workspace-settings-card">

            <div className="workspace-settings-card-header">

              <div>
                <h2>
                  General
                </h2>

                <p>
                  Update your workspace details.
                </p>
              </div>

              <span
                className={`workspace-role-badge role-${role.toLowerCase()}`}
              >
                {role}
              </span>

            </div>


            <form
              onSubmit={handleSave}
              className="workspace-settings-form"
            >

              {/* Logo */}

              <div className="workspace-logo-section">

                <div className="workspace-logo-preview">

                  {logo ? (
                    <img
                      src={logo}
                      alt="Workspace logo"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <span>
                      {name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "W"}
                    </span>
                  )}

                </div>

                <div className="workspace-logo-info">

                  <strong>
                    Workspace Logo
                  </strong>

                  <span>
                    Enter an image URL for your workspace logo.
                  </span>

                </div>

              </div>


              <div className="workspace-settings-form-group">

                <label htmlFor="workspace-logo">
                  Logo URL
                </label>

                <input
                  id="workspace-logo"
                  type="url"
                  value={logo}
                  onChange={(event) =>
                    setLogo(
                      event.target.value
                    )
                  }
                  placeholder="https://example.com/logo.png"
                  disabled={
                    saving ||
                    role === "MEMBER"
                  }
                />

              </div>


              {/* Name */}

              <div className="workspace-settings-form-group">

                <label htmlFor="workspace-name">
                  Workspace Name
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
                  placeholder="Enter workspace name"
                  maxLength={100}
                  disabled={
                    saving ||
                    role === "MEMBER"
                  }
                  required
                />

              </div>


              {/* Description */}

              <div className="workspace-settings-form-group">

                <label htmlFor="workspace-description">
                  Description
                </label>

                <textarea
                  id="workspace-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe your workspace..."
                  rows={5}
                  maxLength={500}
                  disabled={
                    saving ||
                    role === "MEMBER"
                  }
                />

                <small>
                  {description.length}/500
                </small>

              </div>


              <div className="workspace-settings-actions">

                <button
                  type="button"
                  className="workspace-settings-cancel"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="workspace-settings-save"
                  disabled={
                    saving ||
                    role === "MEMBER"
                  }
                >
                  <Save
                    size={16}
                  />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </section>


          {/* Danger Zone */}

          {role === "OWNER" && (
            <section className="workspace-settings-danger">

              <div>
                <h2>
                  Danger Zone
                </h2>

                <p>
                  Deleting a workspace is permanent and
                  cannot be undone.
                </p>
              </div>

              <button
                type="button"
                className="workspace-delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2
                  size={16}
                />

                {deleting
                  ? "Deleting..."
                  : "Delete Workspace"}
              </button>

            </section>
          )}

        </div>

      </main>

    </div>
  );
};


export default WorkspaceSettings;