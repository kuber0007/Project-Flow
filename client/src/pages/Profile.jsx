import { useRef, useState } from "react";
import { Camera, ArrowLeft, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ActionModal from "../components/ActionModal";
import { updateAvatar } from "../services/authService";

import "../styles/profile.css";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

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

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(
    getStoredUser()
  );

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [previewUrl, setPreviewUrl] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const [showErrorModal, setShowErrorModal] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const userName =
    user?.name || "User";

  const userEmail =
    user?.email || "";

  const currentAvatar =
    previewUrl || user?.avatar || "";

  const handleChooseImage = () => {
    if (uploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
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

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage(
        "Please choose a JPG, PNG, or WEBP image."
      );

      setShowErrorModal(true);

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        "Image size must be 5 MB or smaller."
      );

      setShowErrorModal(true);

      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl =
      URL.createObjectURL(file);

    setSelectedFile(file);
    setPreviewUrl(newPreviewUrl);
    setSuccessMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage(
        "Please select an image first."
      );

      setShowErrorModal(true);
      return;
    }

    try {
      setUploading(true);
      setSuccessMessage("");

      const updatedUser =
        await updateAvatar(
          selectedFile
        );

      const nextUser =
        updatedUser || {
          ...user,
          avatar: previewUrl,
        };

      setUser(nextUser);

      localStorage.setItem(
        "user",
        JSON.stringify(nextUser)
      );

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedFile(null);
      setPreviewUrl("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMessage(
        "Profile photo updated successfully."
      );

      /*
       * Reloading is intentional here because
       * Sidebar reads the stored user when it mounts.
       */
      window.dispatchEvent(
        new Event("user-updated")
      );

    } catch (err) {
      console.error(
        "Failed to update avatar:",
        err
      );

      setErrorMessage(
        err?.message ||
          "Failed to update profile photo."
      );

      setShowErrorModal(true);
    } finally {
      setUploading(false);
    }
  };

  const handleCancelSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="profile-page">

      <Sidebar active="" />

      <main className="profile-main">

        <div className="profile-topbar">

          <button
            type="button"
            className="profile-back-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft
              size={16}
              strokeWidth={1.8}
            />

            Back to Dashboard
          </button>

        </div>


        <section className="profile-content">

          <div className="profile-heading">

            <span className="profile-eyebrow">
              ACCOUNT
            </span>

            <h1>
              Profile
            </h1>

            <p>
              Manage your profile photo
              and account information.
            </p>

          </div>


          <div className="profile-card">

            <div className="profile-card-header">

              <div>

                <h2>
                  Profile Photo
                </h2>

                <p>
                  Choose a clear photo that
                  represents you across ProjectFlow.
                </p>

              </div>

            </div>


            <div className="profile-photo-area">

              <div className="profile-large-avatar">

                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={`${userName}'s profile`}
                  />
                ) : (
                  <span>
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}

                <button
                  type="button"
                  className="profile-camera-button"
                  onClick={
                    handleChooseImage
                  }
                  disabled={uploading}
                  aria-label="Choose profile photo"
                >
                  <Camera
                    size={17}
                    strokeWidth={1.9}
                  />
                </button>

              </div>


              <div className="profile-photo-info">

                <h3>
                  {userName}
                </h3>

                <p>
                  {userEmail}
                </p>

                <span>
                  JPG, PNG or WEBP · Maximum 5 MB
                </span>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleFileChange
                  }
                  hidden
                />

                <div className="profile-photo-actions">

                  <button
                    type="button"
                    className="profile-upload-button"
                    onClick={
                      handleChooseImage
                    }
                    disabled={uploading}
                  >
                    Choose Photo
                  </button>

                  {selectedFile && (
                    <>
                      <button
                        type="button"
                        className="profile-save-button"
                        onClick={
                          handleUpload
                        }
                        disabled={uploading}
                      >
                        {uploading
                          ? "Uploading..."
                          : "Save Photo"}
                      </button>

                      <button
                        type="button"
                        className="profile-cancel-button"
                        onClick={
                          handleCancelSelection
                        }
                        disabled={uploading}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                </div>

              </div>

            </div>


            {selectedFile && (
              <div className="profile-selected-file">

                <UserRound
                  size={15}
                  strokeWidth={1.8}
                />

                <span>
                  {selectedFile.name}
                </span>

              </div>
            )}


            {successMessage && (
              <div className="profile-success-message">
                {successMessage}
              </div>
            )}

          </div>


          <div className="profile-card profile-account-card">

            <div className="profile-card-header">

              <div>

                <h2>
                  Account Information
                </h2>

                <p>
                  Your basic ProjectFlow account details.
                </p>

              </div>

            </div>


            <div className="profile-account-grid">

              <div className="profile-account-item">

                <span>
                  Name
                </span>

                <strong>
                  {userName}
                </strong>

              </div>


              <div className="profile-account-item">

                <span>
                  Email
                </span>

                <strong>
                  {userEmail || "Not available"}
                </strong>

              </div>

            </div>

          </div>

        </section>


        <ActionModal
          isOpen={showErrorModal}
          type="error"
          title="Unable to update photo"
          message={errorMessage}
          onClose={() =>
            setShowErrorModal(false)
          }
        />

      </main>

    </div>
  );
};

export default Profile;