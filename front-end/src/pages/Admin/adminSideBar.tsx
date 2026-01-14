import systemgear from "../../assets/icons/system.png";
import admineditIcon from "../../assets/icons/adminedit.png";
import { Link } from "react-router-dom";
import product from "../../assets/icons/product.png";
import user from "../../assets/icons/user.png";
import orders from "../../assets/icons/orders.png";
function AdminSideBar() {
  return (
    <div className="admin-topbar">
      <div className="admin-top-title">
        <h1 className="didot"><Link to={"/"}>Nexor</Link></h1>
        <div className="admin-subtitle">
          <img src={systemgear}></img>
          <h3 className="inter">Control Panel</h3>
        </div>
      </div>

      <div className="admin-options-container">
        <ul className="admin-options-list">
          <li className="inter"><img src={admineditIcon}></img><Link to={"/register-products"}>Adicionar produto</Link></li>
          <li className="inter"><img src={product}></img><Link to={"/registered-products"}>Produtos cadastrados</Link></li>
          <li className="inter"><img src={user}></img>Buscar usuários pro email</li>
          <li className="inter"><img src={orders}></img>Pedidos pendentes</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminSideBar;
