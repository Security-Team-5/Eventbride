/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../static/resources/css/Payment.css";
import PaypalButtom from "../components/PaypalButtom";

export default function Payment() {
  const [eventProp, setEventProp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [price, setPrice] = useState(0)
  const [status, setStatus] = useState("CARGANDO")
  const { id } = useParams()
  const [comision, setComision] = useState(0)


  useEffect(() => {
    const jwt = localStorage.getItem("jwt")
    if (!jwt) {
      setError("No se ha encontrado la sesión. Por favor, inicie sesión de nuevo.")
      setLoading(false)
      return
    }

    async function getEventProp() {
      try {
        setLoading(true)
        const response = await fetch(`/api/event-properties/DTO/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          method: "GET",
        })

        if (!response.ok) {
          throw new Error("Error al obtener los datos del evento")
        }

        const data = await response.json()
        console.log("Event propertie obtenido:", data)
        setEventProp(data)

        if (data.status === "APPROVED") {
          setStatus("DEPOSITO PARA RESERVA")
          setPrice(data.depositAmount)
        } else {
          setStatus("CANTIDAD RESTANTE")
          setComision((data.depositAmount + data.pricePerService) * 0.02)
          setPrice(data.pricePerService - data.depositAmount + comision)
        }
      } catch (error) {
        console.error("Error obteniendo evento:", error)
        setError("No se pudo cargar la información del evento. Inténtelo de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    getEventProp()
  }, [id, status, price, comision])

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <div className="card-header">
            <h2 className="card-title">Error</h2>
            <p className="card-description">{error}</p>
          </div>
          <div className="card-footer">
            <button className="btn btn-primary" onClick={() => window.history.back()}>
              Volver
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="card-header">
          <h1 className="card-title">Pago del Servicio</h1>
          <p className="card-description">Complete el pago para confirmar su reserva</p>
        </div>

        {loading ? (
          <div className="card-content">
            <LoadingState />
          </div>
        ) : eventProp ? (
          <>
            <div className="card-content">
              {/* Service Information */}
              <div className="service-info">
                {eventProp.venueDTO ? (
                  <VenueDetails venue={eventProp.venueDTO} requestDate={eventProp.requestDate} />
                ) : eventProp.otherServiceDTO ? (
                  <ServiceDetails service={eventProp.otherServiceDTO} requestDate={eventProp.requestDate} />
                ) : (
                  <div className="no-info">
                    <div className="icon-container">ℹ️</div>
                    <p>No hay información disponible para este servicio.</p>
                  </div>
                )}
              </div>

              {/* Payment Summary */}
              <div className="payment-summary">
                <h3 className="summary-title">Resumen del Pago</h3>
                <h3 className="summary-title">Tipo de pago: {status}</h3>
                <div className="summary-card">
                  <div className="summary-content">
                    <div className="summary-item">
                      <span>Precio base</span>
                      <span className="price">
                        {price - comision}€
                      </span>
                    </div>

                    <div className="separator"></div>

                    <div className="summary-item total">
                      <span>Total</span>
                      <span>{price}€</span>
                      <b></b>
                      {comision !== 0 ? <span>Se añadió una comisión de {comision}€ por gastos de gestión</span> : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="payment-button-container">
                <PaypalButtom amount={price} paymentType={status} eventProp={eventProp} />
              </div>
              <p className="terms-text">Al completar el pago, acepta nuestros términos y condiciones de servicio.</p>
            </div>
          </>
        ) : (
          <div className="card-content empty-content">
            <div className="icon-container">ℹ️</div>
            <p>No se encontró información para este servicio.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function VenueDetails({ venue, requestDate }) {
  return (
    <div className="venue-details">
      <div className="venue-header">
        <h2 className="venue-title">{venue.name}</h2>
        <div className="date-info">
          <span className="icon">📅</span>
          <span>Fecha solicitada: {requestDate || "No especificada"}</span>
        </div>
      </div>

      <div className="venue-image">
        <img src={venue.picture || "https://via.placeholder.com/600x400"} alt={venue.name} />
      </div>

      <div className="venue-details-grid">
        <div className="details-column">
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>
              {venue.address}, {venue.cityAvailable} ({venue.postalCode})
            </span>
          </div>
          <div className="detail-item">
            <span className="icon">👥</span>
            <span>Capacidad máxima: {venue.maxGuests} invitados</span>
          </div>
          <div className="detail-item">
            <span className="icon">📏</span>
            <span>Superficie: {venue.surface} m²</span>
          </div>
        </div>

        <div className="details-column">
          <div className="detail-item">
            <span className="icon">🕒</span>
            <span>
              Horario: {venue.earliestTime} - {venue.latestTime}
            </span>
          </div>
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>Precio por invitado: {venue.servicePricePerGuest}€</span>
          </div>
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>Precio por hora: {venue.servicePricePerHour}€</span>
          </div>
        </div>
      </div>

      <div className="availability-badge">
        <span className={venue.available ? "badge-success" : "badge-error"}>
          {venue.available ? "✅ Disponible" : "❌ No Disponible"}
        </span>
      </div>
    </div>
  )
}

function ServiceDetails({ service, requestDate }) {
  return (
    <div className="service-details">
      <div className="service-header">
        <h2 className="service-title">{service.name}</h2>
        <div className="date-info">
          <span className="icon">📅</span>
          <span>Fecha solicitada: {requestDate || "No especificada"}</span>
        </div>
        <p className="service-description">{service.description}</p>
      </div>

      <div className="service-image">
        <img src={service.picture || "https://via.placeholder.com/600x400"} alt={service.name} />
      </div>

      <div className="service-details-grid">
        <div className="details-column">
          <div className="detail-item">
            <span className="icon">ℹ️</span>
            <span>{service.extraInformation}</span>
          </div>
          <div className="detail-item">
            <span className="icon">📍</span>
            <span>Disponible en: {service.cityAvailable}</span>
          </div>
          <div className="detail-item">
            <span className="icon">🏷️</span>
            <span>Tipo: {service.otherServiceType}</span>
          </div>
        </div>

        <div className="details-column">
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>Precio fijo: {service.fixedPrice}€</span>
          </div>
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>Precio por invitado: {service.servicePricePerGuest}€</span>
          </div>
          <div className="detail-item">
            <span className="icon">💰</span>
            <span>Precio por hora: {service.servicePricePerHour}€</span>
          </div>
        </div>
      </div>

      <div className="limits-grid">
        <div className="limit-item">
          <span>Limitado por invitado:</span>
          <span className="badge-outline">{service.limitedByPricePerGuest ? "✅ Sí" : "❌ No"}</span>
        </div>
        <div className="limit-item">
          <span>Limitado por hora:</span>
          <span className="badge-outline">{service.limitedByPricePerHour ? "✅ Sí" : "❌ No"}</span>
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-header">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-subtitle"></div>
      </div>

      <div className="skeleton skeleton-image"></div>

      <div className="loading-details-grid">
        <div className="loading-column">
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
        <div className="loading-column">
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>

      <div className="skeleton skeleton-button"></div>
    </div>
  )
}
