import { RowDataPacket } from "mysql2";
import { db } from "../config/db";
export async function registerProductService(
  name: string,
  description: string,
  price: number,
  stock: number,
  image: string | null,
  active: boolean
) {
  const sql =
    "INSERT INTO products (name,description,price,stock,image_url,active) VALUES (?,?,?,?,?,?)";
  const [result] = await db.execute(sql, [
    name,
    description,
    price,
    stock,
    image,
    active,
  ]);
  return result;
}
export async function favoriteProductService(
  userId: number,
  productId: number
) {
  const sql = `
    INSERT INTO favorites (user_id, product_id)
    VALUES (?, ?)
  `;
  return db.execute(sql, [userId, productId]);
}

export async function getFavoritesService(userId: number) {
  const sql = `
    SELECT product_id
    FROM favorites
    WHERE user_id = ?
  `;
  const [rows] = await db.execute(sql, [userId]);
  return rows;
}

export async function unfavoriteProductService(
  userId: number,
  productId: number
) {
  const sql = `
    DELETE FROM favorites
    WHERE user_id = ? AND product_id = ?
  `;
  return db.execute(sql, [userId, productId]);
}

export async function getFavoritesProductsService(user_id: number) {
  const sql = `
    SELECT 
      p.id,
      p.name,
      p.price,
      p.image_url
    FROM favorites f
    INNER JOIN products p ON p.id = f.product_id
    WHERE f.user_id = ?
  `;
  const [rows] = await db.execute(sql, [user_id]);
  return rows;
}

export async function getProductByIdService(productId: number) {
  const sql = "SELECT * from products WHERE id=?";
  const [rows] = await db.execute<RowDataPacket[]>(sql, [productId]);
  return rows;
}
export async function getProductsService() {
  const sql =
    "SELECT id,name,price,stock,image_url FROM products WHERE active=1";
  const [rows] = await db.execute(sql);
  return rows;
}
export async function getAllProductsService() {
  const sql = "SELECT id,name,price,stock,image_url FROM products";
  const [rows] = await db.execute(sql);
  return rows;
}

