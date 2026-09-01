import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is required!"],
        trim:true
    },
    description:{
        type:String,
        trim:true,
        default:""
    },
    workspace:{
        type: Schema.Types.ObjectId,
        ref:"Workspace",
        required: true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    status: {
        type: String,
        enum: ["NOT_STARTED", "ACTIVE", "COMPLETED"],
        default: "NOT_STARTED"
    }
},{timestamps:true})

const Project = mongoose.model("Project",projectSchema)

export default Project