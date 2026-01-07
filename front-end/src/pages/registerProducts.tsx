import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "axios";
import * as yup from "yup";
function RegisterProducts() {
  interface Product {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: File | null;
    active: boolean;
  }

  const handleRegister = (values: Product) => {
    const formData = new FormData();

    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("stock", values.stock);
    formData.append("description", values.description);
    formData.append("active", String(values.active));

    if (values.image) {
      formData.append("image", values.image);
    }
    Axios.post("http://localhost:3000/register-product", formData)
      .then(() => {
        alert("Item cadastrado");
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  const validateRegister = yup.object({
    name: yup.string().required("Nome do produto é obrigatório"),

    description: yup
      .string()
      .required("Descrição é obrigatória")
      .min(10, "Descrição muito curta"),

    price: yup
      .string()
      .required("Preço é obrigatório")
      .matches(/^\d+(\.\d{1,2})?$/, "Preço inválido"),

    stock: yup
      .string()
      .required("Estoque é obrigatório")
      .matches(/^\d+$/, "Estoque deve ser um número inteiro"),

    active: yup.boolean().required(),

    image: yup
      .mixed<File>()
      .nullable()
      .test("fileSize", "Imagem muito grande (máx 2MB)", (value) => {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024;
      })
      .test("fileType", "Formato inválido (jpg, jpeg, png)", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png"].includes(value.type);
      }),
  });

  return (
    <section className="register-products-section">
      <h1 className="inter">Cadastrar produtos</h1>
      <div className="register-products-container">
        <Formik
          onSubmit={handleRegister}
          validationSchema={validateRegister}
          initialValues={{
            name: "",
            description: "",
            price: "",
            stock: "",
            image: null,
            active: true,
          }}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="form-row">
                <div className="form-column">
                  <label className="inter">Nome do produto</label>
                  <Field
                    className="name"
                    name="name"
                    type="text"
                    placeholder="Insira o nome do produto"
                  />
                </div>

                <div className="form-column">
                  <label className="inter">Preço</label>
                  <Field
                    className="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 499.90"
                  />
                </div>

                <div className="form-column">
                  <label className="inter">Estoque</label>
                  <Field
                    className="stock"
                    name="stock"
                    type="number"
                    placeholder="Quantidade em estoque"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-column">
                  <label className="inter">Imagem (URL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.currentTarget.files) {
                        setFieldValue("image", e.currentTarget.files[0]);
                      }
                    }}
                  />
                </div>

                <div className="form-column">
                  <label className="inter">Descrição</label>
                  <Field
                    className="description"
                    name="description"
                    as="textarea"
                    placeholder="Descrição do produto"
                  />
                </div>

                <div className="form-column">
                  <label className="inter">Produto ativo</label>
                  <Field className="active" name="active" as="select">
                    <option value={1}>Sim</option>
                    <option value={0}>Não</option>
                  </Field>
                </div>
              </div>
              <button type="submit">Cadastrar</button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
}

export default RegisterProducts;
