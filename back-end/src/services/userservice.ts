import { RowDataPacket } from "mysql2";
import { db } from "../config/db";

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
