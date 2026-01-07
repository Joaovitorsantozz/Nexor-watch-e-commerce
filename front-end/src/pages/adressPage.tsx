import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";
import Select from "../assets/icons/selected.png";
import { Link } from "react-router-dom";
import Axios from "axios";

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
    is_default: boolean;
  }

  const [adress, setAdress] = useState<Adress[]>([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAddresses();
  }, []);

  function fetchAddresses() {
    Axios.get("http://localhost:3000/adresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const list = res.data;

        if (!Array.isArray(list)) {
          setAdress([]);
          return;
        }

        const normalized = list.map((item: any) => ({
          ...item,
          is_default: item.is_default === 1 || item.is_default === true,
        }));

        setAdress(normalized);
      })
      .catch(() => setAdress([]));
  }

  function handleSetDefault(id: number) {
    Axios.patch(
      `http://localhost:3000/adress/${id}/set-default`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        fetchAddresses();
      })
      .catch((err) => {
        console.error("Erro ao definir endereço padrão", err);
      });
  }

  const deleteAdress = async (adressId: number) => {
    try {
      await Axios.delete(`http://localhost:3000/delete-adress/${adressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdress((prev) => prev.filter((item) => item.id !== adressId));
    } catch (error) {
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

            {adress.map((item) => (
              <div
                key={item.id}
                className={`adress-box ${item.is_default ? "default" : ""}`}
              >
                {item.is_default && (
                  <img src={Select} className="adress-box-selectedimage"></img>
                )}
                <p>{item.is_default}</p>
                <p className="inter">
                  {item.country_name} - {item.state_name}
                </p>

                <p className="inter">
                  {item.street}, {item.number}
                </p>

                <p className="inter">
                  {item.city_name}, {item.neighborhood}
                </p>

                <div className="ab-edit">
                  {!item.is_default && (
                    <>
                      <button onClick={() => handleSetDefault(item.id)}>
                        Tornar padrão
                      </button>
                      <p className="inter">|</p>
                    </>
                  )}

                  <button
                    onClick={() => {
                      const confirmacao = window.confirm(
                        "Tem certeza que deseja excluir este endereço?"
                      );
                      if (confirmacao) {
                        deleteAdress(item.id);
                      }
                    }}
                  >
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
