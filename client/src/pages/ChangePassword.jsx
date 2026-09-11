import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import { changePassword } from "../services/authService";


const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.oldPassword) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    if (!formData.newPassword) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (formData.newPassword.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (
      formData.oldPassword ===
      formData.newPassword
    ) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        oldPassword:
          formData.oldPassword,

        newPassword:
          formData.newPassword,
      });

      setSuccess(
        "Password changed successfully."
      );

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error(
        "Failed to change password:",
        err
      );

      setError(
        err?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="change-password-page">

      <Sidebar />

      <main className="change-password-main">

        <div className="change-password-container">

          <button
            type="button"
            className="change-password-back"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <ArrowLeft
              size={17}
              strokeWidth={1.8}
            />

            Back to Dashboard
          </button>


          <div className="change-password-header">

            <div className="change-password-icon">
              <KeyRound
                size={23}
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h1>
                Change Password
              </h1>

              <p>
                Update your account password.
              </p>
            </div>

          </div>


          {error && (
            <div className="change-password-message error">
              {error}
            </div>
          )}


          {success && (
            <div className="change-password-message success">
              {success}
            </div>
          )}


          <section className="change-password-card">

            <form
              onSubmit={handleSubmit}
              className="change-password-form"
            >

              {/* Current Password */}

              <div className="change-password-group">

                <label htmlFor="oldPassword">
                  Current Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type={
                      showOldPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.oldPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      setShowOldPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showOldPassword
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showOldPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* New Password */}

              <div className="change-password-group">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.newPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showNewPassword
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                <small>
                  Password must be at least 6 characters.
                </small>

              </div>


              {/* Confirm Password */}

              <div className="change-password-group">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              <div className="change-password-actions">

                <button
                  type="button"
                  className="change-password-cancel"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="change-password-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </section>

        </div>

      </main>

    </div>
  );
};


export default ChangePassword;