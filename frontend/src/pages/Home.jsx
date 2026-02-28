import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import Bar from '../components/Navbar.jsx'
import ProductCard from '../components/Productcard.jsx'
import '../css/Home.css'
import Hamburguesa from '../assets/Hamburguesa.png'
import Menu from './Menu.jsx'

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 3)); // Solo los primeros 3
        }
      } catch (err) {
        console.error("Error cargando productos en Home:", err);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <>
      <Bar></Bar>
      {/*Comida recomendada */}
      <div className='comidaRecomendada'>
        <div className="texto">
          <h3>EL SABOR</h3>
          <h3>DEL FUTURO</h3>
          <p>
            Prueba el nuevo sabor del futuro con esta NEON CHEASE BURGUER
          </p>

          <div className="botones">
            <button className='btnBuyNow' onClick={() => navigate("/menu")}>COMPRAR AHORA</button>
            <button className='btnMenu' onClick={() => navigate("/menu")}>EXPLORAR MENU</button>
          </div>
        </div>

        <div className="imagen">
          <img className="fotoInicio" src={Hamburguesa} />
        </div>
      </div>


      {/*Platos recomendados */}

      <div className='otrosDivs'>
        <h6>DESTACADOS DEL MES</h6>
        <h5>Nuestras Joyas Cyberpunk</h5>
        <div className="carousel">
          {products.map(product => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image_url}
            />
          ))}
        </div>
        <div className="infoBox">
          <h4>Tecnología en cada bocado</h4>
          <div className="miniSectionsGrid">
            <div className="infoSmallCard">
              <div className="infoIcon">⚡</div>
              <h6>ENTREGA FLASH</h6>
              <p>Drones autónomos que entregan tu pedido en menos de 15 minutos en cualquier zona de Neo-Tokyo.</p>
            </div>
            <div className="infoSmallCard">
              <div className="infoIcon">🍱</div>
              <h6>ECO-PACKAGING</h6>
              <p>Envases impresos en 3D que se descomponen en 24 horas sin dejar rastro en el medio ambiente.</p>
            </div>
            <div className="infoSmallCard">
              <div className="infoIcon">💳</div>
              <h6>CRYPTO PAY</h6>
              <p>Aceptamos todas las redes principales y créditos locales. Seguridad biométrica garantizada.</p>
            </div>
            <div className="infoSmallCard">
              <div className="infoIcon">🌿</div>
              <h6>100% REGEN</h6>
              <p>Ingredientes cultivados en granjas verticales urbanas alimentadas con energía 100% renovable.</p>
            </div>
          </div>
          <p style={{ marginTop: '25px', fontSize: '0.85rem', opacity: '0.6', textAlign: 'center' }}>
            * Alerta: El consumo de Sushi Digital puede causar destellos de nostalgia por el año 2077.
          </p>
        </div>
      </div>
    </>
  )
}

export default Home;