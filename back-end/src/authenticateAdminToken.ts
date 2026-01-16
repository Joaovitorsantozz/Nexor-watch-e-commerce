import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { Request, Response, NextFunction } from "express";

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = (req as any).user;

  if (!user || user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Acesso negado: admin apenas" });
  }

  next();
}
