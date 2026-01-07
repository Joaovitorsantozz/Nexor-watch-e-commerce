import { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import "../index.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
function UserProfile() {
  const navigate = useNavigate();
  interface User {
    email: string;
    name: string;
    cpf?: string;
    country: string;
    telephone?: string;
    birthday?: string;
  }

  const [user, setUser] = useState<User>({
    name: "Não Informado",
    email: "Não Informado",
    cpf: "Não informado",
    country: "Não Informado",
    telephone: "Não Informado",
    birthday: "Não Informado",
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleEdit = (values: User) => {
    console.log("SUBMIT CHAMADO", values);
    const updateFields: Partial<User> = {};
    (Object.keys(values) as (keyof User)[]).forEach((key) => {
      if (values[key] !== user[key]) {
        updateFields[key] = values[key];
      }
    });

    if (Object.keys(updateFields).length == 0) {
      alert("Nenhuma alteração foi realizada");
      return;
    }
    Axios.patch("http://localhost:3000/user-profile", updateFields, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.message == "Campos alterados") {
          alert("Campos alterados com sucesso");
        }
        setUser((prev) => ({ ...prev, ...updateFields }));
        setIsEditing(false);
      })
      .catch((error) => {
        if (error.response.data.message == "cpf invalido") {
          alert("Cpf inválido");
        }
      });
  };
  const validateEdit = yup.object({
    email: yup
      .string()
      .email("Esse não é um email válido")
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    cpf: yup
      .string()
      .matches(/^\d{11}$/, "Insira um CPF válido")
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    telephone: yup
      .string()
      .matches(/^\d{11}$/, "Insira um número de telefone válido")
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    name: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    country: yup
      .string()
      .transform((v) => (v === "" ? null : v))
      .nullable(),

    birthday: yup
      .date()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .nullable(),
  });
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      navigate("/login");
      return;
    }

    Axios.get("http://localhost:3000/user-profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        alert("Sessão inválida. Faça login novamente.");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="user-section">
      <TopBar></TopBar>

      <div className="user-container">
        <SideBar />
        <main className="profile-content">
          <header className="profile-header">
            <h2 className="inter">Dados Pessoais</h2>
          </header>
          <Formik
            onSubmit={handleEdit}
            validationSchema={validateEdit}
            enableReinitialize
            initialValues={{
              name: user.name,
              email: user.email,
              cpf: user.cpf,
              country: user.country,
              telephone: user.telephone,
              birthday: user.birthday,
            }}
          >
            <Form className="user-profile-form">
              <article className="info-card">
                <div className="info-row">
                  <span className="label didot">Nome</span>
                  {isEditing ? (
                    <Field name="name" type="text" placeholder="Nome" />
                  ) : (
                    <span className="value inter">{user.name}</span>
                  )}
                </div>

                <div className="info-row">
                  <span className="label didot">Email</span>
                  {isEditing ? (
                    <Field name="email" type="email" placeholder="Email" />
                  ) : (
                    <span className="value inter">{user.email}</span>
                  )}
                </div>

                <div className="info-row">
                  <span className="label didot">CPF</span>
                  {isEditing ? (
                    <Field name="cpf" type="text" placeholder="CPF" />
                  ) : (
                    <span className="value inter">{user.cpf}</span> //verificar
                  )}
                </div>

                <div className="info-row">
                  <span className="label didot">País</span>
                  {isEditing ? (
                    <Field name="country" type="text" placeholder="País" />
                  ) : (
                    <span className="value inter">{user.country}</span>
                  )}
                </div>

                <div className="info-row">
                  <span className="label didot">Telefone</span>
                  {isEditing ? (
                    <Field
                      name="telephone"
                      type="text"
                      placeholder="Telefone"
                    />
                  ) : (
                    <span className="value inter">{user.telephone}</span>
                  )}
                </div>

                <div className="info-row">
                  <span className="label didot">Data de nascimento</span>

                  {isEditing ? (
                    <Field name="birthday" type="date" />
                  ) : (
                    <span className="value inter">
                      {user.birthday
                        ? new Date(user.birthday).toLocaleDateString("pt-BR")
                        : "—"}
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <div className="actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit">Save</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="user-profile-button inter"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </button>
                )}
              </article>
            </Form>
          </Formik>
        </main>
      </div>
    </section>
  );
}

export default UserProfile;
