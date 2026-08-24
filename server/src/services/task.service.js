import { ApiError } from "../utils/ApiError.js";
import Project from "../models/project.model.js";
import Task from "../models/task.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";

// 1. Create Task
const createTask = async (projectId, userId, { title, description, priority, dueDate }) => {

    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You do not have access to this project")
    }

    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required")
    }

    const task = Task.create({
        title: title.trim(),
        description: description.trim(),
        project: projectId,
        createdBy: userId,
        priority: priority || "MEDIUM",
        dueDate: dueDate || null
    })

    return task;
}

// 2. Get Project Tasks 
const getProjectTasks = async (projectId, userId) => {

    const project = await Project.findById(projectId);
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
            "You do not have access to this project"
        );
    }

    const tasks = await Task.find({
        project: projectId,
    })
    .populate("assignee","name email avatar")
    .populate("createdBy","name email avatar")
    .sort({createdBy:-1});

    return tasks;
}

export { createTask, getProjectTasks };