
import { Request, Response } from "express";
import { getUserOrdersService, updateProductService, deleteProductService, searchUserService, GetAllOrdersService, getOrderByIdService, updateOrderStatusService } from "../services/adminservice";
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

export async function searchUserController(req: Request, res: Response) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email query is required" });
  }

  try {
    const users = await searchUserService(email);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function GetAllOrders(req: Request, res: Response) {
  try {
    const orders = await GetAllOrdersService();

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao listar pedidos",
    });
  }
}

export async function getOrderByIdController(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const order = await getOrderByIdService(Number(id));

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar pedido",
    });
  }
}

export async function updateOrderStatusController(req: Request, res: Response) {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (!["PAID", "CANCELLED"].includes(status)) {
    return res.status(400).json({ message: "Status inválido" });
  }

  await updateOrderStatusService(orderId, status);

  return res.status(200).json({ message: "Status atualizado com sucesso" });
}
