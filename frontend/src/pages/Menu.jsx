import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Menu.css";
import Bar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductcardMenu.jsx";
import { useCart } from "../context/Cartcontext";
import { useUser } from "../context/UserContext";

function Menu() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { user } = useUser();
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);

  const platos = ["TODOS", "ENTRANTES", "PRIMEROS", "SEGUNDOS", "POSTRES", "BEBIDAS"];

  // Añadir al carrito de forma segura
  // Añadir al carrito de forma segura
  // addToCart is now imported from context


  // Fetch seguro de productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Error al obtener productos");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Datos de productos inválidos:", data);
        }
      } catch (err) {
        console.error("Error fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Checkout seguro
  // Checkout seguro
  const checkout = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío");
      return;
    }

    if (!user) {
      alert("Debes iniciar sesión para realizar un pedido");
      navigate("/login");
      return;
    }

    try {
      const payload = cart.map((item) => ({
        name: item.name || "Sin nombre",
        price: Number(item.price || 0),
      }));

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payload, user_id: user.id }),
      });

      if (!res.ok) throw new Error("Error guardando el carrito");

      const data = await res.json();
      console.log("Carrito guardado:", data);

      // Opcional: limpiar carrito después de compra exitosa?
      // clearCart(); 

      navigate("/cart"); // redirige a página del carrito
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar el carrito");
    }
  };


  // Calcular subtotal y total de forma segura
  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const shipping = 2.5;
  const total = subtotal + shipping;

  return (
    <div className="divMenu">
      <Bar />

      <div className="menuButtons">
        {platos.map((plato, index) => (
          <button
            key={index}
            className={`btnPlatos ${selected === index ? "active" : ""}`}
            onClick={() => setSelected(index)}
          >
            {plato}
          </button>
        ))}
      </div>

      <div className={`menuLayout ${cart.length > 0 ? "with-cart" : ""}`}>
        {/* Productos */}
        <div className="carousel">
          {Array.isArray(products) &&
            products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name || "Sin nombre"}
                price={product.price || 0}
                image={product.image_url}
                onAdd={() => addToCart(product)}
              />
            ))}
        </div>

        {/* Carrito */}
        <div className="cartPanel">
          <h4>Tu Pedido</h4>

          {cart.length === 0 && <p className="empty">El carrito está vacío</p>}

          {cart.map((item, index) => (
            <div key={index} className="cartItem">
              <span>{item.name || "Sin nombre"}</span>
              <span>${Number(item.price).toFixed(2)}</span>
            </div>
          ))}

          {cart.length > 0 && (
            <>
              <div className="cartDivider"></div>

              <div className="cartSummary">
                <div className="summaryRow">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="summaryRow">
                  <span>Transporte</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>

                <div className="summaryRow total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button className="checkoutBtn" onClick={checkout}>
                  Finalizar compra
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Menu;
