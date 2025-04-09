/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../static/resources/css/Payment.css";
import PaypalButtom from "../../components/PaypalButtom";

export default function Payment() {
  const [eventProp, setEventProp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [price, setPrice] = useState(0)
  const [status, setStatus] = useState("CARGANDO")
  const { id } = useParams()
  const [comision, setComision] = useState(0)
  const commissionRate = 0.05 // Comisión del 5%, con cambiar esta constante cambia toda la lógica de comisión


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
        setEventProp(data)

        if (data.status === "APPROVED") {
          setStatus("DEPOSITO PARA RESERVA");
          const depositCommission = data.depositAmount * commissionRate; // Calcular comisión del depósito
          setComision(depositCommission);
          setPrice(data.depositAmount + depositCommission); // Sumar comisión al depósito
        } else {
          setStatus("CANTIDAD RESTANTE");
          const remainingCommission = (data.pricePerService - data.depositAmount) * commissionRate; // Calcular comisión del monto restante
          setComision(remainingCommission);
          setPrice(data.pricePerService - data.depositAmount + remainingCommission); // Sumar comisión al monto restante
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
                  <VenueDetails venue={eventProp.venueDTO} eventProp={eventProp} requestDate={eventProp.requestDate} />
                ) : eventProp.otherServiceDTO ? (
                  <ServiceDetails service={eventProp.otherServiceDTO} eventProp={eventProp} requestDate={eventProp.requestDate} />
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
                      <span className="price">{(price - comision).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                    </div>

                    <div className="summary-item">
                      {/* La fórmula saca el porcentaje de comisión de la constante en vez de ser texto fijo */}
                      <span>Gastos de gestión ({(commissionRate * 100).toFixed(0)}%)</span>
                      <span className="price">{comision.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
                    </div>

                    <div className="separator"></div>

                    <div className="summary-item total">
                      <span>Total</span>
                      <span className="price">{price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</span>
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

function VenueDetails({ venue, eventProp, requestDate }) {
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
              Horario: {eventProp.startTime} - {eventProp.finishTime}
            </span>
          </div>
          <div className="detail-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ fontWeight: "bold" }}>Tarifa</span>
            {(eventProp.venueDTO.limitedByPricePerGuest == false && eventProp.venueDTO.limitedByPricePerHour == false) && (
              <span>💰 Precio fijo: {eventProp.venueDTO.fixedPrice}€</span>
            )}
            {(eventProp.venueDTO.limitedByPricePerGuest == true && eventProp.venueDTO.limitedByPricePerHour == false) && (
              <span>👤 Precio por invitado: {eventProp.venueDTO.servicePricePerGuest}€</span>
            )}
            {(eventProp.venueDTO.limitedByPricePerGuest == false && eventProp.venueDTO.limitedByPricePerHour == true) && (
              <span>⏳ Precio por hora: {eventProp.venueDTO.servicePricePerHour}€</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceDetails({ service, eventProp, requestDate }) {
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
            <span className="icon">🕒</span>
            <span>
              Horario: {eventProp.startTime} - {eventProp.finishTime}
            </span>
          </div>
          <div className="detail-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <span style={{ fontWeight: "bold" }}>Tarifa</span>
            {(eventProp.otherServiceDTO.limitedByPricePerGuest == false && eventProp.otherServiceDTO.limitedByPricePerHour == false) && (
              <span>💰 Precio fijo: {eventProp.otherServiceDTO.fixedPrice}€</span>
            )}
            {(eventProp.otherServiceDTO.limitedByPricePerGuest == true && eventProp.otherServiceDTO.limitedByPricePerHour == false) && (
              <span>👤 Precio por invitado: {eventProp.otherServiceDTO.servicePricePerGuest}€</span>
            )}
            {(eventProp.otherServiceDTO.limitedByPricePerGuest == false && eventProp.otherServiceDTO.limitedByPricePerHour == true) && (
              <span>⏳ Precio por hora: {eventProp.otherServiceDTO.servicePricePerHour}€</span>
            )}
          </div>
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
