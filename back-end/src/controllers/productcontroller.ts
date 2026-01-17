import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import {
  registerProductService,
  getProductsService,
  getAllProductsService,
  favoriteProductService,
  getFavoritesService,
  unfavoriteProductService,
  getFavoritesProductsService,
  getProductByIdService,
} from "../services/productservice";

export async function registerProduct(req: Request, res: Response) {
  try {
    const { name, description, price, stock, active } = req.body;
    const image = req.file;

    if (
      !name ||
      !description ||
      price == undefined ||
      stock == undefined ||
      !image
    ) {
      return res.status(400).json({ message: "campos faltando" });
    }
    const imageUrl = image ? `/uploads/${image.filename}` : null;
    const isActive = active === "true";
    const result = await registerProductService(
      name,
      description,
      Number(price),
      Number(stock),
      imageUrl,
      isActive
    );
    if (!result) {
      res.status(400).json({ message: "Erro ao cadastrar", sucessfull: false });
    }
    res.status(201).json({ message: "Produto cadastrado" });
  } catch (error) {
    console.log("Erro para cadastrar produtos be", error);
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const result = await getProductsService();
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao buscar produtos" });
  }
}
export async function getAllProducts(req: Request, res: Response) {
  try {
    const result = await getAllProductsService();
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao buscar produtos" });
  }
}
export async function favoriteProduct(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const productId = req.body.product_id;

    if (!productId) {
      return res.status(400).json({ message: "product_id é obrigatório" });
    }

    await favoriteProductService(userId, productId);

    return res.status(200).json({ message: "Adicionado aos favoritos" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao favoritar produto" });
  }
}

export async function getFavorites(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const favorites = await getFavoritesService(userId);
    return res.status(200).json(favorites);
  } catch {
    return res.status(500).json({ message: "Erro ao buscar favoritos" });
  }
}

export async function unfavoriteProduct(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const productId = Number(req.params.productId);

    await unfavoriteProductService(userId, productId);
    return res.status(200).json({ message: "Removido dos favoritos" });
  } catch {
    return res.status(500).json({ message: "Erro ao desfavoritar" });
  }
}

export async function getFavoritesProducts(req: Request, res: Response) {
  try {
    const userid = (req as any).user.id;
    const products = await getFavoritesProductsService(userid);
    return res.status(200).json({ products });
  } catch (error) {
    console.log("error");
    res.status(500).json({ message: "erro ao requisitar produtos favoritos" });
  }
}
export async function getProductByID(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);
    const result = await getProductByIdService(productId);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    const product = result[0]!;
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: "Erro interno do servidor" });
    console.log("erro ao buscar produto por id", error);
  }
}
