import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import '../css/Navbar.css';
import cartIcon from "../assets/shopping-cart.svg";
import acountIcon from "../assets/user.svg"
import { useUser } from "../context/UserContext";

function Navbar() {
  const { user, logout } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccountClick = (e) => {
    if (user) {
      e.preventDefault();
      setShowDropdown(!showDropdown);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <nav className="barraArriba">
      {/* Logo */}
      <div className="logoSection">
        <div className="logoPlaceholder">NB</div>
        <h3 className="brandName">NEONBITE</h3>
      </div>

      {/* Links centrales */}
      <div className="linksSection">
        <Link to="/" className="navLink">HOME</Link>
        <Link to="/menu" className="navLink">MENU</Link>
        <Link to="/reviews" className="navLink">REVIEWS</Link>
      </div>

      {/* Iconos derecha */}
      <div className="iconsSection">
        <Link to="/cart" className="iconBtn">
          <img src={cartIcon} alt="Carrito" />
        </Link>

        <div className="accountWrapper" ref={dropdownRef}>
          <button className="iconBtn" onClick={handleAccountClick}>
            <img src={acountIcon} alt="Cuenta" />
            {user && <span className="userDot"></span>}
          </button>

          {showDropdown && user && (
            <div className="accountDropdown">
              <div className="dropdownHeader">
                <div className="avatarSmall">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="userDetails">
                  <p className="userName">{user.name}</p>
                  <p className="userEmail">{user.email}</p>
                </div>
              </div>
              <div className="dropdownDivider"></div>
              <Link to="/account" className="dropdownItem" onClick={() => setShowDropdown(false)}>Mi Perfil</Link>
              <button className="dropdownItem logout" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
