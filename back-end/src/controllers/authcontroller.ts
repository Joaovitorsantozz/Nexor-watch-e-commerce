import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getUserService,
  editUserService,
  registerAdress,
  getAdressesByUser,
  deleteAdressService,
  setDefaultAdressService,
  registerProductService,
  getProductsService,
  favoriteProductService,
  unfavoriteProductService,
  getFavoritesService,
  getFavoritesProductsService,
  registerOrderService,
  getUserOrdersService,
  getProductByIdService,
  updateProductService,
  getAllProductsService,
  deleteProductService,
} from "../services/authservice";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emit } from "process";
import { isValidCPF } from "../isValidCpf";
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
export async function register(req: Request, res: Response) {
  try {
    const { name, email, country, password } = req.body;
    if (!name || !email || !country || !password) {
      return res.status(400).json({ message: "Campos faltando" });
    }
    const bpass = await bcrypt.hash(password, 10);
    const result = await registerUser(name, email, country, bpass);
    if (!result) {
      return res.status(400).json({
        message: "Usuário ja existe",
        sucessfull: false,
      });
    }
    res.status(201).json({
      message: "Usuario Cadastrado",
      result,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao cadastrar usuário", err });
  }
}
export async function adressRegister(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const {
      countryId,
      countryName,
      stateId,
      stateName,
      cityId,
      cityName,
      neighborhood,
      street,
      number,
    } = req.body;

    const result = await registerAdress(
      userId,
      countryId,
      countryName,
      stateId,
      stateName,
      cityId,
      cityName,
      neighborhood,
      street,
      number
    );

    return res.status(201).json({
      message: "Endereço cadastrado",
      result,
    });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao cadastrar endereço" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const rows = await loginUser(email);

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }
    const users = rows[0];
    if (!users)
      return res.status(401).json({ message: "Usuário não encontrado" });

    const isCorrectPassword = await bcrypt.compare(password, users.password);
    if (!isCorrectPassword) {
      return res.status(401).json({ message: "Email ou senha incorreta" });
    }
    const { password: _, ...safeUser } = users;

    const token = jwt.sign(
      { id: users.id, email: users.email, role: users.role },
      process.env.JWT_TOKEN!,
      { expiresIn: "5h" }
    );
    console.log("SEU TOKEN", token);
    return res.status(200).json({
      message: "Usuario Logado",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao logar", err });
  }
}
export async function getAdress(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const adresses = await getAdressesByUser(userId);

    return res.status(200).json(adresses);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar endereços",
    });
  }
}
export async function getUser(req: Request, res: Response) {
  try {
    const userDecoded = (req as any).user;
    const userEmail = userDecoded.email;

    const result = await getUserService(userEmail);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const user = result[0]!;
    delete user.password;

    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function editUser(req: Request, res: Response) {
  try {
    const userID = (req as any).user.id;
    const fields = req.body;

    const allowedFields = ["name", "cpf", "telephone", "birthday"];
    const filteredFields: any = {};

    if (fields.cpf) {
      const normalizedCpf = fields.cpf.replace(/\D/g, "");
      if (!isValidCPF(normalizedCpf)) {
        return res.status(400).json({ message: "CPF inválido" });
      }
      fields.cpf = normalizedCpf;
    }

    if (fields.birthday) {
      const date = new Date(fields.birthday);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Data de nascimento inválida" });
      }
    }

    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        filteredFields[key] = fields[key];
      }
    }

    if (Object.keys(filteredFields).length === 0) {
      return res
        .status(400)
        .json({ message: "Nenhum campo válido para atualizar" });
    }

    const columns = Object.keys(filteredFields);
    const values = Object.values(filteredFields);

    await editUserService(values, columns, userID);

    return res.json({ message: "Campos alterados" });
  } catch (error) {
    console.error("Erro ao editar usuário", error);
    return res.status(500).json({ message: "Erro interno" });
  }
}

export async function deleteAdress(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const adressId = Number(req.params.id);

    const result = await deleteAdressService(userId, adressId);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Endereço não encontrado" });
    }
    return res.status(200).json({ message: "Endereço excluido" });

    //se o userid enviado for igual ao user userid da tabela ai deleta pelo id do adress
  } catch (error) {
    return res.status(500).json({
      message: "Erro interno",
    });
  }
}

export async function setDefaultAdress(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    const adressId = Number(req.params.id);

    await setDefaultAdressService(userId, adressId);

    return res.status(200).json({ message: "Endereço padrão atualizado" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao definir endereço padrão" });
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

export async function orderRegister(req: Request, res: Response) {
  try {
    console.log("dentro do try", req.body);
    const userId = (req as any).user.id;
    const { addressId, items } = req.body;
    if (!addressId || items?.length == 0) {
      return res.status(400).json({ message: "Payload inválido" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Itens do pedido são obrigatórios" });
    }

    const orderId = await registerOrderService(userId, addressId, items);

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      orderId,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Erro ao fazer o pedido" });
  }
}
export async function getMyOrders(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;

    const orders = await getUserOrdersService(userId);

    return res.status(200).json(orders);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: error.message || "Erro ao buscar pedidos",
    });
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

export async function updateProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const fields: any = {};

    if (req.body.name) fields.name = req.body.name;
    if (req.body.description) fields.description = req.body.description;

    if (req.body.price !== undefined) fields.price = Number(req.body.price);

    if (req.body.stock !== undefined) fields.stock = Number(req.body.stock);

    if (req.body.active !== undefined)
      fields.active = req.body.active === "true";

    if (req.file) {
      fields.image_url = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: "Nenhum campo para atualizar" });
    }

    await updateProductService(productId, fields);

    return res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    console.log("erro ao atualizar produto", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
export async function deleteProduct(req: Request, res: Response) {
  try {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const result: any = await deleteProductService(productId);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error: any) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        message: "Produto já possui pedidos e não pode ser excluído",
      });
    }

    return res.status(500).json({ message: "Erro interno" });
  }
}
