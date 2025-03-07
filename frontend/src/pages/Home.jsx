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
      <div className="bannerCompleto">
        <img src="https://t4.ftcdn.net/jpg/04/10/98/29/360_F_410982967_TiQ653hlfXQrI4vuLpEBwMpLOYR013fK.jpg" alt="Banner principal" className="imagenBanner" />
        <div className="overlayBanner">
          <div className="contenidoBanner">
            <img src={logo} alt="Eventbride Logo" className="logo-home" />
            <p className="subtituloBanner">Eventbride. 
              <br></br>
              Eventos que brillan, recuerdos que perduran.</p>
          </div>
        </div>
      </div>

      <section className="seccionValores">
        <div className="contenedor">
          <div className="encabezadoCentrado">
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet"></link>
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
                  <br></br>
                  Con nuestras herramientas fáciles de usar, podrás gestionar todos los detalles importantes, desde las fechas hasta los proveedores,
                  y asegurarte de que tu celebración sea perfecta.
                </p>
              </div>
              <div className="tarjeta">
                <h3 className="tituloTarjeta">Nuestra Visión</h3>
                <p className="textoTarjeta">
                  En Eventbride, nuestra misión es hacer que la organización sea fácil, eficiente y libre de estrés.
                  <br></br>
                  Nos comprometemos a ofrecer una plataforma intuitiva que permita a los usuarios gestionar cada detalle con confianza y tranquilidad.
                  <br></br>
                  Queremos que disfrutes del proceso de planificación, asegurándonos de que cada evento sea memorable y único, sin preocuparte por los pequeños detalles.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="contenedor">
        <div className="seccionQuienesSomos">
            <h2 className="tituloSeccion">Crear evento</h2>
            <div className="contenedorColumnas">
              <div className="tarjeta">
                <h3 className="tituloTarjeta">Crear de cero</h3>
                <p className="textoTarjeta">
                  Crea un evento de cero a tu gusto.
                </p>
                <a href="/create-events"  style={{ display: 'flex', margin: '0 auto', marginTop: '46px', border: '1px solid rgb(0, 0, 0)', backgroundColor: 'rgba(247, 217, 227, 0.96)', borderRadius: '10px', padding: '10px',height: '7%', width: '25%', textAlign: 'center', color: "black", flexDirection:"column", justifyContent:"center"}} >
                  Crear evento
                </a>

              </div>
              <div className="tarjeta">
                <h3 className="tituloTarjeta">¿Estás indeciso? Te ayudamos</h3>
                <p className="textoTarjeta">
                  Te ofrecemos un cuestionario para ayudarte a que puedas encontrar el evento perfecto para ti.
                </p>
                <a style={{ display: 'flex', margin: '0 auto', marginTop: '20px', border: '1px solid rgb(0, 0, 0)', backgroundColor: 'rgba(247, 217, 227, 0.96)', borderRadius: '10px', padding: '10px',height: '7%', width: '25%', textAlign: 'center', color: "black", flexDirection:"column", justifyContent:"center"}} >
                  Cuestionario
                </a>
                </div>
            </div>
          </div>
        </div>
        <div className="contenedor">
          <h2 className="tituloSeccion">Packs destacados</h2>
          <div className="contenedorValores">
            {[
              {
                title: "Bautizos",
                description: "Un día lleno de amor y emoción para dar la bienvenida a una nueva vida. Celebra con nosotros.",
              },
              {
                title: "Bodas",
                description: "El día más especial merece una celebración inolvidable. Creamos el ambiente perfecto para tu gran momento.",
              },
              {
                title: "Comuniones",
                description: "Un evento único para un día inolvidable. Hacemos que la primera comunión sea mágica.",
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
