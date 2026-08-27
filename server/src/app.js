import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import workspaceRoutes from "./routes/workspace.route.js";
import projectRoutes from "./routes/project.route.js"
import taskRoutes from "./routes/task.route.js";
import commentRoutes from "./routes/comment.route.js"

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health",(req,res)=>{
    res.json({
        status: 400,
        message: "Server is configured and running successfully"
    })
})

app.use("/api/workspaces", workspaceRoutes)
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);

app.use("/api/auth", authRoutes);

export default app;
