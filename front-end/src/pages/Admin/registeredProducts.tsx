import { useEffect, useState } from "react";
import AdminSideBar from "./adminSideBar";
import Axios from "axios";
import { Link } from "react-router-dom";
import trash from "../../assets/icons/trash.png";
function RegisteredProducts() {
  interface Product {
    id: number;
    image_url: string;
    name: string;
    price: string;
    stock: string;
  }
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    Axios.get("http://localhost:3000/registered-products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);

  const deleteProduct = (id: number) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmed) return;

    Axios.delete(`http://localhost:3000/delete-product/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        alert("Produto deletado com sucesso!");
      })
      .catch((error) => {
        alert(error.response?.data?.message);
      });
  };
  return (
    <section className="registered-products-section">
      <AdminSideBar></AdminSideBar>
      <div className="registered-products-container">
        <h1 className="inter">Produtos registrados</h1>
        <div className="products-box">
          {products.map((product) => (
            <div className="product-unique">
              <div className="product-unique-image">
                <img
                  src={`http://localhost:3000${product.image_url}`}
                  alt={product.name}
                />
              </div>
              <div className="product-unique-content">
                <span className="inter">Relógio</span>
                <p className="inter">{product.name}</p>
                <button
                  onClick={() => {
                    deleteProduct(product.id);
                  }}
                >
                  <img src={trash}></img>
                </button>
              </div>
              <div className="product-unique-price">
                <span className="inter">Preço na loja online</span>
                <p className="inter">R${product.price}</p>
              </div>
              <button className="edit-product-button inter">
                <Link
                  to={`/edit-product/${product.id}`}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Editar produto
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RegisteredProducts;
