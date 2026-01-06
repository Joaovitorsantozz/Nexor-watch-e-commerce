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

export async function registerAdress(
  userId: number,
  countryId: number,
  countryName: string,
  stateId: number,
  stateName: string,
  cityId: number,
  cityName: string,
  neighborhood: string,
  street: string,
  number: string
) {
  const sql = `
    INSERT INTO adressn (
      userid,
      country,
      country_name,
      state,
      state_name,
      city,
      city_name,
      neighborhood,
      street,
      number
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(sql, [
    userId,
    countryId,
    countryName,
    stateId,
    stateName,
    cityId,
    cityName,
    neighborhood,
    street,
    number,
  ]);

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

export async function getUserService(email: string) {
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
export async function getAdressesByUser(userId: number) {
  const sql = `
    SELECT
      id,
      country,
      country_name,
      state,
      state_name,
      city,
      city_name,
      neighborhood,
      street,
      number
    FROM adressn
    WHERE userid = ?
  `;

  const [rows] = await db.execute(sql, [userId]);
  return rows;
}
export async function deleteAdressService(userid:number,adressid:number) {
  const [result]:any=await db.execute("DELETE FROM adressn WHERE id=? AND userid=?",[adressid,userid]);
  return result;

}
export async function editUserService(
  values: unknown[],
  columns: string[],
  userID: number
) {
  const setClause = columns.map((col) => `${col} = ?`).join(", ");

  const query = `
    UPDATE usern
    SET ${setClause}
    WHERE id = ?
  `;

  return db.query(query, [...values, userID]);
}
