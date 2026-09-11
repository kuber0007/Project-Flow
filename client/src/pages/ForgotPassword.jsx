import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(
        email.trim().toLowerCase()
      );

      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err?.message ||
          "Unable to send password reset link."
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
              Forgot your password?
            </h1>

            <p>
              Enter your email and we'll send you
              a link to reset your password.
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

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
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

export default ForgotPassword;