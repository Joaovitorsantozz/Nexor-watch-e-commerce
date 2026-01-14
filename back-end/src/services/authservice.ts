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
export async function getProductsService() {
  const sql =
    "SELECT id,name,price,stock,image_url FROM products WHERE active=1";
  const [rows] = await db.execute(sql);
  return rows;
}
export async function getAllProductsService() {
  const sql =
    "SELECT id,name,price,stock,image_url FROM products";
  const [rows] = await db.execute(sql);
  return rows;
}
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

export async function deleteAdressService(userid: number, adressid: number) {
  const [result]: any = await db.execute(
    "DELETE FROM adressn WHERE id=? AND userid=?",
    [adressid, userid]
  );
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
type OrderItemInput = {
  productId: number;
  quantity: number;
};
export async function registerOrderService(
  userId: number,
  addressId: number,
  items: OrderItemInput[]
) {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Nenhum item enviado para o pedido");
  }

  if (items.length > 50) {
    throw new Error("Pedido excede o limite de itens");
  }

  const normalizedItems = new Map<number, number>();

  for (const item of items) {
    if (
      !Number.isInteger(item.productId) ||
      !Number.isInteger(item.quantity) ||
      item.quantity <= 0
    ) {
      throw new Error("Item inválido no pedido");
    }

    normalizedItems.set(
      item.productId,
      (normalizedItems.get(item.productId) || 0) + item.quantity
    );
  }

  const productIds = [...normalizedItems.keys()];
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [addressRows]: any = await conn.execute(
      "SELECT id FROM adressn WHERE id = ? AND userid = ?",
      [addressId, userId]
    );

    if (addressRows.length === 0) {
      throw new Error("Endereço inválido");
    }

    const [products]: any = await conn.execute(
      `
      SELECT id, name, price, stock
      FROM products
      WHERE id IN (${productIds.map(() => "?").join(",")})
      FOR UPDATE
      `,
      productIds
    );

    if (products.length !== productIds.length) {
      throw new Error("Um ou mais produtos não existem");
    }

    let totalPrice = 0;

    for (const product of products) {
      const quantity = normalizedItems.get(product.id)!;

      if (quantity > product.stock) {
        throw new Error(`Estoque insuficiente para ${product.name}`);
      }

      totalPrice += product.price * quantity;
    }

    const [orderResult]: any = await conn.execute(
      `
      INSERT INTO orders (user_id, address_id, total_price, status)
      VALUES (?, ?, ?, 'PAYMENT_PENDING')
      `,
      [userId, addressId, totalPrice]
    );

    const orderId = orderResult.insertId;

    for (const product of products) {
      const quantity = normalizedItems.get(product.id)!;

      await conn.execute(
        `
        INSERT INTO order_items (order_id, product_id, unit_price, quantity)
        VALUES (?, ?, ?, ?)
        `,
        [orderId, product.id, product.price, quantity]
      );

      /*await conn.execute(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [quantity, product.id]
      );
      */
      // essa parte ta dando baixa no estoque mesmo antes do pagamento, o que nao deveria, então precisa ter um outro
      // service que vai ser acionado quando o cliente fizer o pagamento e ai sim ele vai dar baixa no sistema
    }

    await conn.commit();
    return orderId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function getUserOrdersService(userId: number) {
  const [orders]: any = await db.execute(
    `SELECT id, status, total_price, created_at
     FROM orders
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  if (orders.length === 0) return [];

  const orderIds = orders.map((o: any) => o.id);

  const [items]: any = await db.execute(
    `SELECT 
        oi.order_id,
        oi.product_id,
        oi.unit_price,
        oi.quantity,
        p.name,
        p.image_url
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (${orderIds.map(() => "?").join(",")})`,
    orderIds
  );

  return orders.map((order: any) => ({
    id: order.id,
    status: order.status,
    total_price: Number(order.total_price),
    created_at: order.created_at,
    items: items
      .filter((i: any) => i.order_id === order.id)
      .map((i: any) => ({
        productId: i.product_id,
        name: i.name,
        image_url: i.image_url,
        price: Number(i.unit_price),
        quantity: i.quantity,
      })),
  }));
}

  export async function getProductByIdService(productId: number) {
    const sql = "SELECT * from products WHERE id=?";
    const [rows] = await db.execute<RowDataPacket[]>(sql, [productId]);
    return rows;
  }

  export async function updateProductService(
  productId: number,
  fields: Record<string, any>
) {
  const updates = [];
  const values = [];

  for (const key in fields) {
    updates.push(`${key} = ?`);
    values.push(fields[key]);
  }

  values.push(productId);

  const sql = `
    UPDATE products
    SET ${updates.join(", ")}
    WHERE id = ?
  `;

  await db.execute(sql, values);
}

export async function deleteProductService(productId: number) { 
  const sql = "DELETE FROM products WHERE id = ?";
  const [result] = await db.execute(sql, [productId]);
  return result;
}