import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

import { response } from "express";
export async function registerUser(
  name: string,
  email: string,
  country: string,
  password: string
) {
  const sql = "SELECT * FROM usern WHERE email=?";
  const [rows] = await db.query<RowDataPacket[]>(sql, [email]);
  if (rows.length > 0) {
    return null;
  }
  const sql2 =
    "INSERT INTO usern (name,email,country,password) VALUES (?,?,?,?)";
  const result = await db.execute(sql2, [name, email, country, password]);
  return result;
}

export async function loginUser(email: string) {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM usern WHERE email = ?",
      [email]
    );

    return rows;
  } catch (error) {
    console.log("Erro no loginUser:", error);
    return null;
  }
}

export async function getUserService( email:string){

    try {
    const [rows] = await db.execute<RowDataPacket[]>(
      "SELECT * FROM usern WHERE email = ?",
      [email]
    );

    return rows;
  } catch (error) {
    console.log("Erro no getUser:", error);
    return null;
  }
}