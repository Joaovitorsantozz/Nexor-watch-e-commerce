import express from "express";
import {register,login, getUser,editUser,adressRegister, getAdress, deleteAdress} from "../controllers/authcontroller"
import { AuthenticateToken } from "../authenticateToken";

const router=express.Router();
router.post("/register", register); 
router.post("/login",login);
router.get("/user-profile",AuthenticateToken,getUser);
router.patch("/user-profile",AuthenticateToken,editUser);
router.post("/adress-register",AuthenticateToken,adressRegister);
router.get("/adresses",AuthenticateToken,getAdress);
router.delete("/delete-adress/:id",AuthenticateToken,deleteAdress)
export default router;