import search from "../assets/icons/search.png";
import fav from "../assets/icons/fav.png";
import market from "../assets/icons/market.png";
import profile from "../assets/icons/profile.png";
import contact from "../assets/icons/contact.png";
import shop from "../assets/icons/shop.png";
import { useLocation } from "react-router-dom";
function TopBar() {
  const location = useLocation();
  return (
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
              <ul style={{justifyContent:"end"}}>
                <li>
                  <img src={market}></img>
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
                <li>
                  <img src={market}></img>
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
  );
}
export default TopBar;
