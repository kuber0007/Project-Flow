import Comment from "../models/comment.model.js";
import Task from "../models/task.model.js";
import Project from "../models/project.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import { ApiError } from "../utils/ApiError.js";

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
    .populate("user","name email avatar")
}

export { addComment };
