import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";

import { isValidCPF } from "../isValidCpf";
import { getUserService, editUserService, registerOrderService } from "../services/userservice";



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

export async function orderRegister(req: Request, res: Response) {
  try {
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
