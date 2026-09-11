import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { resetPassword } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
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
    setMessage("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!token) {
      setError(
        "Invalid password reset link."
      );
      return;
    }

    if (!formData.password) {
      setError(
        "Please enter a new password."
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(
        token,
        formData.password
      );

      setMessage(
        "Your password has been reset successfully."
      );

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(
        err?.message ||
          "Unable to reset your password."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="auth-page">

      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />

      <div className="auth-container">

        {/* Brand */}
        <Link
          to="/"
          className="auth-brand"
        >
          <span className="auth-brand-icon">
            ✓
          </span>

          <span>
            Project<span>Flow</span>
          </span>
        </Link>


        {/* Card */}
        <section className="auth-card">

          <div className="auth-header">

            <p className="auth-eyebrow">
              PASSWORD RECOVERY
            </p>

            <h1>
              Reset your password
            </h1>

            <p>
              Create a new password for your
              ProjectFlow account.
            </p>

          </div>


          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}


          {message && (
            <div
              className="auth-success"
              role="status"
            >
              {message}
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label htmlFor="password">
                New password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={loading}
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm new password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={loading}
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>

          </form>


          <p className="auth-switch">
            Remember your password?

            <Link to="/login">
              Back to Login
            </Link>
          </p>

        </section>


        <p className="auth-footer-text">
          Secure project management for modern teams.
        </p>

      </div>

    </main>
  );
}

export default ResetPassword;