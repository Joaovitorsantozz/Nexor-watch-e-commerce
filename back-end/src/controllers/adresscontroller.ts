
import { Request, Response } from "express";
import { registerAdress, getAdressesByUser, deleteAdressService, setDefaultAdressService } from "../services/adressService";
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
