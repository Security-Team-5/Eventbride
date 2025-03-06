/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import logo from "../static/resources/images/logo-eventbride.png";
import "../static/resources/css/Home.css";
import "../static/resources/css/AppNavBar.css";

import { useCurrentUser } from "../hooks/useCurrentUser";

// eslint-disable-next-line react/prop-types
function Home({ user }) {
  return (
    <main className="contenedorPrincipal">
      {/* Banner de ancho completo */}
      <div className="bannerCompleto">
        <img src="https://t4.ftcdn.net/jpg/04/10/98/29/360_F_410982967_TiQ653hlfXQrI4vuLpEBwMpLOYR013fK.jpg" alt="Banner principal" className="imagenBanner" />
        <div className="overlayBanner">
          <div className="contenidoBanner">
            <img src={logo} alt="Eventbride Logo" className="logo-home" />
            <p className="subtituloBanner">Expertos en la organización de bodas, bautizos y comuniones</p>
            <button className="botonPrimario">Crear evento</button>
          </div>
        </div>
      </div>

      {/* Sección de bienvenida y quiénes somos */}
      <section className="seccionBienvenida">
        <div className="contenedor">
          <div className="encabezadoCentrado">
            <h2 className="tituloSeccion">Bienvenidos</h2>
            <div className="separador"></div>
            <p className="textoDescriptivo">
              ¡Bienvenido a Eventbride, donde cada momento especial se convierte en una celebración única y sin preocupaciones!
            </p>
          </div>

          <div className="seccionQuienesSomos">
            <h2 className="tituloSeccion">Quiénes Somos</h2>
            <div className="contenedorColumnas">
              <div className="tarjeta">
                <h3 className="tituloTarjeta">Nuestra Misión</h3>
                <p className="textoTarjeta">
                  Nuestra misión es ayudarte a planificar y organizar esos momentos tan especiales en la vida: comuniones, bautizos y bodas.
                  Con nuestras herramientas fáciles de usar, podrás gestionar todos los detalles importantes, desde las fechas hasta los proveedores,
                  y asegurarte de que tu celebración sea perfecta.
                </p>
              </div>
              <div className="tarjeta">
                <h3 className="tituloTarjeta">Nuestra Visión</h3>
                <p className="textoTarjeta">
                  En Eventbride, nuestra misión es hacer que la organización sea fácil, eficiente y libre de estrés.
                  Nos comprometemos a ofrecer una plataforma intuitiva que permita a los usuarios gestionar cada detalle con confianza y tranquilidad.
                  Queremos que disfrutes del proceso de planificación, asegurándonos de que cada evento sea memorable y único, sin preocuparte por los pequeños detalles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de valores o servicios */}
      <section className="seccionValores">
        <div className="contenedor">
          <h2 className="tituloSeccion">Packs destacados</h2>
          <div className="contenedorValores">
            {[
              {
                title: "Bautizos",
                description: "Nos comprometemos a ofrecer productos y servicios de la más alta calidad.",
              },
              {
                title: "Bodas",
                description: "Actuamos con honestidad y transparencia en todas nuestras operaciones.",
              },
              {
                title: "Comuniones",
                description: "Buscamos constantemente nuevas formas de mejorar y superar expectativas.",
              },
            ].map((valor, index) => (
              <div key={index} className="tarjetaValor">
                <h3 className="tituloValor">{valor.title}</h3>
                <p className="textoValor">{valor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home;
