"use client"

import logo from "../static/resources/images/logo-eventbride.png"
import React from "react"
import { ChevronRight, Calendar, Heart, Users } from 'lucide-react'
import "../static/resources/css/Home.css"

export default function HomePage() {
  return (
    <main className="main-container">
      {/* Hero Section - Adjusted to work with navbar */}
      <section className="hero-section">
        <div className="hero-background">
          <img
            src="https://m.media-amazon.com/images/I/81EcVQNQQeL._AC_UF894,1000_QL80_.jpg"
            alt="Wedding celebration"
            className="hero-image"
          />
        </div>
        <div className="hero-content">
          <div className="hero-card">
            <br></br>
            <br></br>
            <br></br>
            <img
              src={logo}
              alt="Eventbride Logo"
              className="logo"
            />
            <h1 className="hero-title">
              Eventos que brillan, recuerdos que perduran
            </h1>
            <br></br>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="container">
          <h2 className="section-title">Bienvenidos a Eventbride</h2>
          <div className="separator"></div>
          <p className="section-description">
            En Eventbride transformamos tus momentos especiales en celebraciones únicas y sin preocupaciones.
            Nos encargamos de cada detalle para que tú solo tengas que disfrutar.
          </p>
        </div>
      </section>

      {/* Create Event Section */}
      <section className="create-section">
        <div className="container">
          <h2 className="section-title">Crear y organiza tu evento</h2>

          <div className="card-grid">
            <div className="card text-center">
              <div className="card-header">
                <h3 className="card-title">Crear de cero</h3>
              </div>
              <div className="card-content">
                <p className="card-text">
                  Crea un evento de cero a tu gusto con total libertad para personalizar cada detalle.
                </p>
                <div className="icon-container">
                  <Calendar className="icon" />
                </div>
              </div>
              <div className="card-footer">
                <a href="/create-events" className="primary-button">
                  Crear evento
                </a>
              </div>
            </div>

            <div className="card text-center">
              <div className="card-header">
                <h3 className="card-title">¿Estás indeciso? Te ayudamos</h3>
              </div>
              <div className="card-content">
                <p className="card-text">
                  Te ofrecemos un cuestionario para ayudarte a que puedas encontrar el evento perfecto para ti.
                </p>
                <div className="icon-container">
                  <Users className="icon" />
                </div>
              </div>
              <div className="card-footer">
                <a href="/quiz" className="primary-button">
                  Cuestionario
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">Quiénes Somos</h2>
          <div className="card-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Nuestra Misión</h3>
              </div>
              <div className="card-content">
                <p className="card-text">
                  Nuestra misión es ayudarte a planificar y organizar esos momentos tan especiales en la vida:
                  comuniones, bautizos y bodas. Con nuestras herramientas fáciles de usar, podrás gestionar
                  todos los detalles importantes, desde las fechas hasta los proveedores, y asegurarte de
                  que tu celebración sea perfecta.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Nuestra Visión</h3>
              </div>
              <div className="card-content">
                <p className="card-text">
                  En Eventbride, nuestra visión es hacer que la organización sea fácil, eficiente y libre de estrés.
                  Nos comprometemos a ofrecer una plataforma intuitiva que permita a los usuarios gestionar cada
                  detalle con confianza y tranquilidad. Queremos que disfrutes del proceso de planificación,
                  asegurándonos de que cada evento sea memorable y único.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="packages-section">
        <div className="container">
          <h2 className="section-title">Packs destacados</h2>

          <div className="card-grid three-columns">
            {[
              {
                title: "Bautizos",
                description: "Un día lleno de amor y emoción para dar la bienvenida a una nueva vida. Celebra con nosotros.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReVZ4M-45A4jnndySU7F9GaRcscuHMrwbMrQ&s"
              },
              {
                title: "Bodas",
                description: "El día más especial merece una celebración inolvidable. Creamos el ambiente perfecto para tu gran momento.",
                image: "https://www.bodas.net/assets/img/listing-sector/16.webp"
              },
              {
                title: "Comuniones",
                description: "Un evento único para un día inolvidable. Hacemos que la primera comunión sea mágica.",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1Df_ccGZsbFI-cnwUzWGe5WK6nm5USLnZVw&s"
              }
            ].map((pack, index) => (
              <div key={index} className="card">
                <div className="card-image-container">
                  <img src={pack.image || "/placeholder.svg"} alt={pack.title} className="card-image" />
                </div>
                <div className="card-header">
                  <h3 className="card-title">{pack.title}</h3>
                </div>
                <div className="card-content text-center">
                  <p className="card-text">{pack.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">¿Listo para crear tu evento perfecto?</h2>
          <p className="cta-description">
            Comienza hoy mismo a planificar tu boda, bautizo o comunión con Eventbride
          </p>
        </div>
      </section>
    </main>
  )
}
