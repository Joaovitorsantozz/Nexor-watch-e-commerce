import { useEffect, useState } from "react";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import "../index.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
function UserProfile() {
  const navigate = useNavigate();
  interface User {
    id: Number;
    email: string;
    name:string;
    cpf:string;
    country:string;
  }

  const [user, setUser] = useState<User>({
  id: 0,
  name: "",
  email: "",
  cpf: "",
  country:""
});
  const [token, setToken] = useState(localStorage.getItem("token"));
  const getUser = () => {
    const token = localStorage.getItem("token");
    const verificarToken = () => {
      if (!token) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        navigate("/login");
        return;
      }
      setToken(token);
    };
    verificarToken();
    if (token) {
      Axios.get("http://localhost:3000/user-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUser(response.data);
          console.log("USUARIO RECEBIDO",response.data);
        })
        .catch((error) => {
          console.log("erro ao verificar produtos",error);
        });
    }
  };
  useEffect(getUser, []);
  return (
    <section className="user-section">
      <TopBar></TopBar>

      <div className="user-container">
        <SideBar />
        <main className="profile-content">
          <header className="profile-header">
            <h2 className="inter">Dados Pessoais</h2>
          </header>

          <article className="info-card">
            <div className="info-row">
              <span className="label didot">Name</span>
              <span className="value inter">{user.name}</span>
              <span className="label didot">País</span>
              <span className="value inter">{user.country}</span>
            </div>

            <div className="info-row">
              <span className="label didot">Email</span>
              <span className="value inter">{user.email}</span>
              <span className="label didot">Other</span>
              <span className="value inter">Value</span>
            </div>

            <div className="info-row">
              <span className="label didot">CPF</span>
              <span className="value inter">User CPF</span>
              <span className="label didot">Other</span>
              <span className="value inter">Value</span>
            </div>
          </article>
        </main>
      </div>
    </section>
  );
}

export default UserProfile;
