import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import {db} from "./config/db";
import authroutes from "./routes/authroutes"
const app = express();

app.use(cors());
app.use(express.json());
app.use(authroutes);
app.use("/uploads", express.static("uploads")); //isso faz expor os uploads
app.listen(3000,()=>{
    console.log("Server init");
})


