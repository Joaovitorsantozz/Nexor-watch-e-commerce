import { useCart } from "./cartItens";
import trash from "../assets/icons/trash.png";
type CartSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity,subtotal } =
    useCart();

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />

      <aside className="cart-sidebar">
        <header>
          <h2>Carrinho</h2>
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
                <p className="inter">R$ {(item.price*item.quantity).toFixed(2)}</p>

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
          <p className="inter" style={{marginBottom:"20px"}}><b>Subtotal do carrinho :</b> {subtotal.toFixed(2)}</p>
          <button className="checkout-btn">Finalizar compra</button>
        </footer>
      </aside>
    </>
  );
}

export default CartSidebar;
