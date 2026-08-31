import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required:true
        default: null
    },
    status: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "REVIEW", "DONE"],
        default: "TODO"
    },
    priority: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
        default: "MEDIUM"
    },
    status: {
        type: String,
        enum: ["NOT_STARTED", "ACTIVE", "COMPLETED"],
        default: "NOT_STARTED"
    },
    dueDate: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema)

export default Task;