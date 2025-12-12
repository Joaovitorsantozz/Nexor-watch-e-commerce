import Navbar from "../components/navbar";
import TopBar from "../components/topbar";
import "../index.css";
import imgSample from "../assets/loja-img.jpg";
import Header from "./header";
import ShopSec from "./shopsec"
function Home() {
  return (
    <section className="home-section">
      <TopBar></TopBar>
      <Navbar></Navbar>
      <Header></Header>
      <div className="home-section-container">
        <div className="home-section-left">
          <h2 className="inter">
            Bem-vindo à Nexor, autorizada oficial em São Paulo
          </h2>
          <p className="inter">
            A Nexor orgulha-se de integrar um circuito exclusivo de
            distribuidores certificados, comprometidos em entregar produtos
            legítimos e serviço de excelência.
          </p>
          <p className="inter">
            A Nexor combina tradição e excelência para oferecer uma experiência
            singular. Cada atendimento é conduzido por especialistas preparados
            para orientar com precisão.
          </p>
          <a className="home-section-cta inter">Marcar Visita</a>
        </div>
        <div className="home-section-right">
            <img src={imgSample}></img>
        </div>
      </div>
      <ShopSec></ShopSec>
    </section>
  );
}

export default Home;
