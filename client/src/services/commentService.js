import apiRequest from "./api";

/* ================= ADD COMMENT ================= */

const addComment = async (
  taskId,
  content
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  if (!content?.trim()) {
    throw new Error(
      "Comment content is required"
    );
  }

  const result = await apiRequest(
    `/comments/task/${taskId}`,
    {
      method: "POST",
      body: JSON.stringify({
        content: content.trim(),
      }),
    }
  );

  return result?.data ?? result;
};


/* ================= GET TASK COMMENTS ================= */

const getTaskComments = async (
  taskId
) => {
  if (!taskId) {
    throw new Error("Task ID is required");
  }

  const result = await apiRequest(
    `/comments/task/${taskId}`
  );

  return result?.data ?? result;
};


/* ================= DELETE COMMENT ================= */

const deleteComment = async (
  commentId
) => {
  if (!commentId) {
    throw new Error(
      "Comment ID is required"
    );
  }

  const result = await apiRequest(
    `/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );

  return result?.data ?? result;
};


export {
  addComment,
  getTaskComments,
  deleteComment,
};