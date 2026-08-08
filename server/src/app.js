import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/health",(req,res)=>{
    res.json({
        status: 400,
        message: "Server is configured and running successfully"
    })
})

export default app;
