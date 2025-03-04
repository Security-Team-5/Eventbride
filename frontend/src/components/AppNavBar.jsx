import { useState, useEffect } from "react";
import "../components/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";
import carta from "../static/resources/images/carta.png";
import usuario from "../static/resources/images/user.png";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/current-user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setCurrentUser(null);
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
    };

    fetchCurrentUser();
  }, []);

  const renderNavList = () => {
    if (!currentUser) {
      return (
        <ul className="navbar-list">
          <li><a href="/terminos">Términos y Condiciones</a></li>
        </ul>
      );
    }

    if (currentUser.userType === "cliente") {
      return (
        <ul className="navbar-list">
          <li><a href="/miseventos">Mis eventos</a></li>
          <li><a href="/lugares">Lugares</a></li>
          <li><a href="/proveedores">Proveedores</a></li>
          <li><a href="/invitaciones">Invitaciones</a></li>
          <li><a href="/terminos">Términos y Condiciones</a></li>
        </ul>
      );
    }

    if (currentUser.userType === "proveedor") {
      return (
        <ul className="navbar-list">
          <li><a href="/misservicios">Mis servicios</a></li>
          <li><a href="/terminos">Términos y Condiciones</a></li>
        </ul>
      );
    }

    return null;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Eventbride Logo" className="navbar-logo" />
        <a href="/"><span className="navbar-title">Eventbride</span></a>
      </div>
      {renderNavList()}
      {currentUser && (
        <>
          <div className="navbar-card">
            <a href="/mensajes">
              <img src={carta} alt="Carta" className="carta" />
            </a>
          </div>
          <div className="navbar-user">
            <a href="/perfil">
              <img src={usuario} alt="Usuario" className="usuario" />
            </a>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;