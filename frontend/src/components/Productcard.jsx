import '../css/ProductCard.css';

function ProductCard({ name, price, image }) {
  return (
    <div className="productCard">
      <img src={image} alt={name} />
      <h4>{name}</h4>
      <span className="price">${price}</span>
      <button className='btnBuy'>AÑADIR AL CARRITO</button>
    </div>
  );
}

export default ProductCard;
