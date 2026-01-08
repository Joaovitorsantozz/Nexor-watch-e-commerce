import express from "express";
import {
  register,
  login,
  getUser,
  editUser,
  adressRegister,
  getAdress,
  deleteAdress,
  setDefaultAdress,
  registerProduct,
  getProducts,
  favoriteProduct,
  getFavorites,
  unfavoriteProduct,
  getFavoritesProducts,
} from "../controllers/authcontroller";
import { AuthenticateToken } from "../authenticateToken";
import upload from "../config/multer";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/user-profile", AuthenticateToken, getUser);
router.patch("/user-profile", AuthenticateToken, editUser);
router.post("/adress-register", AuthenticateToken, adressRegister);
router.get("/adresses", AuthenticateToken, getAdress);
router.delete("/delete-adress/:id", AuthenticateToken, deleteAdress);
router.patch("/adress/:id/set-default", AuthenticateToken, setDefaultAdress);
router.post("/register-product", upload.single("image"), registerProduct);
router.get("/products",getProducts);

router.post("/favorite-product",AuthenticateToken,favoriteProduct);
router.get("/favorites", AuthenticateToken, getFavorites);
router.delete("/favorites/:productId", AuthenticateToken, unfavoriteProduct);
router.get("/get-favorite-products",AuthenticateToken,getFavoritesProducts);
export default router;
