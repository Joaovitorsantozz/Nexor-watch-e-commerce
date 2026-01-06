import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import trash from "../assets/icons/delete.png";
import edit from "../assets/icons/edit.png";
import { Link } from "react-router-dom";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

import { useEffect, useState } from "react";
function AdressPage() {
  interface Adress {
    id: number;
    country: number;
    country_name: string;
    state: number;
    state_name: string;
    city: number;
    city_name: string;
    neighborhood: string;
    street: string;
    number: string;
  }

  const [adress, setAdress] = useState<Adress[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    Axios.get("http://localhost:3000/adresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Resultados", response.data.result);
        setAdress(response.data);
      })
      .catch((error) => {
        console.log("Erro ao fazer o get Adress", error);
      });
  }, []);

  const deleteAdress = async (adressId: number) => {
    try {
      await Axios.delete(`http://localhost:3000/delete-adress/${adressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdress((prev) => prev.filter((item) => item.id !== adressId));
    } catch(error) {
      console.log("error");
    }
  };
  return (
    <section className="adress-section">
      <TopBar></TopBar>
      <div className="adress-container">
        <SideBar></SideBar>
        <main className="adress-content">
          <header className="adress-header">
            <h2 className="inter">Endereços Cadastrados</h2>
          </header>

          <div className="adress-wrapper">
            <Link to="/adress-register" className="new-adress inter">
              <b>+</b> <br></br>Novo Endereço
            </Link>

            {adress.map((item, index) => (
              <div className="adress-box" key={item.id}>
                <p className="ab-username inter">João Vitor</p>

                <p className="inter">
                  {item.country_name} - {item.state_name}
                </p>

                <p className="ab-street inter">
                  {item.street}, {item.number}
                </p>

                <p className="ab-city inter">
                  {item.city_name}, {item.neighborhood}
                </p>

                <div className="ab-edit">
                  <button className="inter">Editar</button>
                  <p>|</p>
                  <button className="inter" onClick={()=>deleteAdress(item.id)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
}

export default AdressPage;
