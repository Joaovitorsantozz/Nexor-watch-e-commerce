import { useEffect, useState } from "react";
import sampleimg from "../assets/watch-sample.png";
import Axios from "axios";
import heartempty from "../assets/icons/heartempty.png";
import heartfill from "../assets/icons/heartfill.png";
import { useCart } from "../components/cartItens";
let i = 0;

function ShopSec() {
  const { addToCart } = useCart();
  interface Product {
    id: number;
    image_url: string;
    name: string;
    price: string;
  }
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  useEffect(() => {
    fetchProducts(setProducts);
  }, []);
  const token = localStorage.getItem("token");

  const favoriteProduct = async (productId: number, token: string) => {
    return Axios.post(
      "http://localhost:3000/favorite-product",
      { product_id: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
  const unfavoriteProduct = async (productId: number, token: string) => {
    return Axios.delete(`http://localhost:3000/favorites/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const getFavorites = async (token: string) => {
    const res = await Axios.get("http://localhost:3000/favorites", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.map((f: any) => f.product_id);
  };
  useEffect(() => {
    if (!token) return;

    getFavorites(token).then(setFavorites);
  }, []);

  const handleFavorite = async (productId: any) => {
    if (!token) return null;
    const isFavorite = favorites.includes(productId);

    setFavorites((prev) =>
      isFavorite ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

    try {
      if (isFavorite) {
        await unfavoriteProduct(productId, token);
      } else {
        await favoriteProduct(productId, token);
      }
    } catch {
      setFavorites((prev) =>
        isFavorite
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
    }
  };
  return (
    <section className="shop-section">
      <div className="shop-container">
        <h2 className="inter">Recomendados para você</h2>

        <div className="itens-box">
          {products.map((product) => (
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
                <button onClick={() => handleFavorite(product.id)}>
                  <img
                    src={
                      favorites.includes(product.id) ? heartfill : heartempty
                    }
                    alt="favoritar"
                  />
                </button>
              </div>

              <div className="item-price-box">
                <p className="item-price-span inter">Preço na loja online</p>
                <span className="item-price inter">R${product.price}</span>
              </div>

              <button
                className="buy-button"
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image_url: product.image_url,
                  })
                }
              >
                Comprar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export const fetchProducts = (setProducts: any) => {
  Axios.get("http://localhost:3000/products")
    .then((res) => setProducts(res.data))
    .catch((err) => console.log(err));
};
function watchBox() {
  return (
    <div className="item-unique">
      <div className="item-unique-image">
        <img src={sampleimg}></img>
      </div>
      <div className="item-information">
        <h3 className="item-brand inter">CASSIO</h3>
        <h2 className="item-model">A618WA-1</h2>
      </div>
      <div className="item-price-box">
        <p className="item-price-span inter">Preço na loja online</p>
        <span className="item-price inter">R$329,00</span>
      </div>

      <a className="buy-button">Comprar</a>
    </div>
  );
}
export default ShopSec;
