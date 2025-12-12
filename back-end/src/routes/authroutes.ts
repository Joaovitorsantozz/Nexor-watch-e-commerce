import express from "express";
import {register,login, getUser} from "../controllers/authcontroller"
import { AuthenticateToken } from "../authenticateToken";

const router=express.Router();
router.post("/register", register); 
router.post("/login",login);
router.get("/user-profile",AuthenticateToken,getUser);
export default router;