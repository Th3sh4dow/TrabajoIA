import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Login from "./pages/Login.jsx";
import Cart from "./pages/Cart.jsx";
import Reviews from "./pages/Reviews.jsx";

import Account from "./pages/Account.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}

export default App;
