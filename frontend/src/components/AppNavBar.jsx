import React from "react";
import "../components/AppNavBar.css";
import logo from "../static/resources/images/logo-eventbride.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="Eventbride Logo" className="navbar-logo" />
        <span className="navbar-title">Eventbride</span>
      </div>
      <ul className="navbar-list">
        <li><a href="/">Inicio</a></li>
        <li><a href="/perfil">Perfil</a></li>
        <li><a href="/miseventos">Mis eventos</a></li>
        <li><a href="/lugares">Lugares</a></li>
        <li><a href="/proveedores">Proveedores</a></li>
        <li><a href="/invitaciones">Invitaciones</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;