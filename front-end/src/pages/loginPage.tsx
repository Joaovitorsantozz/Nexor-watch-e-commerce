import "../index.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  interface formValues {
    email: string;
    password: string;
  }
  const handleLogin = (values: formValues) => {
    Axios.post("http://localhost:3000/login", {
      email: values.email,
      password: values.password,
    })
      .then((response) => {
        //deu certo
        const token = response.data.token;
        if (token) {
          alert(response.data.message);
          localStorage.setItem("token", token);
          navigate("/user-profile");
        } else {
          alert("Erro ao logar, verifique o email e a senha");
        }

        // redirecionar para a página do usuário
      })
      .catch((error) => {
        alert(error.response.data.message);
        console.log(error.response.data.message);
      });
  };
  const validateLogin = yup.object().shape({
    email: yup.string().email().required("Este não é um email válido"),
    password: yup
      .string()
      .min(8)
      .required("A senha deve conter mais de 8 caracteres"),
  });

  return (
    <section className="login-section">
      <a className="didot" href="/">
        Nexor
      </a>

      <div className="login-container">
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={handleLogin}
          validationSchema={validateLogin}
        >
          <Form className="login-form">
            <h2 className="inter">Fazer Login</h2>

            <label htmlFor="email" className="inter">
              {" "}
              Email
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
              Senha
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
            <a className="password-reset inter">Esqueceu a senha?</a>
            <button className="form-login-button inter">Fazer Login</button>

            <a className="register-button inter" href="/register">
              Não possui conta ainda? Registre-se aqui
            </a>
          </Form>
        </Formik>
      </div>
    </section>
  );
}
export default LoginPage;
