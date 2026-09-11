import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { logoutUser } from "../services/authService";


const getStoredUser = () => {
  const storedUser =
    localStorage.getItem("user");

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


const Sidebar = ({
  active = "",
  projects = [],
  showProjects = false,
  todoCount = 0,
}) => {

  const navigate =
    useNavigate();

  const [
    showProfileMenu,
    setShowProfileMenu,
  ] = useState(false);

  const user =
    getStoredUser();

  const userName =
    user?.name || "User";


  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(
        "Logout failed:",
        err
      );
    } finally {

      localStorage.removeItem(
        "selectedWorkspaceId"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }
  };


  return (
    <aside className="dashboard-sidebar">

      {/* BRAND */}

      <Link
        to="/dashboard"
        className="dashboard-brand"
      >

        <span className="dashboard-brand-icon">
          P
        </span>

        <span>
          Project<span>Flow</span>
        </span>

      </Link>


      {/* NAVIGATION */}

      <nav className="dashboard-nav">

        <Link
          to="/dashboard"
          className={`dashboard-nav-item ${
            active === "dashboard"
              ? "active"
              : ""
          }`}
        >

          <LayoutDashboard
            size={18}
            strokeWidth={1.8}
          />

          <span>
            Dashboard
          </span>

        </Link>


        <Link
          to="/projects"
          className={`dashboard-nav-item ${
            active === "projects"
              ? "active"
              : ""
          }`}
        >

          <FolderKanban
            size={18}
            strokeWidth={1.8}
          />

          <span>
            Projects
          </span>

        </Link>


        <Link
          to="/team"
          className={`dashboard-nav-item ${
            active === "team"
              ? "active"
              : ""
          }`}
        >

          <Users
            size={18}
            strokeWidth={1.8}
          />

          <span>
            Team
          </span>

        </Link>


        <div className="dashboard-task-link">

          <Link
            to="/tasks"
            className={`dashboard-nav-item ${
              active === "tasks"
                ? "active"
                : ""
            }`}
          >

            <CheckSquare
              size={18}
              strokeWidth={1.8}
            />

            <span>
              My Tasks
            </span>

            {todoCount > 0 && (
              <small>
                {todoCount}
              </small>
            )}

          </Link>

          <span className="dashboard-arrow">

            <ChevronRight
              size={15}
              strokeWidth={1.8}
            />

          </span>

        </div>

      </nav>


      {/* PROJECT LIST */}

      {showProjects && (
        <div className="sidebar-projects">

          <div className="sidebar-section-title">

            <span>
              PROJECTS
            </span>

            <Link
              to="/projects"
              aria-label="View all projects"
            >

              <ChevronRight
                size={14}
                strokeWidth={1.8}
              />

            </Link>

          </div>


          {projects.length === 0 ? (

            <div className="sidebar-empty-projects">
              No projects yet
            </div>

          ) : (

            projects
              .slice(0, 5)
              .map(
                (
                  project,
                  index
                ) => (

                  <Link
                    key={
                      project?._id ||
                      index
                    }
                    to={`/projects/${project?._id}`}
                    className="sidebar-project"
                  >

                    <span
                      className={`project-dot ${
                        index % 2 === 0
                          ? "blue"
                          : "purple"
                      }`}
                    />

                    <span className="sidebar-project-name">
                      {project?.name ||
                        "Untitled Project"}
                    </span>

                  </Link>

                )
              )

          )}

        </div>
      )}


      {/* PROFILE */}

      <div className="sidebar-profile-wrapper">

        <button
          type="button"
          className="sidebar-profile"
          onClick={() =>
            setShowProfileMenu(
              (previous) =>
                !previous
            )
          }
        >

          <div className="profile-avatar">

            {userName
              .charAt(0)
              .toUpperCase()}

          </div>


          <div className="profile-info">

            <strong>
              {userName}
            </strong>

            <span>
              Profile
            </span>

          </div>


          <span className="profile-arrow">

            <ChevronDown
              size={15}
              strokeWidth={1.8}
            />

          </span>

        </button>


        {showProfileMenu && (

          <div className="profile-dropdown">

            <div className="profile-dropdown-user">

              <strong>
                {userName}
              </strong>

              <span>
                {user?.email || ""}
              </span>

            </div>


            <button
              type="button"
              className="profile-logout-button"
              onClick={handleLogout}
            >

              <LogOut
                size={15}
                strokeWidth={1.8}
              />

              <span>
                Logout
              </span>

            </button>

          </div>

        )}

      </div>

    </aside>
  );
};


export default Sidebar;