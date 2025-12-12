import "../index.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
function RegisterPage() {
  const navigate= useNavigate();
  const validateRegister = yup.object().shape({
    country: yup.string().required("Selecione um país"),
    name: yup.string().required("O campo é obrigatório"),
    email: yup.string().email().required("Este não é um email válido"),
    password: yup
      .string()
      .min(8)
      .required("A senha deve conter mais de 8 caracteres"),
  });
  interface formValues {
    country: string;
    name: string;
    email: string;
    password: string;
  }
  const handleRegister = (values: formValues) => {
    Axios.post("http://localhost:3000/register", {
      name: values.name,
      email: values.email,
      country: values.country,
      password: values.password,
    })
      .then((response) => {
        //registrou certo
        if (response.data.message == "Usuario Cadastrado") {
          alert("Cadastrado");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error);
        alert(error.response.data.message);
      });
  };
  return (
    <section className="register-section">
      <a className="didot" href="/">
        Nexor
      </a>

      <div className="register-container">
        <Formik
          initialValues={{ country: "", name: "", email: "", password: "" }}
          onSubmit={handleRegister}
          validationSchema={validateRegister}
        >
          <Form className="login-form">
            <h2 className="inter">Registrar</h2>
            <label htmlFor="country-select" className="inter">
              Selecione seu país
            </label>
            <Field
              as="select"
              id="country"
              name="country"
              className="form-field"
            >
              <option value="" disabled style={{ color: "gray" }}>
                Selecione seu país*
              </option>

              <option value="US">United States</option>
              <option value="BR">Brazil</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
            </Field>
            <ErrorMessage
              name="country"
              component="span"
              className="error-message"
            />
            <label htmlFor="name" className="inter">
              Seu nome*
            </label>
            <Field
              className="form-field"
              name="name"
              placeholder="Insira seu nome"
            ></Field>
            <label htmlFor="email" className="inter">
              Email*
            </label>
            <Field
              className="form-field"
              name="email"
              placeholder="Email"
            ></Field>
            <ErrorMessage
              component="span"
              name="email"
              className="error-message"
            ></ErrorMessage>
            <label htmlFor="password" className="inter">
              Senha*
            </label>
            <Field
              type="password"
              className="form-field"
              name="password"
              placeholder="Password"
            ></Field>
            <ErrorMessage
              component="span"
              name="password"
              className="error-message"
            ></ErrorMessage>

            <button type="submit" className="form-login-button inter">
              Registrar conta
            </button>

            <a className="register-button inter" href="/login">
              Ja possui uma conta? Faça login aqui
            </a>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default RegisterPage;
