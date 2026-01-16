import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSideBar from "./adminSideBar";
import { useNavigate } from "react-router-dom";
function OrderSinglePage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchOrder() {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/admin/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log(data);
      setOrder(data);
    }

    fetchOrder();
  }, [id]);
  async function updateStatus(
    status: "PAID" | "CANCELLED" | "PAYMENT_PENDING"
  ) {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:3000/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      alert("Erro ao atualizar status do pedido");
      return;
    }

    setOrder((prev: any) => ({
      ...prev,
      status,
    }));
  }
  if (!order) {
    return (
      <section className="order-single-section">
        <AdminSideBar />
        <div className="order-single-container">
          <p className="inter">Carregando pedido...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="order-single-section">
      <AdminSideBar />

      <div className="order-single-container">
        <div className="order-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Voltar
          </button>

          <div className="order-actions">
            <div className="order-actions">
              <button
                className="status-btn pending"
                onClick={() => updateStatus("PAYMENT_PENDING")}
                disabled={order.status === "PAYMENT_PENDING"}
              >
                Pagamento pendente
              </button>

              <button
                className="status-btn paid"
                onClick={() => updateStatus("PAID")}
                disabled={order.status === "PAID"}
              >
                Marcar como pago
              </button>

              <button
                className="status-btn cancelled"
                onClick={() => updateStatus("CANCELLED")}
                disabled={order.status === "CANCELLED"}
              >
                Cancelar pedido
              </button>
            </div>
          </div>
        </div>
        <h1 className="inter">Detalhes do pedido</h1>

        <div className="order-user-box">
          <span className="order-user-name inter">{order.user.name}</span>
          <span className="order-user-email inter">{order.user.email}</span>
        </div>

        <div className="order-products-box">
          {order.items.map((item: any) => (
            <div key={item.id} className="order-product-row">
              <img
                src={`http://localhost:3000${item.image_url}`}
                alt={item.name}
                className="order-product-image"
              />

              <div className="order-product-info">
                <span className="order-product-name inter">{item.name}</span>

                <span className="order-product-quantity inter">
                  Quantidade: {item.quantity}
                </span>
              </div>

              <span className="order-product-price inter">
                R$ {item.unit_price}
              </span>
            </div>
          ))}
        </div>

        <div className="order-total-box">
          <span className="inter">Total do pedido</span>
          <strong className="inter">
            R$ {Number(order.totalPrice).toFixed(2)}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default OrderSinglePage;
