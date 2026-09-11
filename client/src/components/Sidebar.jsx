import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { logoutUser } from "../services/authService";

import { getWorkspaces } from "../services/workspaceService";
import { getWorkspaceProjects } from "../services/projectService";
import { getProjectTasks } from "../services/taskService";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const Sidebar = ({
  active = "",
  projects = [],
  showProjects = false,
}) => {
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myTaskCount, setMyTaskCount] = useState(0);

  const user = getStoredUser();
  const userName = user?.name || "User";

  useEffect(() => {
    const loadMyTaskCount = async () => {
      const token = localStorage.getItem("accessToken");

      const currentUserId =
        user?._id || user?.id;

      if (!token || !currentUserId) {
        setMyTaskCount(0);
        return;
      }

      try {
        const workspaces =
          await getWorkspaces();

        if (!Array.isArray(workspaces)) {
          setMyTaskCount(0);
          return;
        }

        const workspaceProjects =
          await Promise.all(
            workspaces.map(async (workspace) => {
              if (!workspace?._id) {
                return [];
              }

              try {
                const result =
                  await getWorkspaceProjects(
                    workspace._id
                  );

                return Array.isArray(result)
                  ? result
                  : [];
              } catch (error) {
                console.error(
                  `Failed to load projects for workspace ${workspace._id}:`,
                  error
                );

                return [];
              }
            })
          );

        const projects =
          workspaceProjects.flat();

        const taskResults =
          await Promise.all(
            projects.map(async (project) => {
              if (!project?._id) {
                return [];
              }

              try {
                const result =
                  await getProjectTasks(
                    project._id
                  );

                return Array.isArray(result)
                  ? result
                  : [];
              } catch (error) {
                console.error(
                  `Failed to load tasks for project ${project._id}:`,
                  error
                );

                return [];
              }
            })
          );

        const allTasks =
          taskResults.flat();

        const assignedTasks =
          allTasks.filter((task) => {
            const assigneeId =
              task?.assignee?._id ||
              task?.assignee?.id ||
              task?.assignee;

            return (
              String(assigneeId) ===
              String(currentUserId)
            );
          });

        setMyTaskCount(
          assignedTasks.length
        );

      } catch (error) {
        console.error(
          "Failed to load My Tasks count:",
          error
        );

        setMyTaskCount(0);
      }
    };

    loadMyTaskCount();
  }, [user?._id, user?.id]);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("selectedWorkspaceId");
      closeSidebar();
      navigate("/login", { replace: true });
    }
  };

  const handleNavigation = () => {
    closeSidebar();
    setShowProfileMenu(false);
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="mobile-header">
        <Link
          to="/dashboard"
          className="mobile-brand"
          onClick={handleNavigation}
        >
          <span className="mobile-brand-icon">P</span>

          <span className="mobile-brand-text">
            Project<span>Flow</span>
          </span>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={23} strokeWidth={1.8} />
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar ${sidebarOpen ? "sidebar-open" : ""
          }`}
      >
        {/* DESKTOP BRAND / MOBILE BRAND */}
        <Link
          to="/dashboard"
          className="dashboard-brand"
          onClick={handleNavigation}
        >
          <span className="dashboard-brand-icon">P</span>

          <span className="dashboard-brand-text">
            Project<span>Flow</span>
          </span>
        </Link>

        {/* MOBILE CLOSE BUTTON */}
        <button
          type="button"
          className="mobile-sidebar-close"
          onClick={closeSidebar}
          aria-label="Close navigation menu"
        >
          <X size={21} strokeWidth={1.8} />
        </button>

        {/* NAVIGATION */}
        <nav className="dashboard-nav">
          <Link
            to="/dashboard"
            className={`dashboard-nav-item ${active === "dashboard" ? "active" : ""
              }`}
            onClick={handleNavigation}
          >
            <LayoutDashboard size={18} strokeWidth={1.8} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/projects"
            className={`dashboard-nav-item ${active === "projects" ? "active" : ""
              }`}
            onClick={handleNavigation}
          >
            <FolderKanban size={18} strokeWidth={1.8} />
            <span>Projects</span>
          </Link>

          <Link
            to="/team"
            className={`dashboard-nav-item ${active === "team" ? "active" : ""
              }`}
            onClick={handleNavigation}
          >
            <Users size={18} strokeWidth={1.8} />
            <span>Team</span>
          </Link>

          <div className="dashboard-task-link">
            <Link
              to="/tasks"
              className={`dashboard-nav-item ${active === "tasks" ? "active" : ""
                }`}
              onClick={handleNavigation}
            >
              <CheckSquare size={18} strokeWidth={1.8} />

              <span>My Tasks</span>

              <small>{myTaskCount}</small>
            </Link>

            <span className="dashboard-arrow">
              <ChevronRight size={15} strokeWidth={1.8} />
            </span>
          </div>
        </nav>

        {/* PROJECT LIST */}
        {showProjects && (
          <div className="sidebar-projects">
            <div className="sidebar-section-title">
              <span>PROJECTS</span>

              <Link
                to="/projects"
                aria-label="View all projects"
                onClick={handleNavigation}
              >
                <ChevronRight size={14} strokeWidth={1.8} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="sidebar-empty-projects">
                No projects yet
              </div>
            ) : (
              projects.slice(0, 5).map((project, index) => (
                <Link
                  key={project?._id || index}
                  to={`/projects/${project?._id}`}
                  className="sidebar-project"
                  onClick={handleNavigation}
                >
                  <span
                    className={`project-dot ${index % 2 === 0 ? "blue" : "purple"
                      }`}
                  />

                  <span className="sidebar-project-name">
                    {project?.name || "Untitled Project"}
                  </span>
                </Link>
              ))
            )}
          </div>
        )}

        {/* PROFILE */}
        <div className="sidebar-profile-wrapper">
          <button
            type="button"
            className="sidebar-profile"
            onClick={() =>
              setShowProfileMenu((previous) => !previous)
            }
          >
            <div className="profile-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-info">
              <strong>{userName}</strong>
              <span>Profile</span>
            </div>

            <span className="profile-arrow">
              <ChevronDown size={15} strokeWidth={1.8} />
            </span>
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <strong>{userName}</strong>

                <span>{user?.email || ""}</span>
              </div>

              <button
                type="button"
                className="profile-menu-button"
                onClick={() => {
                  setShowProfileMenu(false);
                  closeSidebar();
                  navigate("/change-password");
                }}
              >
                <KeyRound
                  size={15}
                  strokeWidth={1.8}
                />

                <span>Change Password</span>
              </button>

              <button
                type="button"
                className="profile-logout-button"
                onClick={handleLogout}
              >
                <LogOut
                  size={15}
                  strokeWidth={1.8}
                />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;