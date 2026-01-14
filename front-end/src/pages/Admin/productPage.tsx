import { useEffect, useState } from "react";
import AdminSideBar from "./adminSideBar";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { Formik, Form, Field } from "formik";
function ProductPage() {
  interface Product {
    id: number;
    image_url: string;
    name: string;
    price: number;
    stock: number;
    active: boolean;
    created_at: Date;
    description: string;
    updated_at: Date;
  }
  const [product, setProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { id } = useParams();
  useEffect(() => {
    Axios.get(`http://localhost:3000/edit-product/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  const handleSubmit = async (values: any) => {
    if (!id) return;

    const formData = new FormData();

    if (values.name && values.name !== product?.name)
      formData.append("name", values.name);

    if (values.price !== undefined && Number(values.price) !== product?.price)
      formData.append("price", String(values.price));

    if (values.stock !== undefined && Number(values.stock) !== product?.stock)
      formData.append("stock", String(values.stock));

    if (values.description && values.description !== product?.description)
      formData.append("description", values.description);

    if ((values.active === "true") !== product?.active)
      formData.append("active", values.active);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    await Axios.patch(`http://localhost:3000/edit-product/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    }).then(()=>{
      alert("Produto atualizado com sucesso!");
    });
  };

  return (
    <section className="product-page-section">
      <AdminSideBar></AdminSideBar>
      <div className="product-page-container">
        <h1 className="inter">Informações do produto </h1>
        <Formik
          enableReinitialize
          initialValues={
            product
              ? {
                  ...product,
                  active: product.active ? "true" : "false",
                }
              : {
                  name: "",
                  price: "",
                  stock: "",
                  description: "",
                  active: "true",
                  image_url: "",
                  id: 0,
                  created_at: "",
                  updated_at: "",
                }
          }
          onSubmit={handleSubmit}
        >
          <Form>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (!file) return;

                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />

            <div
              className="product-image"
              onClick={() => document.getElementById("imageUpload")?.click()}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  imagePreview
                    ? imagePreview
                    : `http://localhost:3000${product?.image_url}`
                }
                alt={product?.name}
              />
            </div>

            <div className="products-info-fields-container">
              <div className="products-info-fields">
                <label>ID</label>
                <Field type="text" name="id" disabled />

                <label>Criado em</label>
                <Field
                  type="text"
                  name="created_at"
                  disabled
                  value={
                    product
                      ? new Date(product.created_at).toLocaleDateString("pt-BR")
                      : ""
                  }
                />
                <label>Nome</label>
                <Field type="text" name="name" placeholder={product?.name} />
              </div>

              <div className="products-info-fields">
                <label>Preço</label>
                <Field type="number" name="price" />
                <div>
                  <label style={{ marginRight: "20px" }}>Produto Ativo?</label>
                  <label style={{ marginRight: "5px" }}>
                    <Field type="radio" name="active" value="true" />
                    Sim
                  </label>

                  <label>
                    <Field type="radio" name="active" value="false" />
                    Não
                  </label>
                </div>
                <label>Estoque</label>
                <Field type="number" name="stock" />
              </div>

              <div className="products-info-fields">
                <label>Descrição</label>
                <Field
                  as="textarea"
                  name="description"
                  style={{ height: "150px" }}
                />
              </div>
            </div>
            <button type="submit" className="save-product-button inter">
              Salvar alterações
            </button>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default ProductPage;
