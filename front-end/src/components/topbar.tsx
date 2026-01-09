import search from "../assets/icons/search.png";
import fav from "../assets/icons/fav.png";
import market from "../assets/icons/market.png";
import profile from "../assets/icons/profile.png";
import contact from "../assets/icons/contact.png";
import shop from "../assets/icons/shop.png";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import CartSidebar from "./cartSideBar";
function TopBar() {
  interface CartItem{
    productid:number;
    name:string;
    price:number;
    image_url:string;
    quantity:number;
  }
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  return (
    <>
      <div className="topbar">
        <div className="upbar">
          <div className="upbar-left">
            <ul className="inter">
              <li>
                <img src={shop}></img>Lojas
              </li>
              <li>
                <img src={contact}></img>Agendamento
              </li>
            </ul>
          </div>
          <h1 className="didot">
            <a href="/">Nexor</a>
          </h1>
          <div className="upbar-right">
            {location.pathname === "/user-profile" ? (
              <>
                <ul style={{ justifyContent: "end" }}>
                  <li onClick={() => setIsCartOpen(true)}>
                    <img src={market} style={{ cursor: "pointer" }} />
                  </li>
                  <li>
                    <a href="/user-profile">
                      <img src={profile}></img>
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <ul>
                  <li>
                    <img src={search}></img>
                  </li>
                  <li>
                    <img src={fav}></img>
                  </li>
                  <li onClick={() => setIsCartOpen(true)}>
                    <img src={market} style={{ cursor: "pointer" }} />
                  </li>
                  <li>
                    <a href="/user-profile">
                      <img src={profile}></img>
                    </a>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="downbar">
          <ul className="didot">
            <li>Joias</li>
            <li>Relógios</li>
            <li>Rolex</li>
            <li>Diamantes</li>
            <li>Su Misura</li>
          </ul>
        </div>
      </div>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
export default TopBar;
