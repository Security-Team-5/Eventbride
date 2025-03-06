import "../static/resources/css/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";
import carta from "../static/resources/images/carta.png";
import usuario from "../static/resources/images/user.png";

function Navbar() {
  //const {currentUser, loading} = useCurrentUser(null)

  // Obtener datos user desde localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const renderNavList = () => {
    if (!currentUser) {
      return (
        <p className="navbar-list">
          <a href="/terminos-y-condiciones">
          Términos y Condiciones
          </a>
        </p>
      );
    }
    // TODO cambiar este tipo de implicaciones por el role correcto
    if (currentUser.role === "CLIENT") {
      return (
        <div className="navbar-flex">
          <p className="navbar-list"><a href="/miseventos">Mis eventos</a></p>
          <p className="navbar-list"><a href="/lugares">Lugares</a></p>
          <p className="navbar-list"><a href="/proveedores">Proveedores</a></p>
          <p className="navbar-list"><a href="/invitaciones">Invitaciones</a></p>
          <p className="navbar-list"><a href="/terminos-y-condiciones">Términos y Condiciones</a></p>
        </div>
      );
    }

    if (currentUser.role === "SUPPLIER") {
      return (
        <div>
          <p className="navbar-list"><a href="/misservicios">Mis servicios</a></p>
          <p className="navbar-list"><a href="/terminos-y-condiciones">Términos y Condiciones</a></p>
        </div>
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
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;