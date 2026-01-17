import { db } from "../config/db";
export async function deleteAdressService(userid: number, adressid: number) {
  const [result]: any = await db.execute(
    "DELETE FROM adressn WHERE id=? AND userid=?",
    [adressid, userid]
  );
  return result;
}
export async function getAdressesByUser(userId: number) {
  const [rows] = await db.execute(
    `SELECT 
      id,
      country,
      country_name,
      state,
      state_name,
      city,
      city_name,
      neighborhood,
      street,
      number,
      is_default
     FROM adressn
     WHERE userid = ?`,
    [userId]
  );

  return rows;
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
export async function setDefaultAdressService(
  userId: number,
  adressId: number
) {
  await db.execute("UPDATE adressn SET is_default = false WHERE userid = ?", [
    userId,
  ]);

  await db.execute(
    "UPDATE adressn SET is_default = true WHERE id = ? AND userid = ?",
    [adressId, userId]
  );
}