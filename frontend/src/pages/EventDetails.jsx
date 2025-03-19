"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../static/resources/css/EventDetails.css"

function EventDetails() {
  const [evento, setEvento] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCostBreakdownModalOpen, setIsCostBreakdownModalOpen] = useState(false); // Nuevo estado para el modal de desglose
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)




  // Obtener la lista de evento
  function getEvents() {
    setIsLoading(true)
    fetch(`/api/v1/events/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("evento obtenido:", data)
        setEvento(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error obteniendo evento:", error)
        setIsLoading(false)
      })
  }

  // Función para eliminar el evento
  function deleteEvent() {
    fetch(`/api/v1/events/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          console.log("Evento eliminado correctamente")
          // Redirigir a la página principal
          navigate("/")
        } else {
          console.error("Error al eliminar el evento")
        }
      })
      .catch((error) => console.error("Error eliminando evento:", error))
  }

  // Abrir modal
  const openModal = () => {
    setIsDeleteModalOpen(true)
  }

  // Cerrar modal
  const closeModal = () => {
    setIsDeleteModalOpen(false)
  }

  const openCostBreakdownModal = () => {
    setIsCostBreakdownModalOpen(true);
  };

  // Cerrar modal de desglose de precios
  const closeCostBreakdownModal = () => {
    setIsCostBreakdownModalOpen(false);
  };

  // Cargar evento al montar el componente
  useEffect(() => {

    console.log("eventoId", id)
    getEvents()
  }, [id])

  // Convertir tipo de evento a español
  const tipoDeEvento = (type) => {
    switch (type) {
      case "WEDDING":
        return "Boda"
      case "CHRISTENING":
        return "Bautizo"
      case "COMMUNION":
        return "Comunión"
      default:
        return "Evento desconocido"
    }
  }

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" }
    return new Date(fecha).toLocaleDateString("es-ES", opciones)
  }

  // Decodificar caracteres especiales en caso de problemas de codificación
  const decodeText = (text) => {
    try {
      return decodeURIComponent(escape(text))
    } catch {
      return text
    }
  }

  // Obtener el estado del pago en formato legible
  const getPaymentStatusText = (status) => {
    switch (status) {
      case "PENDING":
        return "Pendiente de aprobación"
      case "APPROVED":
        return "Pagar reserva"
      case "DEPOSIT_PAID":
        return "Completar pago"
      case "COMPLETED":
        return "Servicio pagado"
      default:
        return "Pagar"
    }
  }

  // Renderizar el estado de carga
  if (isLoading) {
    return (
      <div className="event-contain loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando detalles del evento...</p>
      </div>
    )
  }

  // Renderizar mensaje si no hay evento
  if (!evento) {
    return (
      <div className="event-contain">
        <div className="no-event">
          <h2>No se encontró el evento</h2>
          <button className="back-button" onClick={() => navigate("/")}>
            Volver a eventos
          </button>
        </div>
      </div>
    )
  }

  const calcularCosteServicios = () => {
    if (!evento || !evento.eventPropertiesDTO) return 0;

    let total = 0;
    for (let i = 0; i < evento.eventPropertiesDTO.length; i++) {
      const prop = evento.eventPropertiesDTO[i];
      total += (prop.setPricePerService || 0);
    }
    return total;
  };
  const calcularDepositServicios = () => {
    if (!evento || !evento.eventPropertiesDTO) return 0;

    let total = 0;
    for (let i = 0; i < evento.eventPropertiesDTO.length; i++) {
      const prop = evento.eventPropertiesDTO[i];
      total += (prop.depositAmount || 0);
    }
    return total;
  };

  const sumaCosteTotalDeposit = () => {
    if (!evento || !evento.eventPropertiesDTO) return 0;

    let total = 0;
    for (let i = 0; i < evento.eventPropertiesDTO.length; i++) {
      const prop = evento.eventPropertiesDTO[i];
      total += (prop.setPricePerService || 0) + (prop.depositAmount || 0);
    }
    return total;
  };

  return (
    <>
      <div className="event-contain">
        <div className="event-details">
          <div className="event-header">
            <div className="event-title-container">
              <span className="event-type-badge">{tipoDeEvento(evento?.eventType)}</span>
              <h2 className="event-title">Detalles del Evento</h2>
            </div>
            <button className="delete-button" onClick={openModal}>
              <i className="delete-icon">✕</i>
              <span>Eliminar</span>
            </button>
          </div>

          
                <div className="event-info-card">
                <div className="event-info">
                  <div className="info-item">
                  <span className="info-label">Fecha:</span>
                  <p className="event-date">{formatearFecha(evento?.eventDate)}</p>
                  </div>
                  <div className="info-item">
                  <span className="info-label">Invitados:</span>
                  <p className="event-guests">{evento?.guests}</p>
                  </div>
                  <div className="info-item">
                  <span className="info-label">Coste acumulado:</span>
                  <p className="event-budget">
                    <u
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={openCostBreakdownModal}
                    >
                    {sumaCosteTotalDeposit().toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                    </u>
                  </p>
                  </div>
                </div>
                </div>
              </div>

              <div className="event-properties-container">
                <div className="event-venues">
                <h3 className="section-title">Recinto contratado</h3>
                {evento?.eventPropertiesDTO?.some((prop) => prop.venueDTO) ? (
                  evento?.eventPropertiesDTO?.map((prop, i) =>
                  prop.venueDTO ? (
                    <div key={i} className="venue-card">
                    <div className="card-header">
                      <h4 className="venue-name">{decodeText(prop.venueDTO.name)}</h4>
                    </div>
                    <div className="venue-image-container">
                      <img
                      className="venue-image"
                      src={prop.venueDTO.picture || "/placeholder.svg"}
                      alt={prop.venueDTO.name}
                      />
                    </div>
                    <div className="venue-details">
                      <p className="venue-address">
                      <span className="detail-label">Ubicación:</span>
                      {decodeText(prop.venueDTO.address)}
                      </p>
                    </div>
                    <div className="payment-container">
                      <button
                      className={`payment-button ${prop.status === "PENDING" || prop.status === "COMPLETED" ? "disabled" : ""}`}
                      disabled={prop.status === "PENDING" || prop.status === "COMPLETED"}
                      onClick={() => navigate(`/payment/${prop.id}`)}
                      >
                      {getPaymentStatusText(prop.status)}
                      </button>
                      <div className="status-indicator">
                      <span className={`status-dot status-${prop.status.toLowerCase()}`}></span>
                      <span className="status-text">{prop.status === "COMPLETED" ? "Pagado" : "En proceso"}</span>
                      </div>
                    </div>
                    </div>
                  ) : null,
                  )
                ) : (
                  <div className="empty-state">
                  <p>No hay recintos contratados</p>
                  </div>
                )}
                </div>

                <div className="event-services">
                <h3 className="section-title">Otros servicios contratados</h3>
                {evento?.eventPropertiesDTO?.some((prop) => prop.otherServiceDTO) ? (
                  evento?.eventPropertiesDTO?.map((prop, i) =>
                  prop.otherServiceDTO ? (
                    <div key={i} className="service-card">
                    <div className="card-header">
                      <h4 className="service-name">{decodeText(prop.otherServiceDTO.name)}</h4>
                    </div>
                    <div className="service-image-container">
                      <img
                      className="service-image"
                      src={prop.otherServiceDTO.picture || "/placeholder.svg"}
                      alt={prop.otherServiceDTO.name}
                      />
                    </div>
                    <div className="service-details">
                      <p className="service-description">
                      <span className="detail-label">Descripción:</span>
                      {decodeText(prop.otherServiceDTO.description)}
                      </p>
                    </div>
                    <div className="payment-container">
                      <button
                      className={`payment-button ${prop.status === "PENDING" || prop.status === "COMPLETED" ? "disabled" : ""}`}
                      disabled={prop.status === "PENDING" || prop.status === "COMPLETED"}
                      onClick={() => navigate(`/payment/${prop.id}`)}
                      >
                      {getPaymentStatusText(prop.status)}
                      </button>
                      <div className="status-indicator">
                      <span className={`status-dot status-${prop.status.toLowerCase()}`}></span>
                      <span className="status-text">{prop.status === "COMPLETED" ? "Pagado" : "En proceso"}</span>
                      </div>
                    </div>
                    </div>
                  ) : null,
                  )
                ) : (
                  <div className="empty-state">
                  <p>No hay servicios adicionales contratados</p>
                  </div>
                )}
                </div>
              </div>
              </div>

              {/* Modal de desglose de precios */}
      {isCostBreakdownModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Desglose de precios</h3>
            </div>

            <h2 style={{ display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" }}>Costes servicios: {calcularCosteServicios().toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h2>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" }}>
              {evento?.eventPropertiesDTO?.map((prop, i) => (
                <div key={i} className="price-breakdown-item">
                  <p><strong>{decodeText(prop.otherServiceDTO?.name || prop.venueDTO?.name)}:</strong> {prop.setPricePerService?.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) || "N/A"}</p>
                </div>
              ))}
            </div>
            <h2 style={{ display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" }}>Señales: {calcularDepositServicios().toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</h2>
            <div className="modal-body" style={{ display: "flex", flexDirection: "column", textAlign: "left", alignItems: "flex-start" }}>
              {evento?.eventPropertiesDTO?.map((prop, i) => (
                <div key={i} className="price-breakdown-item">
                  <p><strong>{decodeText(prop.otherServiceDTO?.name || prop.venueDTO?.name)}:</strong> {prop.depositAmount?.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) || "null"}</p>
                </div>
              ))}
            </div>

            <div className="modal-footer" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <button className="close-button" onClick={closeCostBreakdownModal}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>¿Estás seguro de que quieres eliminar este evento?</h3>
            </div>
            <div className="modal-body">
              <p>Esta acción no se puede deshacer. El evento será eliminado permanentemente.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={deleteEvent}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EventDetails

