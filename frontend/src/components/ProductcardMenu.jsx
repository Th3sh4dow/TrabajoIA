import '../css/ProductCard.css';

function ProductCard({ name, price, image,type,onAdd }) {
  return (
    <div className="productCard">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <span className="price">${price}</span>
       <button className="btnBuy" onClick={onAdd}>
        AÑADIR AL CARRITO
      </button>
    </div>
  );
}

export default ProductCard;
