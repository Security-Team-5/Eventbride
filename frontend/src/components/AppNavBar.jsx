/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../static/resources/css/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";
import carta from "../static/resources/images/carta.png";
import usuario from "../static/resources/images/user.png";
import apiClient from "../apiClient"
import { AlertCircle } from "lucide-react";

function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventProps, setEventProps] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = user;

  useEffect(() => {
    if(currentUser){
      if (currentUser.role === "SUPPLIER") {
        setLoading(true);
      }
    }
  }, [currentUser]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if(currentUser && currentUser.role === "SUPPLIER"){
      const fetchServices = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/api/event-properties/pending/${currentUser.id}`);
          setEventProps(response.data);
        } catch (error) {
          console.error("Error fetching services:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchServices();
    }
  }, [currentUser]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".nav-dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const renderNavItems = () => {
    if (!currentUser || !currentUser.role) return null;

    if (currentUser.role === "CLIENT") {
      return (
        <ul className="nav-links">
          <li><Link to="/events" className="nav-link">Mis eventos</Link></li>
          <li><Link to="/create-events" className="nav-link">Crear evento</Link></li>
          <li><Link to="/venues" className="nav-link">Recintos</Link></li>
          <li><Link to="/other-services" className="nav-link">Otros servicios</Link></li>
          <li><Link to="/invitaciones" className="nav-link">Invitaciones</Link></li>
          <li><Link to="/terminos-y-condiciones" className="nav-link">Términos y Condiciones</Link></li>
        </ul>
      );
    }

    if (currentUser.role === "SUPPLIER" || !loading) {
      return (
        <ul className="nav-links">
          <li><Link to="/misservicios" className="nav-link">Mis servicios</Link></li>
          <li><Link to="/terminos-y-condiciones" className="nav-link">Términos y Condiciones</Link></li>
          <li className="flex items-center gap-1">
            <Link to="/solicitudes" className="nav-link">Solicitudes</Link>
            {eventProps && eventProps.length > 0 && (
              <AlertCircle className="text-red-500 w-4 h-4" />
            )}
          </li>
        </ul>
      );
    }

    if (currentUser.role === "ADMIN") {
      return (
        <ul className="nav-links">
          <li><Link to="/admin-services" className="nav-link">Administrar servicios</Link></li>
          <li><Link to="/admin-users" className="nav-link">Administrar usuarios</Link></li>
          <li><Link to="/admin-events" className="nav-link">Administrar eventos</Link></li>
        </ul>
      );
    }

    return null;
  };

  if (loading) {
    return null;
  }

  return (
    <div>
    {currentUser &&(
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          {currentUser === "{}" ? (
            <span className="brand-link disabled-link">
              <img src={logo} alt="Eventbride Logo" className="navbar-logo" />
              <span className="navbar-title">Inicio</span>
            </span>
          ) : (
            <Link to="/" className="brand-link">
              <img src={logo} alt="Eventbride Logo" className="navbar-logo" />
              <span className="navbar-title">Inicio</span>
            </Link>
          )}
        </div>

        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <div className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {renderNavItems()}
          {currentUser && currentUser.role && (
            <div className="navbar-actions">
              <Link to="/chats" className="action-icon messages-icon">
                <img src={carta} alt="Mensajes" className="icon-img" />
                <span className="notification-badge">2</span>
              </Link>

              <div className="user-menu">
                <Link to="/profile" className="action-icon user-icon" style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  background: "transparent",
                }}>
                  <div className="profile-pic-wrapper" style={{ height: "40px", overflow: "hidden" }}>
                    {currentUser.profilePicture?.trim() && (
                      <img
                        src={currentUser.profilePicture}
                        alt="Foto de perfil"
                        style={{
                          maxWidth: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                </Link>
                <div className="user-name">{currentUser.username || "Usuario"}</div>
              </div>

              {currentUser.role === "SUPPLIER" && (
                <li
                  className="nav-link"
                  style={{
                    background: currentUser.plan === "PREMIUM"
                      ? "linear-gradient(45deg, #FFD700, #FFC107, #FFA000)"
                      : "silver",
                    color: "black",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    border: currentUser.plan === "PREMIUM"
                      ? "2px solid #DAA520"
                      : "2px solid rgb(133, 133, 133)",
                    boxShadow: currentUser.plan === "PREMIUM"
                      ? "0px 0px 10px rgba(114, 114, 114, 0.8)"
                      : "none",
                  }}
                >
                  {currentUser.plan}
                </li>
              )}

              <button className="logout-button" onClick={handleLogout} style={{ marginBottom: "3%" }}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
    )}
    </div>
  );
}

export default Navbar;
