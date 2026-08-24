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
    }
},{timestamps:true})

const Project = mongoose.model("Project",projectSchema)

export default Project