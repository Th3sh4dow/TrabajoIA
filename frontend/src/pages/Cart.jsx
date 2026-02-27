import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Bar from "../components/Navbar.jsx";
import "../css/Cart.css";

function Cart() {
  const [carritos, setCarritos] = useState([]);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchCarritos = async () => {
      try {
        const res = await fetch("http://localhost:3001/cart");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCarritos(data);
        } else {
          setCarritos([]);
          console.error("La respuesta no es un array:", data);
        }
      } catch (err) {
        console.error(err);
        setCarritos([]);
        showNotification("Error al cargar los carritos", "error");
      }
    };
    fetchCarritos();
  }, []);

  const calculateTotal = (items) => {
    if (!items) return 0;
    // Si items ya es un objeto/array, no hace falta parsear
    const parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    return parsedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  };

  const handlePayment = async (carritoId, total) => {
    // Simulación de pago
    showNotification("Procesando pago...", "success");

    // Aquí podrías integrar con una pasarela de pago real
    setTimeout(() => {
      showNotification(`¡Pago de $${total.toFixed(2)} completado con éxito!`, "success");

      // Opcional: eliminar el carrito después del pago
      // o marcarlo como "pagado" en la base de datos
    }, 1500);
  };

  return (
    <>
      <Bar />
      <div className="cartContainer">
        <div className="cart-header">
          <h2>PAYMENT TERMINAL</h2>
          <p className="cart-subtitle">Review and process your orders</p>
        </div>

        {carritos.length === 0 ? (
          <div className="emptyCart">
            <p>No pending orders detected</p>
            <p className="empty-sub">Your cart history will appear here</p>
          </div>
        ) : (
          <div className="cart-grid">
            {carritos.map((carrito) => {
              const items = typeof carrito.items === 'string' ? JSON.parse(carrito.items) : (carrito.items || []);
              const total = calculateTotal(items);

              return (
                <div key={carrito.id} className="cart-card">
                  <div className="cart-card-header">
                    <div>
                      <h3>ORDER #{carrito.id}</h3>
                      <p className="cart-date">
                        {new Date(carrito.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="cart-status">PENDING</div>
                  </div>

                  <div className="cart-items-list">
                    {items.map((item, i) => (
                      <div key={i} className="cart-item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">${Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cart-card-footer">
                    <div className="cart-total">
                      <span>TOTAL</span>
                      <span className="total-amount">${total.toFixed(2)}</span>
                    </div>
                    <button
                      className="payment-btn"
                      onClick={() => handlePayment(carrito.id, total)}
                    >
                      <span>PROCESS PAYMENT</span>
                      <span className="payment-icon">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {notification && (
          <div className={`notification ${notification.type}`}>
            <span className="notificationIcon">{notification.type === "success" ? "✓" : "⚠"}</span>
            <span>{notification.message}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
