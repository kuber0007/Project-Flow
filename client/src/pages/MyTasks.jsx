import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckSquare,
  Circle,
  FolderKanban,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import { getWorkspaces } from "../services/workspaceService";
import { getWorkspaceProjects } from "../services/projectService";
import { searchTasks } from "../services/taskService";


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


const formatStatus = (status) => {
  switch (status) {
    case "TODO":
      return "To Do";

    case "IN_PROGRESS":
      return "In Progress";

    case "IN_REVIEW":
      return "In Review";

    case "COMPLETED":
      return "Completed";

    default:
      return status || "To Do";
  }
};


const formatPriority = (priority) => {
  if (!priority) {
    return "Medium";
  }

  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1).toLowerCase()
  );
};


const formatDate = (date) => {
  if (!date) {
    return "No due date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "No due date";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};


function MyTasks() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("accessToken");

  const user = getStoredUser();

  const userId =
    user?._id || user?.id;

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(Boolean(token));

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");


  useEffect(() => {
    document.title =
      "My Tasks | ProjectFlow";
  }, []);


  useEffect(() => {
    if (!token || !userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadMyTasks = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * Get all workspaces available to the user.
         */
        const workspaceResult =
          await getWorkspaces();

        if (cancelled) {
          return;
        }

        const workspaceList =
          Array.isArray(workspaceResult)
            ? workspaceResult
            : Array.isArray(
                workspaceResult?.workspaces
              )
              ? workspaceResult.workspaces
              : [];


        /*
         * Get projects from every workspace.
         */
        const workspaceProjects =
          await Promise.all(
            workspaceList.map(
              async (workspace) => {
                if (!workspace?._id) {
                  return [];
                }

                try {
                  const result =
                    await getWorkspaceProjects(
                      workspace._id
                    );

                  const projects =
                    Array.isArray(result)
                      ? result
                      : Array.isArray(
                          result?.projects
                        )
                        ? result.projects
                        : [];

                  return projects.map(
                    (project) => ({
                      ...project,
                      workspaceName:
                        workspace.name,
                    })
                  );
                } catch (err) {
                  console.error(
                    `Failed to load projects for workspace ${workspace._id}:`,
                    err
                  );

                  return [];
                }
              }
            )
          );


        const projects =
          workspaceProjects.flat();


        /*
         * Search tasks assigned to the
         * currently logged-in user.
         */
        const taskResults =
          await Promise.all(
            projects.map(
              async (project) => {
                if (!project?._id) {
                  return [];
                }

                try {
                  const result =
                    await searchTasks(
                      project._id,
                      {
                        assignee: userId,
                      }
                    );

                  const projectTasks =
                    Array.isArray(result)
                      ? result
                      : Array.isArray(
                          result?.tasks
                        )
                        ? result.tasks
                        : [];

                  return projectTasks.map(
                    (task) => ({
                      ...task,
                      projectName:
                        project.name ||
                        "Untitled Project",
                      workspaceName:
                        project.workspaceName ||
                        "",
                    })
                  );
                } catch (err) {
                  console.error(
                    `Failed to load tasks for project ${project._id}:`,
                    err
                  );

                  return [];
                }
              }
            )
          );


        if (cancelled) {
          return;
        }

        setTasks(
          taskResults.flat()
        );

      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to load my tasks:",
            err
          );

          setError(
            err.message ||
            "Failed to load your tasks."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };


    loadMyTasks();


    return () => {
      cancelled = true;
    };
  }, [token, userId]);


  const filteredTasks =
    tasks.filter((task) => {
      if (!search.trim()) {
        return true;
      }

      const searchValue =
        search.toLowerCase();

      return (
        task?.title
          ?.toLowerCase()
          .includes(searchValue) ||
        task?.description
          ?.toLowerCase()
          .includes(searchValue) ||
        task?.projectName
          ?.toLowerCase()
          .includes(searchValue)
      );
    });


  const todoCount =
    tasks.filter(
      (task) =>
        task.status !== "COMPLETED"
    ).length;


  if (!token) {
    return (
      <div className="my-tasks-auth-message">
        <h2>Please log in to view your tasks.</h2>

        <button
          type="button"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }


  return (
    <div className="my-tasks-page">

      <Sidebar
        active="tasks"
        todoCount={todoCount}
      />


      <main className="my-tasks-main">

        <div className="my-tasks-container">

          <div className="my-tasks-header">

            <div>
              <div className="my-tasks-title-row">
                <span className="my-tasks-title-icon">
                  <CheckSquare
                    size={22}
                    strokeWidth={1.8}
                  />
                </span>

                <h1>My Tasks</h1>
              </div>

              <p>
                Tasks assigned to you across your projects.
              </p>
            </div>

          </div>


          <div className="my-tasks-toolbar">

            <div className="my-tasks-search">

              <Search
                size={17}
                strokeWidth={1.8}
              />

              <input
                type="text"
                placeholder="Search your tasks..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

            <div className="my-tasks-count">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1
                ? "task"
                : "tasks"}
            </div>

          </div>


          {loading && (
            <div className="my-tasks-state">
              Loading your tasks...
            </div>
          )}


          {!loading && error && (
            <div className="my-tasks-state error">
              {error}
            </div>
          )}


          {!loading &&
            !error &&
            filteredTasks.length === 0 && (
              <div className="my-tasks-empty">

                <div className="my-tasks-empty-icon">
                  <CheckSquare
                    size={28}
                    strokeWidth={1.6}
                  />
                </div>

                <h3>
                  {search
                    ? "No matching tasks"
                    : "No tasks assigned to you"}
                </h3>

                <p>
                  {search
                    ? "Try a different search."
                    : "Tasks assigned to you will appear here."}
                </p>

              </div>
            )}


          {!loading &&
            !error &&
            filteredTasks.length > 0 && (

              <div className="my-tasks-list">

                {filteredTasks.map(
                  (task, index) => (

                    <button
                      type="button"
                      className="my-task-card"
                      key={
                        task?._id ||
                        `${task?.title}-${index}`
                      }
                      onClick={() =>
                        navigate(
                          `/tasks/${task._id}`
                        )
                      }
                    >

                      <div className="my-task-main">

                        <div className="my-task-status-icon">
                          <Circle
                            size={16}
                            strokeWidth={1.8}
                          />
                        </div>

                        <div className="my-task-content">

                          <h3>
                            {task?.title ||
                              "Untitled Task"}
                          </h3>

                          <div className="my-task-project">

                            <FolderKanban
                              size={14}
                              strokeWidth={1.8}
                            />

                            <span>
                              {task?.projectName ||
                                "Untitled Project"}
                            </span>

                            {task?.workspaceName && (
                              <>
                                <span>•</span>

                                <span>
                                  {task.workspaceName}
                                </span>
                              </>
                            )}

                          </div>

                        </div>

                      </div>


                      <div className="my-task-meta">

                        <span
                          className={`my-task-status status-${(
                            task?.status ||
                            "TODO"
                          ).toLowerCase()}`}
                        >
                          {formatStatus(
                            task?.status
                          )}
                        </span>


                        <span
                          className={`my-task-priority priority-${(
                            task?.priority ||
                            "MEDIUM"
                          ).toLowerCase()}`}
                        >
                          {formatPriority(
                            task?.priority
                          )}
                        </span>


                        <span className="my-task-date">

                          <CalendarDays
                            size={14}
                            strokeWidth={1.8}
                          />

                          {formatDate(
                            task?.dueDate
                          )}

                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>
            )}

        </div>

      </main>

    </div>
  );
}


export default MyTasks;