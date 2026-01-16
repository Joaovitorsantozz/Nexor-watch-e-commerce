import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./adminSideBar";


function OrdersPageAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3000/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    }

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "ALL") return true;
    return order.status === statusFilter;
  });

  return (
    <section className="order-page-section">
      <AdminSideBar />

      <div className="order-page-container">
        <h1 className="inter">Pedidos</h1>

       
        <div className="order-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Todos</option>
            <option value="PAYMENT_PENDING">PAYMENT_PENDING</option>
            <option value="PAID">PAID</option>
            <option value="CANCELLED">CANCELED</option>
          </select>
        </div>

        <div className="order-list-box">
          {filteredOrders.map((order) => (
            <div key={order.id} className="order-sample-box">
              <div className="order-left">
                <div className="order-icon">
                  
                </div>

                <div className="order-info">
                  <span className="order-date inter">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </span>

                  <span className="order-id inter">
                    Pedido #{order.id}
                  </span>

                  <span className="order-user inter">
                    Usuário ID: {order.user_id}
                  </span>

                  <span className="order-status inter">
                    Status: {order.status}
                  </span>
                </div>
              </div>

              <button
                className="order-action"
                onClick={() => navigate(`/admin/orders/${order.id}`)}
              >
                Ver mais
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OrdersPageAdmin;
