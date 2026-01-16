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
  orderRegister,
  getMyOrders,
  getProductByID,
  updateProduct,
  getAllProducts,
  deleteProduct,
  searchUserController,
  GetAllOrders,
  getOrderByIdController,
  updateOrderStatusController,
} from "../controllers/authcontroller";
import { AuthenticateToken } from "../authenticateToken";
import upload from "../config/multer";
import { requireAdmin } from "../authenticateAdminToken";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user-profile", AuthenticateToken, getUser);
router.patch("/user-profile", AuthenticateToken, editUser);
router.post("/adress-register", AuthenticateToken, adressRegister);
router.get("/adresses", AuthenticateToken, getAdress);
router.delete("/delete-adress/:id", AuthenticateToken, deleteAdress);
router.patch("/adress/:id/set-default", AuthenticateToken, setDefaultAdress);
router.get("/products", getProducts);
router.post("/favorite-product", AuthenticateToken, favoriteProduct);
router.get("/favorites", AuthenticateToken, getFavorites);
router.delete("/favorites/:productId", AuthenticateToken, unfavoriteProduct);
router.get("/get-favorite-products", AuthenticateToken, getFavoritesProducts);
router.post("/order", AuthenticateToken, orderRegister);
router.get("/orders/my", AuthenticateToken, getMyOrders);

//Admin routes
router.post("/register-product", upload.single("image"), registerProduct);
router.get(
  "/registered-products",
  AuthenticateToken,
  requireAdmin,
  getAllProducts
);
router.get(
  "/edit-product/:id",
  AuthenticateToken,
  requireAdmin,
  getProductByID
);
router.patch(
  "/edit-product/:id",
  AuthenticateToken,
  requireAdmin,
  upload.single("image"),
  updateProduct
);
router.delete(
  "/delete-product/:id",
  AuthenticateToken,
  requireAdmin,
  deleteProduct
);
router.get(
  "/search-user",
  AuthenticateToken,
  requireAdmin,
  searchUserController
);
router.get("/admin/orders", AuthenticateToken, requireAdmin, GetAllOrders);
router.get(
  "/admin/orders/:id",
  AuthenticateToken,
  requireAdmin,
  getOrderByIdController
);
router.patch(
  "/admin/orders/:id/status",
  AuthenticateToken,
  requireAdmin,
  updateOrderStatusController
);
//o usuario nao pode favoritar nem comprar se nao tiver logado, preciso mandar algum tipo de aviso pra ele
//tenho que tratar melhor os erros, e fazer uma sanitarização
//melhor o UX pra erros , informar o usuario
//limpar carrinho depois de comprar
export default router;
