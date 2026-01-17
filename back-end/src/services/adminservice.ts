import { db } from "../config/db";
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

export async function searchUserService(email: string) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM usern
    WHERE email LIKE ?
    LIMIT 10
    `,
    [`%${email}%`]
  );

  return rows;
}
export async function GetAllOrdersService() {
  const [rows] = await db.query(
    `
    SELECT *
    FROM orders
    ORDER BY created_at DESC
    `
  );

  return rows;
}
export async function getOrderByIdService(orderId: number) {
  const [orderRows]: any = await db.query(
    `
    SELECT 
      o.id,
      o.created_at,
      o.total_price,
      o.status,
      u.name AS user_name,
      u.email AS user_email
    FROM orders o
    JOIN usern u ON u.id = o.user_id
    WHERE o.id = ?
    `,
    [orderId]
  );

  if (!orderRows || orderRows.length === 0) {
    return null;
  }

  const order = orderRows[0];

  const [items]: any = await db.query(
    `
    SELECT
      p.name,
      p.image_url,
      oi.quantity,
      oi.unit_price
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
    `,
    [orderId]
  );

  return {
    id: order.id,
    createdAt: order.created_at,
    status: order.status,
    totalPrice: order.total_price,
    user: {
      name: order.user_name,
      email: order.user_email,
    },
    items: items || [],
  };
}
export async function updateOrderStatusService(
  orderId: number,
  status: "PAID" | "CANCELLED"
) {
  const [result]: any = await db.query(
    `
    UPDATE orders
    SET status = ?, updated_at = NOW()
    WHERE id = ?
    `,
    [status, orderId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Pedido não encontrado");
  }
}