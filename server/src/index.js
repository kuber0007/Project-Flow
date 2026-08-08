import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERR: ", error)
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at Port: ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB connection Failed!!", err)
})

