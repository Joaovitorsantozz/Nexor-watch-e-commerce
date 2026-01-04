import express from "express";
import {register,login, getUser,editUser} from "../controllers/authcontroller"
import { AuthenticateToken } from "../authenticateToken";

const router=express.Router();
router.post("/register", register); 
router.post("/login",login);
router.get("/user-profile",AuthenticateToken,getUser);
router.patch("/user-profile",AuthenticateToken,editUser);
export default router;