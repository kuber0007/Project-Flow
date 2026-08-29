import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Project from "../models/project.model.js";
import { 
    createProject as createProjectService,
    getWorkspacesProjects as getWorkspacesProjectsService,
    getSingleProject as getSingleProjectService,
    updateProject as updateProjectService,
    deleteProject as deleteProjectService,
    updateProjectMembers as updateProjectMembersService
} from "../services/project.service.js"

// 1. create project
const createProject = asyncHandler(async (req, res) => {
    const { workspaceId } = req.params
    const { name, description } = req.body

    if (!name?.trim()) {
        throw new ApiError(400, "Project name is required");
    }

    const Project = await createProjectService(workspaceId,"6a7725074b6d32df48ceb3a6", { name, description })

    return res
        .status(201)
        .json(
            new ApiResponse(201, Project, "Project Create Successfully")
        )
})

// 2. get Workspace Projects
const getWorkspacesProjects = asyncHandler(async (req, res) => {
    const {workspaceId} = req.params

    const projects = await getWorkspacesProjectsService(workspaceId,"6a7724654b6d32df48ceb3a5")

    return res
    .status(200)
    .json(new ApiResponse(200,projects,"Workspaces Projects Fetched Successfully"))
})

// 3. Get Single Project
const getSingleProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params

    const project = await getSingleProjectService(projectId, "6a7724654b6d32df48ceb3a5")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, project, "Project Fetched Successfully"
        )
    )
})

// 4. Update Project 
const updateProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params
    const {name,description} = req.body

    const project = await updateProjectService(projectId,"6a7724654b6d32df48ceb3a5",{name,description})
    return res
    .status(200)
    .json(
        new ApiResponse(200, project, "Project Updated Successfully!")
    )
})

// 5. delete Project
const deleteProject = asyncHandler(async(req,res)=>{
    const {projectId} = req.params

    const project = await deleteProjectService(projectId, "6a7724654b6d32df48ceb3a5")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, project, "Project Deleted Successfully"
        )
    )

})

// 6. update project Members
const updateProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { members } = req.body;

  const updatedMembers = await updateProjectMembersService(
    projectId,
    "6a7725074b6d32df48ceb3a6",
    members
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMembers,
        "Project members updated successfully"
      )
    );
});

export {
    createProject, 
    getWorkspacesProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    updateProjectMembers
}
