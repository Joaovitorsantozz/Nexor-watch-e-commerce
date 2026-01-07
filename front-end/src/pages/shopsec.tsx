import { useEffect, useState } from "react";
import sampleimg from "../assets/watch-sample.png";
import Axios from "axios";
let i = 0;
function ShopSec() {
  interface Product {
    image_url: string;
    name: string;
    price: string;
  }
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts(setProducts);
  }, []);
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
              </div>

              <div className="item-price-box">
                <p className="item-price-span inter">Preço na loja online</p>
                <span className="item-price inter">R${product.price}</span>
              </div>

              <a className="buy-button">Comprar</a>
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
