import sampleimg from "../assets/watch-sample.png";
let i = 0;
function ShopSec() {
  return (
    <section className="shop-section">
      <div className="shop-container">
        <h2 className="inter">Recomendados para você</h2>
        <div className="itens-box">{watchBox()}{watchBox()}{watchBox()}{watchBox()}</div>
      </div>
    </section>
  );
}

function watchBox() {
  return (
    <div className="item-unique">
      <div className="item-unique-image">
        <img src={sampleimg}></img>
      </div>
      <div className="item-information">
        <h3 className="item-brand inter">CASSIO</h3>
        <h2 className="item-model">A618WA-1</h2>
      </div>
      <div className="item-price-box">
        <p className="item-price-span inter">Preço na loja online</p>
        <span className="item-price inter">R$329,00</span>
      </div>

      <a className="buy-button">Comprar</a>
    </div>
  );
}
export default ShopSec;
