import location from "../assets/icons/location.png";
import profile from "../assets/icons/profile.png";
import shopbag from "../assets/icons/shopbag.png";
import card from "../assets/icons/card.png";
import fav from "../assets/icons/fav.png";
function SideBar() {
  return (
    <div className="sidebar-div">
      <h2 className="inter">Olá</h2>
      <ul>
        <li>
          <img src={profile} />
          <a>Dados pessoais</a>
        </li>
        <li>
          <img src={location} />
          <a>Endereços</a>
        </li>

        <li>
          <img src={shopbag} />
          <a>Pedidos</a>
        </li>

        <li>
          <img src={card} />
          <a>Métodos de Pagamento</a>
        </li>

        <li>
          <img src={fav} />
          <a>Favoritos</a>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
