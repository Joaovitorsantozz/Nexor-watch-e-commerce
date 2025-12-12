import img1 from "../assets/relogio-header.png";
function Header() {
  return (
    <header className="header-home">
      <div className="header-left">
        <img src={img1}></img>
      </div>
      <div className="header-right">
        <h3 className="didot">Nexor</h3>
        <h2 className="inter">O tempo nunca foi tão elegante. Descubra o brilho que define você</h2>

        <a className="header-cta-button inter">Descubra Mais</a>
      </div>
    </header>
  );
}

export default Header;
