import { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Axios from "axios";
import heartempty from "../assets/icons/heartempty.png";
import heartfill from "../assets/icons/heartfill.png";
import { Link } from "react-router-dom";
function FavoritePage() {
  const token = localStorage.getItem("token");

  interface FavoriteProducts {
    id: number;
    name: string;
    price: string;
    image_url: string;
  }
  const [favProducts, setFavProducts] = useState<FavoriteProducts[]>([]);
  const handleFavorite = async (productId: number) => {
    if (!token) return;

    setFavProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );

    try {
      await unfavoriteProduct(productId, token);
    } catch (error) {
      console.error("Erro ao desfavoritar", error);

      getFavoriteProducts();
    }
  };
  const unfavoriteProduct = async (productId: number, token: string) => {
    return Axios.delete(`http://localhost:3000/favorites/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
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
            { favProducts.length!=0 ? favProducts.map((product) => (
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
                  <button
                    onClick={() => handleFavorite(product.id)}
                    className="favorite-button"
                  >
                    <img src={heartfill} alt="remover dos favoritos" />
                  </button>
                </div>

                <div className="item-price-box">
                  <p className="item-price-span inter">Preço na loja online</p>
                  <span className="item-price inter">R${product.price}</span>
                </div>

                <a className="buy-button">Comprar</a>
              </div>
            )): <p className="inter">Você não possui favoritos <br/><Link to={"/"}>ir para loja</Link></p>}
          </div>
        </main>
      </div>
    </section>
  );
}

export default FavoritePage;
