import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Camera,
  Save,
  Trash2,
  X,
} from "lucide-react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ActionModal from "../components/ActionModal";

import {
  getWorkspaceSettings,
  getWorkspaces,
  updateWorkspaceSettings,
} from "../services/workspaceService";

import apiRequest from "../services/api";

const WorkspaceSettings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const [workspace, setWorkspace] =
    useState(null);

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [logo, setLogo] =
    useState("");

  const [selectedLogo, setSelectedLogo] =
    useState(null);

  const [logoPreview, setLogoPreview] =
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

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [showErrorModal, setShowErrorModal] =
    useState(false);

  const [modalError, setModalError] =
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
     CLEAN PREVIEW URL
  ========================================================= */

  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(
          logoPreview
        );
      }
    };
  }, [logoPreview]);


  /* =========================================================
     SELECT LOGO
  ========================================================= */

  const handleChooseLogo = () => {
    if (
      saving ||
      role === "MEMBER"
    ) {
      return;
    }

    fileInputRef.current?.click();
  };


  const handleLogoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please choose a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Logo image must be 5 MB or smaller."
      );

      event.target.value = "";
      return;
    }

    if (logoPreview) {
      URL.revokeObjectURL(
        logoPreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setSelectedLogo(file);
    setLogoPreview(preview);
    setError("");
    setSuccess("");
  };


  /* =========================================================
     REMOVE SELECTED LOGO
  ========================================================= */

  const handleRemoveSelectedLogo = () => {
    if (logoPreview) {
      URL.revokeObjectURL(
        logoPreview
      );
    }

    setSelectedLogo(null);
    setLogoPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };


  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const handleSave = async (
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
        "Workspace name cannot be empty."
      );
      return;
    }

    if (
      role !== "OWNER" &&
      role !== "ADMIN"
    ) {
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
            logoFile:
              selectedLogo,
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
        updated?.logo || ""
      );

      if (logoPreview) {
        URL.revokeObjectURL(
          logoPreview
        );
      }

      setSelectedLogo(null);
      setLogoPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }

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

      setShowDeleteModal(false);

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Failed to delete workspace:",
        err
      );

      setShowDeleteModal(false);

      setModalError(
        err?.message ||
          "Failed to delete workspace."
      );

      setShowErrorModal(true);

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
              <ArrowLeft size={17} />

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


  /* =========================================================
     DISPLAY LOGO
  ========================================================= */

  const displayedLogo =
    logoPreview || logo;


  return (
    <div className="workspace-settings-page">

      <Sidebar />


      <main className="workspace-settings-main">

        <div className="workspace-settings-container">

          {/* HEADER */}

          <div className="workspace-settings-header">

            <button
              type="button"
              className="workspace-settings-back"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <ArrowLeft size={17} />

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


          {/* MESSAGES */}

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


          {/* GENERAL */}

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

              {/* =================================================
                  WORKSPACE LOGO
              ================================================= */}

              <div className="workspace-logo-upload-section">

                <div className="workspace-logo-preview">

                  {displayedLogo ? (
                    <img
                      src={displayedLogo}
                      alt="Workspace logo"
                    />
                  ) : (
                    <span>
                      {name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "W"}
                    </span>
                  )}

                  {role !== "MEMBER" && (
                    <button
                      type="button"
                      className="workspace-logo-camera"
                      onClick={
                        handleChooseLogo
                      }
                      disabled={saving}
                      aria-label="Choose workspace logo"
                    >
                      <Camera
                        size={15}
                        strokeWidth={1.9}
                      />
                    </button>
                  )}

                </div>


                <div className="workspace-logo-info">

                  <strong>
                    Workspace Logo
                  </strong>

                  <span>
                    Upload an image for your workspace.
                  </span>

                  <small>
                    JPG, PNG or WEBP · Maximum 5 MB
                  </small>


                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleLogoChange
                    }
                    hidden
                  />


                  <div className="workspace-logo-actions">

                    <button
                      type="button"
                      className="workspace-logo-choose-button"
                      onClick={
                        handleChooseLogo
                      }
                      disabled={
                        saving ||
                        role === "MEMBER"
                      }
                    >
                      Choose Logo
                    </button>


                    {selectedLogo && (
                      <button
                        type="button"
                        className="workspace-logo-remove-button"
                        onClick={
                          handleRemoveSelectedLogo
                        }
                        disabled={saving}
                      >
                        <X
                          size={14}
                          strokeWidth={1.8}
                        />

                        Remove Selection
                      </button>
                    )}

                  </div>

                </div>

              </div>


              {selectedLogo && (
                <div className="workspace-logo-selected">

                  <span>
                    Selected:
                  </span>

                  <strong>
                    {selectedLogo.name}
                  </strong>

                </div>
              )}


              {/* NAME */}

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


              {/* DESCRIPTION */}

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


              {/* ACTIONS */}

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
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </section>


          {/* DANGER ZONE */}

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
                onClick={() =>
                  setShowDeleteModal(true)
                }
                disabled={deleting}
              >
                <Trash2 size={16} />

                {deleting
                  ? "Deleting..."
                  : "Delete Workspace"}
              </button>

            </section>
          )}

        </div>


        {/* DELETE CONFIRMATION */}

        <ActionModal
          isOpen={showDeleteModal}
          type="confirm"
          title="Delete Workspace?"
          message={`You're about to permanently delete "${
            workspace?.name ||
            "this workspace"
          }". This action cannot be undone.`}
          confirmText="Delete Workspace"
          cancelText="Cancel"
          onConfirm={handleDelete}
          onClose={() =>
            setShowDeleteModal(false)
          }
          loading={deleting}
        />


        {/* ERROR MODAL */}

        <ActionModal
          isOpen={showErrorModal}
          type="error"
          title="Unable to delete workspace"
          message={modalError}
          onClose={() =>
            setShowErrorModal(false)
          }
        />

      </main>

    </div>
  );
};

export default WorkspaceSettings;