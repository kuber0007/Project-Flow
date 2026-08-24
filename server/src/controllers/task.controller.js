import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { 
    createTask as createTaskService,
    getProjectTasks as getProjectTasksService
 } from "../services/task.service.js";

// 1. Create Task
const createTask = asyncHandler(async(req,res)=>{
    const {projectId} = req.params
    const {title, description, priority, dueDate} = req.body

    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    const task = await createTaskService(projectId, "6a7724654b6d32df48ceb3a5",{title, description, priority, dueDate})

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,task,"Task created Successfully"
        )
    )
})

// 2. Get Project Tasks
const getProjectTasks = asyncHandler(async(req,res)=>{
    const {projectId} = req.params

    const tasks = getProjectTasksService(projectId, "6a7724654b6d32df48ceb3a5")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, "Project Tasks Fetched Successfully"
        )
    )
})

export {createTask}