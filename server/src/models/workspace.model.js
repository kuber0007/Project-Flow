import mongoose from "mongoose"

const workspaceSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    logo:{
        type: String,
        default:""
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Workspace = mongoose.model("Workspace", workspaceSchema)

export default Workspace