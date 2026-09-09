import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import {
    createProject as createProjectService,
    getWorkspacesProjects as getWorkspacesProjectsService,
    getSingleProject as getSingleProjectService,
    updateProject as updateProjectService,
    deleteProject as deleteProjectService,
    getProjectMembers as getProjectMembersService,
    updateProjectMembers as updateProjectMembersService,
    searchProjects as searchProjectsService
} from "../services/project.service.js";


// 1. Create project
const createProject = asyncHandler(
    async (req, res) => {

        const { workspaceId } =
            req.params;

        const {
            name,
            description,
            status
        } = req.body;

        if (!name?.trim()) {
            throw new ApiError(
                400,
                "Project name is required"
            );
        }

        const project =
            await createProjectService(
                workspaceId,
                req.user._id,
                {
                    name,
                    description,
                    status
                }
            );

        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    project,
                    "Project Create Successfully"
                )
            );
    }
);


// 2. Get workspace projects
const getWorkspacesProjects =
    asyncHandler(
        async (req, res) => {

            const { workspaceId } =
                req.params;

            const projects =
                await getWorkspacesProjectsService(
                    workspaceId,
                    req.user._id
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        projects,
                        "Workspaces Projects Fetched Successfully"
                    )
                );
        }
    );


// 3. Get single project
const getSingleProject =
    asyncHandler(
        async (req, res) => {

            const { projectId } =
                req.params;

            const project =
                await getSingleProjectService(
                    projectId,
                    req.user._id
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        project,
                        "Project Fetched Successfully"
                    )
                );
        }
    );


// 4. Update project
const updateProject =
    asyncHandler(
        async (req, res) => {

            const { projectId } =
                req.params;

            const {
                name,
                description,
                status
            } = req.body;

            const project =
                await updateProjectService(
                    projectId,
                    req.user._id,
                    {
                        name,
                        description,
                        status
                    }
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        project,
                        "Project Updated Successfully!"
                    )
                );
        }
    );


// 5. Delete project
const deleteProject =
    asyncHandler(
        async (req, res) => {

            const { projectId } =
                req.params;

            const project =
                await deleteProjectService(
                    projectId,
                    req.user._id
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        project,
                        "Project Deleted Successfully"
                    )
                );
        }
    );


// 6. Get project members
const getProjectMembers =
    asyncHandler(
        async (req, res) => {

            const { projectId } =
                req.params;

            const members =
                await getProjectMembersService(
                    projectId,
                    req.user._id
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        members,
                        "Project members fetched successfully"
                    )
                );
        }
    );


// 7. Update project members
const updateProjectMembers =
    asyncHandler(
        async (req, res) => {

            const { projectId } =
                req.params;

            const { members } =
                req.body;

            const updatedMembers =
                await updateProjectMembersService(
                    projectId,
                    req.user._id,
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
        }
    );


// 8. Search/query projects
const searchProjects =
    asyncHandler(
        async (req, res) => {

            const { workspaceId } =
                req.params;

            const {
                search,
                status,
                createdBy
            } = req.query;

            const projects =
                await searchProjectsService(
                    workspaceId,
                    req.user._id,
                    {
                        search,
                        status,
                        createdBy
                    }
                );

            return res
                .status(200)
                .json(
                    new ApiResponse(
                        200,
                        projects,
                        "Projects Fetched Successfully"
                    )
                );
        }
    );


export {
    createProject,
    getWorkspacesProjects,
    getSingleProject,
    updateProject,
    deleteProject,
    getProjectMembers,
    updateProjectMembers,
    searchProjects
};