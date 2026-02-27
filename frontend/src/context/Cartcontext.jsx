import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    if (!product) return;
    const cleanProduct = {
      ...product,
      price: product.price ? Number(product.price) : 0
    };
    setCart(prev => [...prev, cleanProduct]);
  }

  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
