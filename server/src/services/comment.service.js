import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import { ApiError } from "../utils/ApiError.js";

// 1. add comment
const addComment = async (taskId, userId, content) => {
    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not Found")
    }

    const project = await Project.findById(task.project);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId,
    });
    if (!member) {
        throw new ApiError(
            403,
            "You do not have access to this task"
        );
    }

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const comment = await Comment.create({
        task: taskId,
        user: userId,
        content: content.trim(),
    });

    return comment
        .populate("user", "name email avatar")
}

// 2. Get all comments
const getTaskComments = async (taskId, userId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const project = await Project.findById(task.project);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId,
    });

    if (!member) {
        throw new ApiError(
            403,
            "You do not have access to this task"
        );
    }

    const comments = await Comment.find({
        task: taskId,
    })
        .populate("user", "name email avatar")
        .sort({ createdAt: 1 });

    return comments;
};

// 3. Delete Comment
const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError(
      403,
      "You can only delete your own comment"
    );
  }

  await Comment.findByIdAndDelete(commentId);

  return comment;
};

export { addComment, getTaskComments, deleteComment };
