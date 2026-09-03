import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Dashboard | ProjectFlow";

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const token = localStorage.getItem("accessToken");

  // Temporary frontend protection.
  // Real security will still come from backend JWT middleware.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const userName = user?.name || "James";

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <Link
          to="/dashboard"
          className="dashboard-brand"
        >
          <span className="dashboard-brand-icon">
            ✓
          </span>

          <span>
            Project<span>Flow</span>
          </span>
        </Link>


        <nav className="dashboard-nav">

          <Link
            to="/dashboard"
            className="dashboard-nav-item active"
          >
            <span>▦</span>
            Dashboard
          </Link>

          <Link
            to="/projects"
            className="dashboard-nav-item"
          >
            <span>□</span>
            Projects
          </Link>

          <Link
            to="/team"
            className="dashboard-nav-item"
          >
            <span>♧</span>
            Team
          </Link>


          <div className="dashboard-task-link">

            <Link
              to="/tasks"
              className="dashboard-nav-item"
            >
              <span>☑</span>
              My Tasks

              <small>3</small>
            </Link>

            <span className="dashboard-arrow">
              ›
            </span>

          </div>

        </nav>


        <div className="sidebar-projects">

          <div className="sidebar-section-title">
            <span>PROJECTS</span>
            <span>→</span>
          </div>

          <Link
            to="/projects/weather-app"
            className="sidebar-project"
          >
            <span className="project-dot blue" />
            Weather App
          </Link>

          <Link
            to="/projects/task-manager"
            className="sidebar-project"
          >
            <span className="project-dot purple" />
            Task Manager App
          </Link>

        </div>


        <div className="sidebar-profile">

          <div className="profile-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <strong>{userName}</strong>
            <span>Admin</span>
          </div>

          <span className="profile-arrow">
            ˅
          </span>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* Top bar */}

        <header className="dashboard-topbar">

          <div className="dashboard-search">

            <span>⌕</span>

            <input
              type="search"
              placeholder="Search projects..."
              aria-label="Search projects"
            />

          </div>


          <div className="dashboard-top-actions">

            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Toggle theme"
            >
              ☼
            </button>

            <button
              type="button"
              className="dashboard-icon-button"
              aria-label="Settings"
            >
              ⚙
            </button>

          </div>

        </header>


        {/* Dashboard content */}

        <div className="dashboard-content-area">

          {/* Heading */}

          <section className="dashboard-heading">

            <div>
              <h1>
                Welcome back, {userName}
              </h1>

              <p>
                Here's what's happening with your projects today.
              </p>
            </div>

            <Link
              to="/projects/new"
              className="new-project-button"
            >
              <span>+</span>
              New Project
            </Link>

          </section>


          {/* ================= STATS ================= */}

          <section className="dashboard-stats-grid">

            <article className="dashboard-stat-card">

              <div className="stat-card-top">
                <span>Total Projects</span>

                <span className="stat-icon blue">
                  □
                </span>
              </div>

              <strong>2</strong>

              <p>
                all projects
              </p>

            </article>


            <article className="dashboard-stat-card">

              <div className="stat-card-top">
                <span>Completed Projects</span>

                <span className="stat-icon green">
                  ✓
                </span>
              </div>

              <strong>0</strong>

              <p>
                of 2 total
              </p>

            </article>


            <article className="dashboard-stat-card">

              <div className="stat-card-top">
                <span>Total Tasks</span>

                <span className="stat-icon purple">
                  ♧
                </span>
              </div>

              <strong>3</strong>

              <p>
                across all projects
              </p>

            </article>


            <article className="dashboard-stat-card">

              <div className="stat-card-top">
                <span>Overdue Tasks</span>

                <span className="stat-icon orange">
                  !
                </span>
              </div>

              <strong>3</strong>

              <p>
                need attention
              </p>

            </article>

          </section>


          {/* ================= MAIN GRID ================= */}

          <section className="dashboard-main-grid">


            {/* Project overview */}

            <div className="dashboard-panel project-overview-panel">

              <div className="panel-header">

                <div>
                  <h2>
                    Project Overview
                  </h2>

                  <p>
                    Track your active projects
                  </p>
                </div>

                <Link to="/projects">
                  View all →
                </Link>

              </div>


              <div className="overview-project">

                <div className="overview-project-info">

                  <div className="project-title-row">

                    <div>
                      <h3>
                        Weather App
                      </h3>

                      <p>
                        Fetch and display weather data using external APIs
                      </p>
                    </div>

                    <span className="status-badge active">
                      ACTIVE
                    </span>

                  </div>

                  <div className="project-meta">
                    <span>◷</span>
                    Jun 30, 2026
                  </div>

                </div>

              </div>


              <div className="overview-project">

                <div className="overview-project-info">

                  <div className="project-title-row">

                    <div>
                      <h3>
                        Task Manager App
                      </h3>

                      <p>
                        Manage daily tasks efficiently
                      </p>
                    </div>

                    <span className="status-badge not-started">
                      NOT STARTED
                    </span>

                  </div>

                  <div className="project-meta">
                    <span>◷</span>
                    Jul 8, 2026
                  </div>

                </div>

              </div>

            </div>


            {/* Right side */}

            <div className="dashboard-side-panels">


              {/* To Do */}

              <div className="dashboard-panel task-panel">

                <div className="panel-header compact">

                  <div className="panel-title-with-icon">
                    <span className="panel-small-icon">
                      ♧
                    </span>

                    <h2>
                      To Do
                    </h2>
                  </div>

                  <span className="task-count green-count">
                    1
                  </span>

                </div>


                <div className="task-card">

                  <h3>
                    Write Unit Testing
                  </h3>

                  <div>
                    <span>
                      MEDIUM priority
                    </span>

                    <span>
                      • Due: 2026-06-17
                    </span>
                  </div>

                </div>

              </div>


              {/* Overdue */}

              <div className="dashboard-panel task-panel">

                <div className="panel-header compact">

                  <div className="panel-title-with-icon">
                    <span className="panel-small-icon warning">
                      !
                    </span>

                    <h2>
                      Overdue
                    </h2>
                  </div>

                  <span className="task-count red-count">
                    3
                  </span>

                </div>


                <div className="overdue-list">

                  <div className="task-card">
                    <h3>
                      Write Unit Testing
                    </h3>

                    <div>
                      <span>
                        MEDIUM priority
                      </span>

                      <span>
                        • Due: 2026-06-17
                      </span>
                    </div>
                  </div>


                  <div className="task-card">
                    <h3>
                      Create Dashboard UI
                    </h3>

                    <div>
                      <span>
                        HIGH priority
                      </span>

                      <span>
                        • Due: 2026-06-30
                      </span>
                    </div>
                  </div>


                  <div className="task-card">
                    <h3>
                      Backend API Setup
                    </h3>

                    <div>
                      <span>
                        HIGH priority
                      </span>

                      <span>
                        • Due: 2026-06-15
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* ================= RECENT ACTIVITY ================= */}

          <section className="dashboard-panel activity-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Recent Activity
                </h2>

                <p>
                  Latest updates from your workspace
                </p>
              </div>

            </div>


            <div className="activity-item">

              <div className="activity-icon">
                ✓
              </div>

              <div>
                <strong>
                  Project updated
                </strong>

                <p>
                  Weather App was updated recently.
                </p>
              </div>

              <time>
                Recently
              </time>

            </div>


            <div className="activity-item">

              <div className="activity-icon purple">
                +
              </div>

              <div>
                <strong>
                  New task created
                </strong>

                <p>
                  A new task was added to Task Manager App.
                </p>
              </div>

              <time>
                Recently
              </time>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;