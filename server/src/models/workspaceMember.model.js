import mongoose from "mongoose";
import Workspace from "./workspace.model.js";
import User from "./user.model.js";

const workspaceMemberSchema = new mongoose.Schema({
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        enum:["OWNER","ADMIN","MEMBER","VIEWER"],
        default:"MEMBER"
    }
},{timestamps:true})

workspaceMemberSchema.index(
  { workspace: 1, user: 1 },
  { unique: true }
);

const WorkspaceMember = mongoose.model("WorkspaceMember",workspaceMemberSchema)

export default WorkspaceMember;