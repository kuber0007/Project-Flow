import mongoose from "mongoose";

const workspaceInvitationSchema = new mongoose.Schema({
    workspace:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Workspace",
        required: true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER", "VIEWER"],
      default: "MEMBER",
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
},{
    timestamps: true,
})

const WorkspaceInvitation = mongoose.model("WorkspaceInvitation", workspaceInvitationSchema)

export default WorkspaceInvitation;