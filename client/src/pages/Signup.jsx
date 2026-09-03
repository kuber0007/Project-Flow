import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/authService";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Create Account | ProjectFlow";

    const description = document.querySelector(
      'meta[name="description"]'
    );

    if (description) {
      description.setAttribute(
        "content",
        "Create your ProjectFlow account and start managing projects, tasks, and teams."
      );
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      setError(
        error.message || "Unable to create account."
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
              GET STARTED
            </p>

            <h1>
              Create your account
            </h1>

            <p>
              Start organizing your projects in minutes.
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


          {success && (
            <div
              className="auth-success"
              role="status"
            >
              {success}
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>


          <p className="auth-switch">
            Already have an account?

            <Link to="/login">
              Log in
            </Link>
          </p>

        </section>


        <p className="auth-footer-text">
          Simple project management for modern teams.
        </p>

      </div>

    </main>
  );
}

export default Signup;