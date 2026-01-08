import { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Axios from "axios";
function FavoritePage() {
  const token = localStorage.getItem("token");

  interface FavoriteProducts {
    id: number;
    name: string;
    price: string;
    image_url: string;
  }
  const [favProducts, setFavProducts] = useState<FavoriteProducts[]>([]);

  const getFavoriteProducts = () => {
    Axios.get("http://localhost:3000/get-favorite-products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setFavProducts(response.data.products);
      })
      .catch((error) => {
        console.log("error");
      });
  };
  useEffect(() => {
    if (!token) return;
    getFavoriteProducts();
  }, []);
  return (
    <section className="favorite-section">
      <TopBar></TopBar>
      <div className="favorite-container">
        <SideBar></SideBar>
        <main className="favorite-content">
          <header className="favorite-header">
            <h1 className="inter">Seus favoritos</h1>
          </header>
         <div className="itens-box">
          {favProducts.map((product) => (
            <div className="item-unique">
              <div className="item-unique-image">
                <img
                  src={`http://localhost:3000${product.image_url}`}
                  alt={product.name}
                />
              </div>

              <div className="item-information">
                <h3 className="item-brand inter">Relógio</h3>
                <h2 className="item-model">{product.name}</h2>
               
              </div>

              <div className="item-price-box">
                <p className="item-price-span inter">Preço na loja online</p>
                <span className="item-price inter">R${product.price}</span>
              </div>

              <a className="buy-button">Comprar</a>
            </div>
          ))}
        </div>
        </main>
      </div>
    </section>
  );
}

export default FavoritePage;
