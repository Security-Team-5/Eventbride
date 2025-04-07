"use client"

import { useState, useEffect } from "react"
import logo from "../../static/resources/images/logo-eventbride.png"
import { Calendar, Handshake, Users, TrendingUp, PartyPopper, ChevronRight, Clock, Settings, Palette, CheckCircle } from 'lucide-react'
import "../../static/resources/css/Home.css"

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState({ role: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const userData = localStorage.getItem("user")
      if (userData) {
        setCurrentUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Shared components
  const HeroSection = () => (
    <section className="hero-section">
      <div className="hero-background">
        <img
          src="https://m.media-amazon.com/images/I/81EcVQNQQeL._AC_UF894,1000_QL80_.jpg"
          alt="Wedding celebration"
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <div className="hero-card">
          <img src={logo || "/placeholder.svg"} alt="Eventbride Logo" className="logo" />
          <h1 className="hero-title">Eventos que brillan, recuerdos que perduran</h1>
          <p className="hero-subtitle">Especialistas en bodas, bautizos y comuniones</p>
        </div>
      </div>
    </section>
  )

  const AboutSection = () => (
    <section className="about-section">
      <div className="about-background"></div>
      <div className="container">
        <div className="about-header">
          <h2 className="section-title">Quiénes Somos</h2>
          <div className="separator"></div>
          <p className="about-tagline">Transformando la organización de eventos en una experiencia digital fluida y personalizada</p>
        </div>

        <div className="about-cards-container">
          <div className="about-card">
            <div className="about-card-content">
              <h3 className="about-card-title">Nuestra Misión</h3>
              <p className="about-card-text">
                Facilitar la organización de eventos especiales a través de una plataforma digital intuitiva que conecta a clientes con los mejores proveedores del sector.
              </p>
              <ul className="about-feature-list">
                <li><CheckCircle size={16} className="list-icon" /> Herramientas digitales para gestionar todos los detalles</li>
                <li><CheckCircle size={16} className="list-icon" /> Conexión directa entre proveedores y clientes</li>
                <li><CheckCircle size={16} className="list-icon" /> Personalización completa de cada evento</li>
              </ul>
            </div>
            <div className="about-card-image">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000"
                alt="Planificación de eventos"
                className="about-image"
              />
              <div className="image-overlay-gradient"></div>
            </div>
          </div>

          <div className="about-card reverse">
            <div className="about-card-content">
              <h3 className="about-card-title">Nuestra Visión</h3>
              <p className="about-card-text">
                Revolucionar la industria de eventos con tecnología que simplifica procesos y permite a cada persona crear celebraciones únicas sin complicaciones.
              </p>
              <ul className="about-feature-list">
                <li><CheckCircle size={16} className="list-icon" /> Plataforma intuitiva para gestionar cada detalle</li>
                <li><CheckCircle size={16} className="list-icon" /> Experiencia personalizada para cada tipo de evento</li>
                <li><CheckCircle size={16} className="list-icon" /> Acceso a los mejores proveedores del sector</li>
              </ul>
            </div>
            <div className="about-card-image">
              <img
                src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1000"
                alt="Celebración de boda"
                className="about-image"
              />
              <div className="image-overlay-gradient"></div>
            </div>
          </div>
        </div>

        <div className="about-values">
          <div className="value-item">
            <div className="value-icon-container">
              <Clock className="value-icon" />
            </div>
            <h4 className="value-title">Eficiencia</h4>
            <p className="value-text">Optimizamos cada paso del proceso</p>
          </div>
          <div className="value-item">
            <div className="value-icon-container">
              <Palette className="value-icon" />
            </div>
            <h4 className="value-title">Personalización</h4>
            <p className="value-text">Cada detalle adaptado a tus deseos</p>
          </div>
          <div className="value-item">
            <div className="value-icon-container">
              <Settings className="value-icon" />
            </div>
            <h4 className="value-title">Tecnología</h4>
            <p className="value-text">Innovación al servicio de tus eventos</p>
          </div>
        </div>
      </div>
    </section>
  )

  // CLIENT VIEW
  if (currentUser.role === "CLIENT") {
    return (
      <main className="main-container">
        <HeroSection />

        <section className="welcome-section">
          <div className="welcome-background"></div>
          <div className="container">
            <div className="welcome-header">
              <h2 className="section-title">Bienvenido a Eventbride</h2>
              <div className="separator"></div>
              <p className="welcome-tagline">Tu plataforma digital para organizar bodas, comuniones y bautizos de forma ágil y personalizada</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <Calendar className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Organización Ágil</h3>
                <p className="benefit-text">
                  Nuestra plataforma automatiza procesos para que puedas organizar tu evento en menos tiempo y con menos esfuerzo.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">70%</span>
                  <span className="stat-label">menos tiempo de planificación</span>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <Palette className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Personalización Total</h3>
                <p className="benefit-text">
                  Controla cada aspecto de tu evento con herramientas digitales que te permiten personalizar hasta el último detalle.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">personalizable</span>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <Users className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Proveedores Verificados</h3>
                <p className="benefit-text">
                  Conecta directamente con proveedores verificados para todos los servicios que necesites para tu evento.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">200+</span>
                  <span className="stat-label">proveedores en la plataforma</span>
                </div>
              </div>
            </div>

            <div className="welcome-cta">
              <a href="/other-services" className="text-link">
                Descubre todas las funcionalidades <ChevronRight size={16} className="inline-icon" />
              </a>
            </div>
          </div>
        </section>

        <section className="create-section">
          <div className="create-background"></div>
          <div className="container">
            <div className="create-header">
              <h2 className="section-title">Crea y organiza tu evento</h2>
              <div className="separator"></div>
              <p className="create-tagline">Herramientas digitales que simplifican cada paso del proceso</p>
            </div>

            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Selecciona tu tipo de evento</h3>
                  <p className="step-text">Elige entre boda, bautizo o comunión y personaliza las opciones según tus necesidades.</p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Personaliza cada detalle</h3>
                  <p className="step-text">Configura fechas, ubicaciones, invitados, servicios y todos los elementos de tu evento.</p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Conecta con proveedores</h3>
                  <p className="step-text">Selecciona entre nuestra red de proveedores verificados y gestiona tus contrataciones.</p>
                </div>
              </div>

              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Gestiona tu evento</h3>
                  <p className="step-text">Controla todos los aspectos de tu evento desde un único panel centralizado.</p>
                </div>
              </div>
            </div>

            <div className="create-options">
              <div className="create-option-card">
                <div className="option-icon-container">
                  <Calendar className="option-icon" />
                </div>
                <h3 className="option-title">Crear de cero</h3>
                <p className="option-text">
                  Comienza un evento desde cero con total libertad para personalizar cada detalle según tus preferencias.
                </p>
                <a href="/create-events" className="option-button">
                  Crear evento <ChevronRight size={16} className="ml-2" />
                </a>
              </div>

              <div className="create-option-card">
                <div className="option-icon-container">
                  <PartyPopper className="option-icon" />
                </div>
                <h3 className="option-title">Explorar servicios</h3>
                <p className="option-text">
                  Descubre todos los servicios disponibles en nuestra plataforma para complementar tu evento.
                </p>
                <a href="/other-services" className="option-button">
                  Ver servicios <ChevronRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />

        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">¿Listo para crear tu evento perfecto?</h2>
            <p className="cta-description">
              Comienza hoy mismo a planificar tu boda, bautizo o comunión con Eventbride
            </p>
            <a href="/create-events" className="cta-button">
              Comenzar ahora <ChevronRight size={16} className="ml-2" />
            </a>
          </div>
        </section>
      </main>
    )
  }

  // SUPPLIER VIEW
  if (currentUser.role === "SUPPLIER") {
    return (
      <main className="main-container">
        <HeroSection />

        <section className="welcome-section">
          <div className="welcome-background"></div>
          <div className="container">
            <div className="welcome-header">
              <h2 className="section-title">Bienvenido a Eventbride</h2>
              <div className="separator"></div>
              <p className="welcome-tagline">Tu plataforma digital para conectar con clientes y gestionar tus servicios de eventos</p>
            </div>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <Users className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Más Clientes</h3>
                <p className="benefit-text">
                  Accede a una amplia base de clientes buscando servicios para bodas, bautizos y comuniones.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">+50%</span>
                  <span className="stat-label">más visibilidad</span>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <Calendar className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Gestión Simplificada</h3>
                <p className="benefit-text">
                  Administra reservas, pagos y comunicaciones con clientes desde un único panel de control.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">-30%</span>
                  <span className="stat-label">tiempo administrativo</span>
                </div>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon-container">
                  <TrendingUp className="benefit-icon" />
                </div>
                <h3 className="benefit-title">Crecimiento</h3>
                <p className="benefit-text">
                  Expande tu negocio con herramientas digitales diseñadas para proveedores de eventos.
                </p>
                <div className="benefit-stat">
                  <span className="stat-number">+40%</span>
                  <span className="stat-label">crecimiento promedio</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="create-section">
          <div className="create-background"></div>
          <div className="container">
            <div className="create-header">
              <h2 className="section-title">Gestiona tu negocio</h2>
              <div className="separator"></div>
              <p className="create-tagline">Herramientas digitales para optimizar tus servicios de eventos</p>
            </div>

            <div className="create-options">
              <div className="create-option-card">
                <div className="option-icon-container">
                  <TrendingUp className="option-icon" />
                </div>
                <h3 className="option-title">Mis servicios</h3>
                <p className="option-text">
                  Visualiza, añade y edita tus servicios para que lleguen a todos nuestros usuarios.
                </p>
                <a href="/admin-services" className="option-button">
                  Gestionar servicios <ChevronRight size={16} className="ml-2" />
                </a>
              </div>

              <div className="create-option-card">
                <div className="option-icon-container">
                  <Handshake className="option-icon" />
                </div>
                <h3 className="option-title">Gestiona solicitudes</h3>
                <p className="option-text">
                  Administra las solicitudes de clientes de forma intuitiva y eficiente.
                </p>
                <a href="/solicitudes" className="option-button">
                  Ver solicitudes <ChevronRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />

        <section className="cta-section">
          <div className="container">
            <h2 className="cta-title">Haz crecer tu negocio con nosotros</h2>
            <p className="cta-description">Añade nuevos servicios y llega a más clientes potenciales</p>
            <a href="/misservicios/registrar" className="cta-button">
              Añadir servicio <ChevronRight size={16} className="ml-2" />
            </a>
          </div>
        </section>
      </main>
    )
  }

  // ADMIN VIEW
  if (currentUser.role === "ADMIN") {
    return (
      <main className="main-container">
        <HeroSection />

        <section className="welcome-section">
          <div className="welcome-background"></div>
          <div className="container">
            <div className="welcome-header">
              <h2 className="section-title">Administración de Eventbride</h2>
              <div className="separator"></div>
              <p className="welcome-tagline">Panel de control para gestionar todos los aspectos de la plataforma</p>
            </div>
          </div>
        </section>

        <section className="create-section">
          <div className="create-background"></div>
          <div className="container">
            <div className="create-header">
              <h2 className="section-title">Panel de control</h2>
              <div className="separator"></div>
              <p className="create-tagline">Gestiona usuarios, servicios y eventos desde un único lugar</p>
            </div>

            <div className="admin-dashboard">
              <div className="admin-card">
                <div className="admin-icon-container">
                  <Users className="admin-icon" />
                </div>
                <h3 className="admin-title">Usuarios</h3>
                <p className="admin-text">Gestiona los usuarios de la plataforma, tanto clientes como proveedores.</p>
                <a href="/admin-users" className="admin-button">
                  Gestionar usuarios <ChevronRight size={16} className="ml-2" />
                </a>
              </div>

              <div className="admin-card">
                <div className="admin-icon-container">
                  <PartyPopper className="admin-icon" />
                </div>
                <h3 className="admin-title">Servicios</h3>
                <p className="admin-text">Supervisa y modera todos los servicios ofrecidos en la plataforma.</p>
                <a href="/admin-services" className="admin-button">
                  Gestionar servicios <ChevronRight size={16} className="ml-2" />
                </a>
              </div>

              <div className="admin-card">
                <div className="admin-icon-container">
                  <Calendar className="admin-icon" />
                </div>
                <h3 className="admin-title">Eventos</h3>
                <p className="admin-text">Visualiza y gestiona todos los eventos creados en la plataforma.</p>
                <a href="/admin-events" className="admin-button">
                  Gestionar eventos <ChevronRight size={16} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  // DEFAULT VIEW (no role)
  return (
    <main className="main-container">
      <HeroSection />

      <section className="welcome-section">
        <div className="welcome-background"></div>
        <div className="container">
          <div className="welcome-header">
            <h2 className="section-title">Bienvenido a Eventbride</h2>
            <div className="separator"></div>
            <p className="welcome-tagline">Tu plataforma digital para organizar bodas, comuniones y bautizos de forma ágil y personalizada</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon-container">
                <Calendar className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Organización Ágil</h3>
              <p className="benefit-text">
                Nuestra plataforma automatiza procesos para que puedas organizar tu evento en menos tiempo y con menos esfuerzo.
              </p>
              <div className="benefit-stat">
                <span className="stat-number">70%</span>
                <span className="stat-label">menos tiempo de planificación</span>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-container">
                <Palette className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Personalización Total</h3>
              <p className="benefit-text">
                Controla cada aspecto de tu evento con herramientas digitales que te permiten personalizar hasta el último detalle.
              </p>
              <div className="benefit-stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">personalizable</span>
              </div>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon-container">
                <Users className="benefit-icon" />
              </div>
              <h3 className="benefit-title">Proveedores Verificados</h3>
              <p className="benefit-text">
                Conecta directamente con proveedores verificados para todos los servicios que necesites para tu evento.
              </p>
              <div className="benefit-stat">
                <span className="stat-number">200+</span>
                <span className="stat-label">proveedores en la plataforma</span>
              </div>
            </div>
          </div>

          <div className="auth-buttons">
            <a href="/login" className="auth-button primary">
              Iniciar sesión
            </a>
            <a href="/register" className="auth-button secondary">
              Registrarse
            </a>
          </div>
        </div>
      </section>

      <section className="create-section">
        <div className="create-background"></div>
        <div className="container">
          <div className="create-header">
            <h2 className="section-title">Crea y organiza tu evento</h2>
            <div className="separator"></div>
            <p className="create-tagline">Herramientas digitales que simplifican cada paso del proceso</p>
          </div>

          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3 className="step-title">Selecciona tu tipo de evento</h3>
                <p className="step-text">Elige entre boda, bautizo o comunión y personaliza las opciones según tus necesidades.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3 className="step-title">Personaliza cada detalle</h3>
                <p className="step-text">Configura fechas, ubicaciones, invitados, servicios y todos los elementos de tu evento.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3 className="step-title">Conecta con proveedores</h3>
                <p className="step-text">Selecciona entre nuestra red de proveedores verificados y gestiona tus contrataciones.</p>
              </div>
            </div>

            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3 className="step-title">Gestiona tu evento</h3>
                <p className="step-text">Controla todos los aspectos de tu evento desde un único panel centralizado.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AboutSection />

      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Comienza a planificar tu evento hoy</h2>
          <p className="cta-description">Regístrate para acceder a todas las herramientas y servicios de Eventbride</p>
          <a href="/register" className="cta-button">
            Crear cuenta <ChevronRight size={16} className="ml-2" />
          </a>
        </div>
      </section>
    </main>
  )
}
