import { useEffect, useState } from "react";
import Axios from "axios";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";

interface OrderItem {
  productId: number;
  name: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    Axios.get("http://localhost:3000/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setOrders(res.data);
    });
  }, []);

  return (
    <section className="order-section">
      <TopBar />
      <div className="order-container">
        <SideBar />

        <main className="order-content">
          <h1 className="inter">Meus pedidos</h1>

          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <header className="order-header">
                <span>Pedido #{order.id}</span>
                <span className={`status ${order.status}`}>
                  {order.status}
                </span>
              </header>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item">
                    <img
                      src={`http://localhost:3000${item.image_url}`}
                      alt={item.name}
                    />
                    <div>
                      <p>{item.name}</p>
                      <span>
                        {item.quantity}x R$ {item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <footer className="order-footer">
                <span>
                  Total: <b>R$ {order.total_price.toFixed(2)}</b>
                </span>
                <span>
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </footer>
            </div>
          ))}
        </main>
      </div>
    </section>
  );
}

export default OrdersPage;
