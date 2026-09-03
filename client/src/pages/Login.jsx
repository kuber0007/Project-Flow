import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Login | ProjectFlow";

    const description = document.querySelector(
      'meta[name="description"]'
    );

    if (description) {
      description.setAttribute(
        "content",
        "Log in to ProjectFlow and manage your projects, tasks, and team."
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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.message || "Unable to log in."
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
              WELCOME BACK
            </p>

            <h1>
              Welcome back
            </h1>

            <p>
              Log in to continue managing your projects.
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
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

            </div>


            <div className="form-group">

              <div className="form-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => {}}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

            </div>


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Log In"}
            </button>

          </form>


          <p className="auth-switch">
            Don't have an account?

            <Link to="/signup">
              Create one
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

export default Login;