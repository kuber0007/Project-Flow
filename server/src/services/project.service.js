import Project from "../models/project.model.js";
import ProjectMember from "../models/projectmember.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import { ApiError } from "../utils/ApiError.js";

// 1. Create a project
const createProject = async (workspaceId, userId, { name, description }) => {
    const member = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You don't have access to this Workspace")
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only Owner or Admin can create Project")
    }

    if (!name?.trim()) {
        throw new ApiError(400, "Project name is required");
    }

    const project = await Project.create({
        name: name.trim(),
        description: description?.trim() || "",
        workspace: workspaceId,
        createdBy: userId
    })

    return project
}

// 2. Get workspace projects
const getWorkspacesProjects = async (workspaceId, userId) => {
    const member = await WorkspaceMember.findOne({
        workspace: workspaceId,
        user: userId
    })

    if (!member) {
        throw new ApiError(403, "You don't have access to this workspace")
    }

    const projects = await Project.find({
        workspace: workspaceId
    }).sort({ created: -1 })

    return projects
}

// 3. Get Single Project
const getSingleProject = async (projectId, userId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId,
    });

    if (!member) {
        throw new ApiError(403, "You do not have access to this project");
    }
    return project;
}

// 4. update project
const updateProject = async (projectId, userId, { name, description }) => {
    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only Owner or Admin can update project")
    }

    if (name !== undefined) {
        if (!name.trim()) {
            throw new ApiError(400, "Project name cannot be empty");
        }
        project.name = name.trim();
    }

    if (description !== undefined) {
        project.description = description.trim();
    }
    await project.save();

    return project;
}

// 5. delete project
const deleteProject = async (projectId, userId) => {
    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only Owner or Admin can delete project")
    }

    await Project.findByIdAndDelete(projectId)

    return project;

}

// 6. update Project Members 
const updateProjectMembers = async (projectId, userId, members) => {

    //Basic verification--------------------------------
    const project = await Project.findById(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const member = await WorkspaceMember.findOne({
        workspace: project.workspace,
        user: userId
    })
    if (!member) {
        throw new ApiError(403, "You do not have access to this workspace")
    }

    if (!["OWNER", "ADMIN"].includes(member.role)) {
        throw new ApiError(403, "Only Owner or Admin can update members")
    }
    //----------------------------------------------------------------------

    if (!Array.isArray(members)) {
        throw new ApiError(400, "Members must be an array");
    }

    const workspaceMembers = await WorkspaceMember.find({
        workspace: project.workspace,
        user: { $in: members }
    }).select("user")

    if (workspaceMembers.length !== members.length) {
        throw new ApiError(400, "All project members must belong to workspace")
    }

    await ProjectMember.deleteMany({
        project: projectId
    })

    if (members.length) {
        await ProjectMember.insertMany(
            members.map((memberId) => ({
                project: projectId,
                user: memberId,
            }))
        )
    }

    return ProjectMember.find({
        project: projectId,
    }).populate("user", "name email avatar");
}

export { createProject, getWorkspacesProjects, getSingleProject, updateProject, deleteProject, updateProjectMembers };