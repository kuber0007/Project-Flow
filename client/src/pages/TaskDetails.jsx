import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";

import {
  getTask,
  updateTask,
  deleteTask,
  assignTask,
  changeTaskStatus,
  changeTaskPriority,
  setTaskDueDate,
} from "../services/taskService";

import { getProjectMembers } from "../services/projectService";

import {
  addComment,
  getTaskComments,
  deleteComment,
} from "../services/commentService";


/* =========================================================
   GET CURRENT USER
========================================================= */

const getInitialUser = () => {
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


/* =========================================================
   TASK DETAILS
========================================================= */

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  /* =======================================================
     TASK
  ======================================================= */

  const [task, setTask] = useState(null);
  const [members, setMembers] = useState([]);

  /* =======================================================
     LOADING
  ======================================================= */

  const [loading, setLoading] = useState(true);
  const [loadingMembers, setLoadingMembers] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] =
    useState(false);

  /* =======================================================
     ERROR / SUCCESS
  ======================================================= */

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =======================================================
     EDITING
  ======================================================= */

  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [selectedAssignee, setSelectedAssignee] =
    useState("");

  /* =======================================================
     COMMENTS
  ======================================================= */

  const [comments, setComments] =
    useState([]);

  const [commentContent, setCommentContent] =
    useState("");

  const [commentsLoading, setCommentsLoading] =
    useState(false);

  const [commentSubmitting, setCommentSubmitting] =
    useState(false);

  const [deletingCommentId, setDeletingCommentId] =
    useState("");

  const [commentError, setCommentError] =
    useState("");

  /* =======================================================
     GET PROJECT ID
  ======================================================= */

  const getProjectId = (taskData) => {
    if (!taskData?.project) {
      return null;
    }

    if (
      typeof taskData.project ===
      "string"
    ) {
      return taskData.project;
    }

    return (
      taskData.project?._id ||
      null
    );
  };

  /* =======================================================
     GET WORKSPACE ID
  ======================================================= */

  const getWorkspaceId = (project) => {
    if (!project?.workspace) {
      return null;
    }

    if (
      typeof project.workspace ===
      "string"
    ) {
      return project.workspace;
    }

    return (
      project.workspace?._id ||
      null
    );
  };

  /* =======================================================
     GET ASSIGNEE ID
  ======================================================= */

  const getAssigneeId = (
    assignee
  ) => {
    if (!assignee) {
      return "";
    }

    if (
      typeof assignee ===
      "string"
    ) {
      return assignee;
    }

    return (
      assignee?._id ||
      ""
    );
  };

  /* =======================================================
     LOAD TASK
  ======================================================= */

  const loadTask = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getTask(taskId);

      setTask(data);

      setFormData({
        title:
          data?.title || "",
        description:
          data?.description || "",
      });

      setSelectedAssignee(
        getAssigneeId(
          data?.assignee
        )
      );

      return data;
    } catch (err) {
      console.error(
        "Failed to load task:",
        err
      );

      setError(
        err?.message ||
          "Failed to load task"
      );

      return null;
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD PROJECT MEMBERS
  ======================================================= */

  const loadMembers = async (
    taskData
  ) => {
    try {
      const projectId =
        getProjectId(
          taskData
        );

      if (!projectId) {
        return;
      }

      setLoadingMembers(true);

      const result =
        await getProjectMembers(
          projectId
        );

      const memberList =
        Array.isArray(result)
          ? result
          : Array.isArray(
              result?.members
            )
            ? result.members
            : Array.isArray(
                result?.data
              )
              ? result.data
              : [];

      setMembers(
        memberList
      );
    } catch (err) {
      console.error(
        "Failed to load project members:",
        err
      );

      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  /* =======================================================
     LOAD COMMENTS
  ======================================================= */

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentError("");

      const result =
        await getTaskComments(
          taskId
        );

      const commentList =
        Array.isArray(result)
          ? result
          : Array.isArray(
              result?.comments
            )
            ? result.comments
            : Array.isArray(
                result?.data
              )
              ? result.data
              : [];

      setComments(
        commentList
      );
    } catch (err) {
      console.error(
        "Failed to load comments:",
        err
      );

      setComments([]);

      setCommentError(
        err?.message ||
          "Failed to load comments"
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  /* =======================================================
     ADD COMMENT
  ======================================================= */

  const handleAddComment = async (
    event
  ) => {
    event.preventDefault();

    if (
      !commentContent.trim()
    ) {
      setCommentError(
        "Please write a comment first."
      );

      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError("");

      const newComment =
        await addComment(
          taskId,
          commentContent
        );

      if (newComment) {
        setComments(
          (previous) => [
            ...previous,
            newComment,
          ]
        );
      }

      setCommentContent("");

      showSuccess(
        "Comment added successfully"
      );
    } catch (err) {
      console.error(
        "Failed to add comment:",
        err
      );

      setCommentError(
        err?.message ||
          "Failed to add comment"
      );
    } finally {
      setCommentSubmitting(
        false
      );
    }
  };

  /* =======================================================
     DELETE COMMENT
  ======================================================= */

  const handleDeleteComment = async (
    commentId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this comment?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCommentId(
        commentId
      );

      setCommentError("");

      await deleteComment(
        commentId
      );

      setComments(
        (previous) =>
          previous.filter(
            (comment) =>
              comment._id !==
              commentId
          )
      );

      showSuccess(
        "Comment deleted successfully"
      );
    } catch (err) {
      console.error(
        "Failed to delete comment:",
        err
      );

      setCommentError(
        err?.message ||
          "Failed to delete comment"
      );
    } finally {
      setDeletingCommentId("");
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    if (!taskId) {
      return;
    }

    const loadPage =
      async () => {
        const taskData =
          await loadTask();

        if (taskData) {
          await loadMembers(
            taskData
          );

          await loadComments();
        }
      };

    loadPage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  /* =======================================================
     FORMAT VALUE
  ======================================================= */

  const formatValue = (
    value
  ) => {
    if (!value) {
      return "Not available";
    }

    return value
      .replaceAll(
        "_",
        " "
      )
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  /* =======================================================
     DATE INPUT
  ======================================================= */

  const getDateInputValue = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate
      .toISOString()
      .split("T")[0];
  };

  /* =======================================================
     SUCCESS MESSAGE
  ======================================================= */

  const showSuccess = (
    message
  ) => {
    setSuccess(message);

    setTimeout(() => {
      setSuccess("");
    }, 2500);
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleFormChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  /* =======================================================
     SAVE CHANGES
  ======================================================= */

  const handleUpdate = async (
    event
  ) => {
    event.preventDefault();

    if (
      !formData.title.trim()
    ) {
      setError(
        "Task title is required"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      /* ---------- UPDATE BASIC TASK DATA ---------- */

      const updatedTask =
        await updateTask(
          taskId,
          {
            title:
              formData.title.trim(),

            description:
              formData.description.trim(),
          }
        );

      let nextTask = {
        ...task,
        ...(updatedTask || {}),

        title:
          formData.title.trim(),

        description:
          formData.description.trim(),
      };

      /* ---------- UPDATE ASSIGNEE ---------- */

      const currentAssigneeId =
        getAssigneeId(
          task?.assignee
        );

      if (
        selectedAssignee &&
        selectedAssignee !==
          currentAssigneeId
      ) {
        const assignmentResult =
          await assignTask(
            taskId,
            selectedAssignee
          );

        const selectedMember =
          members.find(
            (member) => {
              const memberUserId =
                typeof member.user ===
                "string"
                  ? member.user
                  : member.user?._id;

              return (
                memberUserId ===
                selectedAssignee
              );
            }
          );

        const selectedUser =
          selectedMember?.user ||
          null;

        nextTask = {
          ...nextTask,

          assignee:
            assignmentResult?.assignee ||
            assignmentResult?.data
              ?.assignee ||
            selectedUser || {
              _id:
                selectedAssignee,
            },
        };
      }

      setTask(nextTask);

      setEditing(false);

      showSuccess(
        "Task updated successfully"
      );
    } catch (err) {
      console.error(
        "Failed to save task:",
        err
      );

      setError(
        err?.message ||
          "Failed to save task"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     STATUS CHANGE
  ======================================================= */

  const handleStatusChange =
    async (event) => {
      const status =
        event.target.value;

      try {
        setSaving(true);
        setError("");

        await changeTaskStatus(
          taskId,
          status
        );

        setTask(
          (previous) => ({
            ...previous,
            status,
          })
        );

        showSuccess(
          "Status updated"
        );
      } catch (err) {
        console.error(
          "Failed to change status:",
          err
        );

        setError(
          err?.message ||
            "Failed to change status"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     PRIORITY CHANGE
  ======================================================= */

  const handlePriorityChange =
    async (event) => {
      const priority =
        event.target.value;

      try {
        setSaving(true);
        setError("");

        await changeTaskPriority(
          taskId,
          priority
        );

        setTask(
          (previous) => ({
            ...previous,
            priority,
          })
        );

        showSuccess(
          "Priority updated"
        );
      } catch (err) {
        console.error(
          "Failed to change priority:",
          err
        );

        setError(
          err?.message ||
            "Failed to change priority"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     DUE DATE CHANGE
  ======================================================= */

  const handleDueDateChange =
    async (event) => {
      const dueDate =
        event.target.value ||
        null;

      try {
        setSaving(true);
        setError("");

        await setTaskDueDate(
          taskId,
          dueDate
        );

        setTask(
          (previous) => ({
            ...previous,
            dueDate,
          })
        );

        showSuccess(
          "Due date updated"
        );
      } catch (err) {
        console.error(
          "Failed to change due date:",
          err
        );

        setError(
          err?.message ||
            "Failed to change due date"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =======================================================
     DELETE TASK
  ======================================================= */

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete this task?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleting(true);
        setError("");

        await deleteTask(
          taskId
        );

        const projectId =
          getProjectId(task);

        if (projectId) {
          navigate(
            `/projects/${projectId}`
          );
        } else {
          navigate(
            "/projects"
          );
        }
      } catch (err) {
        console.error(
          "Failed to delete task:",
          err
        );

        setError(
          err?.message ||
            "Failed to delete task"
        );

        setDeleting(false);
      }
    };

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const handleCancelEdit =
    () => {
      setEditing(false);

      setFormData({
        title:
          task?.title || "",

        description:
          task?.description ||
          "",
      });

      setSelectedAssignee(
        getAssigneeId(
          task?.assignee
        )
      );

      setError("");
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="task-details-loading">

        <div className="task-details-loader" />

        <p>
          Loading task...
        </p>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !task) {
    return (
      <div className="task-details-error-page">

        <div className="task-details-error-card">

          <h2>
            Unable to load task
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/projects"
              )
            }
          >
            ← Back to Projects
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     NO TASK
  ======================================================= */

  if (!task) {
    return (
      <div className="task-details-error-page">

        <div className="task-details-error-card">

          <h2>
            Task not found
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/projects"
              )
            }
          >
            ← Back to Projects
          </button>

        </div>

      </div>
    );
  }

  const projectId =
    getProjectId(task);

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="task-details-page">

      <main className="task-details-main">

        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          className="task-details-back"
          onClick={() =>
            projectId
              ? navigate(
                  `/projects/${projectId}`
                )
              : navigate(
                  "/projects"
                )
          }
        >
          ← Back to Project
        </button>


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="task-details-success">
            {success}
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="task-details-inline-error">
            {error}
          </div>
        )}


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="task-details-header">

          <div>

            <span className="task-details-label">
              TASK DETAILS
            </span>

            {editing ? (
              <input
                className="task-details-title-input"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleFormChange
                }
                disabled={saving}
              />
            ) : (
              <h1>
                {task.title ||
                  "Untitled Task"}
              </h1>
            )}

            {editing ? (
              <textarea
                className="task-details-description-input"
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleFormChange
                }
                rows="4"
                disabled={saving}
              />
            ) : (
              <p>
                {task.description ||
                  "No description has been added to this task."}
              </p>
            )}

          </div>

        </div>


        {/* =================================================
            STATUS / PRIORITY / DATE
        ================================================= */}

        <div className="task-details-grid">

          <div className="task-details-card">

            <span>
              Status
            </span>

            <select
              value={
                task.status ||
                "TODO"
              }
              onChange={
                handleStatusChange
              }
              disabled={saving}
            >
              <option value="TODO">
                To Do
              </option>

              <option value="IN_PROGRESS">
                In Progress
              </option>

              <option value="REVIEW">
                Review
              </option>

              <option value="DONE">
                Done
              </option>
            </select>

          </div>


          <div className="task-details-card">

            <span>
              Priority
            </span>

            <select
              value={
                task.priority ||
                "MEDIUM"
              }
              onChange={
                handlePriorityChange
              }
              disabled={saving}
            >
              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

              <option value="URGENT">
                Urgent
              </option>
            </select>

          </div>


          <div className="task-details-card">

            <span>
              Due Date
            </span>

            <input
              type="date"
              value={
                getDateInputValue(
                  task.dueDate
                )
              }
              onChange={
                handleDueDateChange
              }
              disabled={saving}
            />

          </div>

        </div>


        {/* =================================================
            TASK INFORMATION
        ================================================= */}

        <section className="task-details-section">

          <div className="task-details-section-header">

            <h2>
              Task Information
            </h2>

          </div>


          <div className="task-details-information">

            <div>
              <span>
                Task ID
              </span>

              <strong>
                {task._id}
              </strong>
            </div>


            <div>
              <span>
                Status
              </span>

              <strong>
                {formatValue(
                  task.status
                )}
              </strong>
            </div>


            <div>
              <span>
                Priority
              </span>

              <strong>
                {formatValue(
                  task.priority
                )}
              </strong>
            </div>


            <div>
              <span>
                Due Date
              </span>

              <strong>
                {formatDate(
                  task.dueDate
                )}
              </strong>
            </div>


            <div>
              <span>
                Created
              </span>

              <strong>
                {formatDate(
                  task.createdAt
                )}
              </strong>
            </div>


            <div>
              <span>
                Updated
              </span>

              <strong>
                {formatDate(
                  task.updatedAt
                )}
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            ASSIGNEE
        ================================================= */}

        <section className="task-details-section">

          <div className="task-details-section-header">

            <h2>
              Assignee
            </h2>

          </div>


          {/* NORMAL MODE */}

          {!editing && (
            <div className="task-details-assignee">

              {task.assignee ? (
                <>
                  <div className="task-details-avatar">

                    {(
                      task.assignee.name ||
                      task.assignee.email ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </div>


                  <div>

                    <strong>
                      {task.assignee.name ||
                        task.assignee.email ||
                        "Assigned User"}
                    </strong>

                    {task.assignee.email && (
                      <p>
                        {
                          task.assignee.email
                        }
                      </p>
                    )}

                  </div>
                </>
              ) : (
                <p>
                  No user assigned to this task.
                </p>
              )}

            </div>
          )}


          {/* EDIT MODE */}

          {editing && (
            <div className="task-details-assignee-control">

              <label htmlFor="assignee">
                Assign Task To
              </label>


              <select
                id="assignee"
                value={
                  selectedAssignee
                }
                onChange={(event) =>
                  setSelectedAssignee(
                    event.target.value
                  )
                }
                disabled={
                  loadingMembers ||
                  saving
                }
              >

                <option value="">
                  {loadingMembers
                    ? "Loading project members..."
                    : "Select a member"}
                </option>


                {members.map(
                  (member) => {
                    const user =
                      typeof member.user ===
                      "object"
                        ? member.user
                        : null;

                    const userId =
                      typeof member.user ===
                      "string"
                        ? member.user
                        : user?._id;

                    if (!userId) {
                      return null;
                    }

                    return (
                      <option
                        key={
                          userId
                        }
                        value={
                          userId
                        }
                      >
                        {user?.name ||
                          user?.email ||
                          "Workspace Member"}
                      </option>
                    );
                  }
                )}

              </select>

            </div>
          )}

        </section>


        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="task-details-actions">

          {!editing ? (
            <button
              type="button"
              className="task-details-edit-button"
              onClick={() => {
                setEditing(true);
                setError("");

                setFormData({
                  title:
                    task.title ||
                    "",

                  description:
                    task.description ||
                    "",
                });

                setSelectedAssignee(
                  getAssigneeId(
                    task.assignee
                  )
                );
              }}
            >
              Edit Task
            </button>
          ) : (
            <>
              <button
                type="button"
                className="task-details-edit-button"
                onClick={
                  handleUpdate
                }
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>


              <button
                type="button"
                className="task-details-cancel-button"
                onClick={
                  handleCancelEdit
                }
                disabled={saving}
              >
                Cancel
              </button>
            </>
          )}


          <button
            type="button"
            className="task-details-delete-button"
            onClick={
              handleDelete
            }
            disabled={deleting}
          >
            {deleting
              ? "Deleting..."
              : "Delete Task"}
          </button>

        </div>


        {/* =================================================
            COMMENTS
        ================================================= */}

        <section className="task-comments-section">

          {/* COMMENTS HEADER */}

          <div className="task-comments-header">

            <div className="task-comments-title">

              <span className="task-comments-icon">

                <MessageCircle
                  size={18}
                  strokeWidth={1.8}
                />

              </span>

              <div>

                <h2>
                  Comments
                </h2>

                <p>
                  {comments.length}{" "}
                  {comments.length ===
                  1
                    ? "comment"
                    : "comments"}
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              ADD COMMENT
          ================================================= */}

          <form
            className="task-comment-form"
            onSubmit={
              handleAddComment
            }
          >

            <textarea
              value={
                commentContent
              }
              onChange={(
                event
              ) =>
                setCommentContent(
                  event.target
                    .value
                )
              }
              placeholder="Write a comment..."
              rows="4"
              disabled={
                commentSubmitting
              }
              maxLength={1000}
            />


            <div className="task-comment-form-footer">

              <span>
                {
                  commentContent.length
                }
                /1000
              </span>


              <button
                type="submit"
                disabled={
                  commentSubmitting ||
                  !commentContent.trim()
                }
              >

                <Send
                  size={15}
                  strokeWidth={2}
                />

                {commentSubmitting
                  ? "Posting..."
                  : "Post Comment"}

              </button>

            </div>

          </form>


          {/* =================================================
              COMMENT ERROR
          ================================================= */}

          {commentError && (
            <div className="task-comments-error">
              {commentError}
            </div>
          )}


          {/* =================================================
              COMMENTS LIST
          ================================================= */}

          <div className="task-comments-list">

            {commentsLoading ? (

              <div className="task-comments-empty">

                <div className="task-comments-spinner" />

                <p>
                  Loading comments...
                </p>

              </div>

            ) : comments.length ===
              0 ? (

              <div className="task-comments-empty">

                <div className="task-comments-empty-icon">

                  <MessageCircle
                    size={24}
                    strokeWidth={1.7}
                  />

                </div>

                <h3>
                  No comments yet
                </h3>

                <p>
                  Start the conversation
                  by adding the first
                  comment.
                </p>

              </div>

            ) : (

              comments.map(
                (comment) => {

                  const commentUser =
                    typeof comment.user ===
                    "object"
                      ? comment.user
                      : null;

                  const commentUserName =
                    commentUser?.name ||
                    commentUser?.email ||
                    "User";

                  const currentUser =
                    getInitialUser();

                  const currentUserId =
                    currentUser?._id ||
                    currentUser?.id;

                  const commentUserId =
                    commentUser?._id ||
                    comment.user;

                  const isOwnComment =
                    String(
                      currentUserId
                    ) ===
                    String(
                      commentUserId
                    );

                  return (
                    <article
                      className="task-comment"
                      key={
                        comment._id
                      }
                    >

                      {/* AVATAR */}

                      <div className="task-comment-avatar">

                        {commentUserName
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      {/* BODY */}

                      <div className="task-comment-body">

                        <div className="task-comment-top">

                          <div>

                            <strong>
                              {
                                commentUserName
                              }
                            </strong>

                            {commentUser?.email && (
                              <span>
                                {
                                  commentUser.email
                                }
                              </span>
                            )}

                          </div>


                          <time>
                            {
                              comment.createdAt
                                ? new Date(
                                    comment.createdAt
                                  ).toLocaleString(
                                    "en-IN",
                                    {
                                      dateStyle:
                                        "medium",

                                      timeStyle:
                                        "short",
                                    }
                                  )
                                : ""
                            }
                          </time>

                        </div>


                        {/* COMMENT TEXT */}

                        <p className="task-comment-content">
                          {
                            comment.content
                          }
                        </p>


                        {/* DELETE */}

                        {isOwnComment && (
                          <button
                            type="button"
                            className="task-comment-delete"
                            onClick={() =>
                              handleDeleteComment(
                                comment._id
                              )
                            }
                            disabled={
                              deletingCommentId ===
                              comment._id
                            }
                          >

                            <Trash2
                              size={13}
                              strokeWidth={1.8}
                            />

                            {deletingCommentId ===
                            comment._id
                              ? "Deleting..."
                              : "Delete"}

                          </button>
                        )}

                      </div>

                    </article>
                  );
                }
              )

            )}

          </div>

        </section>

      </main>

    </div>
  );
};

export default TaskDetails;