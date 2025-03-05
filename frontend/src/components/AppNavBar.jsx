import "../components/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";
import carta from "../static/resources/images/carta.png";
import usuario from "../static/resources/images/user.png";
import { useCurrentUser } from "../hooks/useCurrentUser";

function Navbar() {
  const {currentUser, loading} = useCurrentUser(null)

  const renderNavList = () => {
    if (!currentUser) {
      return (
        <ul className="navbar-list">
          <li><a href="/terminos">Términos y Condiciones</a></li>
        </ul>
      );
    }
    // TODO cambiar este tipo de implicaciones por el role correcto
    if (currentUser.userType === "CLIENT") {
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

    if (currentUser.userType === "SUPPLIER") {
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
          <div className="navbar-user">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("jwt");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;