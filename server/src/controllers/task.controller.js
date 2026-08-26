import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    createTask as createTaskService,
    getProjectTasks as getProjectTasksService,
    getSingleTask as getSingleTaskService,
    updateTask as updateTaskService,
    deleteTask as deleteTaskService,

    assignTask as assignTaskService,
    changeTaskStatus as changeTaskStatusService,
    changeTaskPriority as changeTaskPriorityService,
    setTaskDueDate as setTaskDueDateService,
    searchTasks as searchTasksService
} from "../services/task.service.js";
import Task from "../models/task.model.js";

// 1. Create Task
const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { title, description, priority, dueDate } = req.body

    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    const task = await createTaskService(projectId, "6a7724654b6d32df48ceb3a5", { title, description, priority, dueDate })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201, task, "Task created Successfully"
            )
        )
})

// 2. Get Project Tasks
const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const tasks = getProjectTasksService(projectId, "6a7724654b6d32df48ceb3a5")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200, "Project Tasks Fetched Successfully"
            )
        )
})

// 3. Get Single task
const getSingleTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    const task = getSingleTaskService(taskId, req.user._id)

    return res
        .status(200)
        .json(new ApiResponse(
            200, task, "Task fetched successfully"
        ))
})

// 4. Update Task
const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { title, description, dueDate } = req.body

    if (title === undefined && description === undefined && dueDate === undefined) {
        throw new ApiError(400, "Atleast one field is required")
    }

    const task = await updateTaskService(taskId, userId, { title, description, dueDate })

    return res
        .status(400)
        .json(
            new ApiResponse(400, "Task Updated Successfully")
        )
})

// 5. Delete Task
const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params

    await deleteTaskService(taskId, "6a7724654b6d32df48ceb3a5")

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Task Deleted Successfully"))
})

// 6. Assign Task 
const assignTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params
    const { assigneeId } = req.body;

    if (!assigneeId) {
        throw new ApiError(400, "Assignee ID is required");
    }

    const task = await assignTaskService(
        taskId,
        "6a7724654b6d32df48ceb3a5",
        assigneeId
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task assigned successfully"
            )
        );

})

// 7. Update Task status
const changeTaskStatus = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!status) {
        throw new ApiError(400, "Status is required");
    }

    const task = await changeTaskStatusService(
        taskId,
        req.user._id,
        status
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task status updated successfully"
            )
        );
});

// 8. Update Task status
const changeTaskPriority = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { priority } = req.body;

    if (!priority) {
        throw new ApiError(400, "Priority is required");
    }

    const task = await changeTaskPriorityService(
        taskId,
        req.user._id,
        priority
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task priority updated successfully"
            )
        );
});

// 9. Set task due date
const setTaskDueDate = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { dueDate } = req.body;

    if (dueDate === undefined) {
        throw new ApiError(400, "Due date is required");
    }

    const task = await setTaskDueDateService(
        taskId,
        req.user._id,
        dueDate
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task due date updated successfully"
            )
        );
})

// 10 Search/filter Tasks
const searchTasks = asyncHandler(async (req,res)=>{
    const {projectId} = req.params
    const {search, status, priority, assignee} = req.query

    const tasks = await searchTasksService(projectId, req.user._id, {search, status, priority, assignee})

    return res
    .status(200)
    .json(
        new ApiResponse(200, tasks, "Tasks searched Successfully")
    )
})




export { createTask, getProjectTasks, getSingleTask, updateTask, 
    deleteTask, assignTask, changeTaskStatus, changeTaskPriority, 
    setTaskDueDate, searchTasks}