import { useCart } from "./cartItens";
import trash from "../assets/icons/trash.png";
import Axios from "axios";
import { useEffect, useState } from "react";
type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  interface Address {
    id: number;
    country: string;
    country_name: string;
    state: string;
    state_name: string;
    city: string;
    city_name: string;
    neighborhood: string;
    street: string;
    number: string;
    is_default: 0 | 1;
  }
  interface Order {
    addressId: number;
    items: {
      productId: number;
      quantity: number;
    }[];
  }
  const [adresses, setAdresses] = useState<Address[]>([]);
  const [selectAdressId, setSelectAdressId] = useState<number | null>(null);

  useEffect(() => {
    async function loadAdress() {
      const res = await Axios.get("http://localhost:3000/adresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setAdresses(res.data);

      const defaultAdress = res.data.find((a: Address) => a.is_default === 1);
      if (defaultAdress) {
        setSelectAdressId(defaultAdress.id);
      }
    }
    loadAdress();
  }, []);
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, subtotal } =
    useCart();
  const token = localStorage.getItem("token");
  if (!isOpen) return null;
  const payload: Order = {
    addressId: selectAdressId!,
    items: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
  const handleBuy = () => {
    Axios.post("http://localhost:3000/order", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        alert("Pedido feito");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <aside className="cart-sidebar">
        <header>
          <h2 className="inter">Carrinho</h2>
          <button onClick={onClose}>✕</button>
        </header>
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">
                <img src={`http://localhost:3000${item.image_url}`} />
              </div>
              <div className="cart-item-information">
                <p className="cart-item-name inter">{item.name}</p>

                <p className="inter">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>

                <div className="quantity-buttons">
                  <div className="quantity-button">
                    <button
                      onClick={() => {
                        decreaseQuantity(item.productId);
                      }}
                    >
                      -
                    </button>
                  </div>
                  <div className="quantity-b">{item.quantity}</div>
                  <div className="quantity-button">
                    <button
                      onClick={() => {
                        increaseQuantity(item.productId);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(item.productId)}
              >
                <img src={trash} />
              </button>
            </div>
          ))}
        </div>
        <footer>
          <p className="inter" style={{ marginBottom: "20px" }}>
            <b>Subtotal do carrinho :</b> {subtotal.toFixed(2)}
          </p>
          <button
            className="checkout-btn"
            onClick={() => {
              handleBuy();
            }}
          >
            Finalizar compra
          </button>
        </footer>
      </aside>
    </>
  );
}

export default CartSidebar;
