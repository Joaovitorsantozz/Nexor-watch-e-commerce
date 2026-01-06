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
} from "../services/authservice";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { emit } from "process";

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
      { id: users.id, email: users.email },
      process.env.JWT_TOKEN!,
      { expiresIn: "5h" }
    );
    return res.status(200).json({
      message: "Usuario Logado",
      user: rows[0],
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
    if (!fields || Object.keys(fields).length == 0) {
      return res.status(400).json({ msg: "Nenhum campo para atualizar" });
    }
    const column = Object.keys(fields);
    const values = Object.values(fields);

    await editUserService(values, column, userID);

    return res.json({ message: "Campos alterados" });
  } catch (error) {
    console.log("error", error);
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
