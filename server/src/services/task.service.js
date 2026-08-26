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
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar")
        .sort({ createdBy: -1 });

    return tasks;
}

// 3. Get Single task
const getSingleTask = async (taskId, userId) => {
    const task = await Task.findById(taskId)
        .populate("assignee", "name email avatar")
        .populate("createdBy", "name email avatar");

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

    return task;
};

// 4. Update Task
const updateTask = async (taskId, userId, { name, description, dueDate }) => {
    const task = await Task.findById(taskId)
    if (!task) {
        throw new ApiError(404, "Task not found")
    }

    const project = await Project.findById(task.project)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(404, "You do not have access to this task")
    }
    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only OWNER or ADMIN can update the task");
    }

    if (title !== undefined) {
        if (!title.trim()) {
            throw new ApiError("Task Title cannot be empty")
        }
        task.title = title.trim();
    }

    if (description !== undefined) {
        task.description = description.trim()
    }

    if (dueDate !== undefined) {
        task.dueDate = dueDate;
    }

    await task.save();

    return task;
}

// 5. Delete Task
const deleteTask = async (taskId, userId) => {
    const task = await Task.findbyId(taskId)
    if (!task) {
        throw new ApiError(400, "Task not found")
    }

    const project = await Project.findById(task.project)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(404, "You do not have access to this task")
    }
    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only OWNER or ADMIN can delete the task");
    }

    await Task.findByIdAndDelete(taskId)

    return task;
}

// 6. Assign Task
const assignTask = async (taskId, userId, assigneeId) => {
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

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(
            403,
            "Only OWNER or ADMIN can assign tasks"
        );
    }

    const assignee = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: assigneeId,
    });
    if (!assignee) {
        throw new ApiError(
            400,
            "Assignee must be a member of the workspace"
        );
    }

    task.assignee = assigneeId;
    await task.save();

    return task.populate("assignee", "name email avatar");
}

// 7. Change Task Status
const changeTaskStatus = async (taskId, userId, status) => {
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

    if (!["TODO", "IN_PROGRESS", "REVIEW", "DONE"].includes(status)) {
        throw new ApiError(400, "Invalid task status");
    }

    task.status = status;
    await task.save();

    return task;
};

// 8. Change Task priority
const changeTaskPriority = async (taskId, userId, priority) => {
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

    if (!["LOW", "MEDIUM", "HIGH", "URGENT"].includes(priority)) {
        throw new ApiError(400, "Invalid task priority");
    }

    task.priority = priority;
    await task.save();

    return task;
};

// 9. Update Due Date 
const setTaskDueDate = async (taskId, userId, dueDate) => {
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

    if (dueDate !== null && isNaN(new Date(dueDate).getTime())) {
        throw new ApiError(400, "Invalid due date");
    }

    task.dueDate = dueDate ? new Date(dueDate) : null;

    await task.save();

    return task;
};

// 10. Search / Filter Tasks
const searchTasks = async (projectId, userId, filters) => {
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found!")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    const query = {
        project: projectId
    }


    if (filters.search) {
        query.$or = [
            { title: { $regex: filters.search, $options: "i" } },
            { description: { $regex: filters.search, $options: "i" } }
        ]
    }

    if(filters.status){
        query.status = filters.status
    }

    if(filters.priority){
        query.priority = filters.priority
    }

    if(filters.assignee){
        query.assignee = filters.assignee
    }

    const tasks = await Task.find(query)
    .populate("assignee","name email avatar")
    .populate("assignee","name email avatar")
    .sort({createdAt:-1})

    return tasks;
}

export {
    createTask, getProjectTasks, getSingleTask, updateTask, deleteTask,
    assignTask, changeTaskStatus, changeTaskPriority, setTaskDueDate, searchTasks
};