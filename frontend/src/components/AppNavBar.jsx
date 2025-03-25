import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../static/resources/css/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";
import carta from "../static/resources/images/carta.png";
import usuario from "../static/resources/images/user.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Obtener datos user desde localStorage
  const [currentUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Detectar scroll para cambiar la apariencia del navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cerrar el dropdown al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".nav-dropdown-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  const renderNavItems = () => {
    if (!currentUser || !currentUser.role) {
      return null;
    }

    if (currentUser.role === "CLIENT") {
      return (
        <ul className="nav-links">
          <li>
            <Link to="/events" className="nav-link">Mis eventos</Link>
          </li>
          <li className="nav-dropdown-container">
            <button className="nav-link dropdown-trigger" onClick={toggleDropdown}>
              Crear evento
              <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                <Link to="/create-events" className="dropdown-item">Desde cero</Link>
                <Link to="/quiz" className="dropdown-item">Cuestionario</Link>
              </div>
            )}
          </li>
          <li>
            <Link to="/venues" className="nav-link">Recintos</Link>
          </li>
          <li>
            <Link to="/other-services" className="nav-link">Otros servicios</Link>
          </li>
          <li>
            <Link to="/invitaciones" className="nav-link">Invitaciones</Link>
          </li>
          <li>
            <Link to="/terminos-y-condiciones" className="nav-link">Términos y Condiciones</Link>
          </li>
        </ul>
      );
    }

    if (currentUser.role === "SUPPLIER") {
      return (
        <ul className="nav-links">
          <li>
            <Link to="/misservicios" className="nav-link">Mis servicios</Link>
          </li>
          <li>
            <Link to="/terminos-y-condiciones" className="nav-link">Términos y Condiciones</Link>
          </li>
          <li>
            <Link to="/solicitudes" className="nav-link">Solicitudes</Link>
          </li>
          <li className="nav-link" style={{backgroundColor:"red"}}>{currentUser.plan}</li>
        </ul>
      );
    }

    if (currentUser.role === "ADMIN") {
      return (
        <ul className="nav-links">
          <li>
            <Link to="/admin-services" className="nav-link">Administrar servicios</Link>
          </li>
          <li>
            <Link to="/admin-users" className="nav-link">Administrar usuarios</Link>
          </li>
          <li>
            <Link to="/admin-events" className="nav-link">Administrar eventos</Link>
          </li>
        </ul>
      );
    }

    return null;
  };

  return (
    <div>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" className="brand-link">
              <img src={logo || "/placeholder.svg"} alt="Eventbride Logo" className="navbar-logo" />
              <span className="navbar-title">Inicio</span>
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Navigation links */}
          <div className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
            {renderNavItems()}

            {currentUser && currentUser.role && (
              <div className="navbar-actions">
                <Link to="/" className="action-icon messages-icon">
                  <img src={carta || "/placeholder.svg"} alt="Mensajes" className="icon-img" />
                  <span className="notification-badge">2</span>
                </Link>

              <div className="user-menu">
                <Link to="/profile" className="action-icon user-icon">
                  <img src={usuario || "/placeholder.svg"} alt="Usuario" className="icon-img" />
                </Link>
                <div className="user-name">{currentUser.username || "Usuario"}</div>
              </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
