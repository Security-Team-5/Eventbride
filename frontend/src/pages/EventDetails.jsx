import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../static/resources/css/EventDetails.css";

function EventDetails() {
  const [evento, setEvento] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Obtener la lista de evento
  function getEvents() {
    fetch(`/api/v1/events/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log("evento obtenido:", data);
        setEvento(data);
      })
      .catch(error => console.error("Error obteniendo evento:", error));
    setEvento(null);
  }

  // Función para eliminar el evento
  function deleteEvent() {
    fetch(`/api/v1/events/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then(response => {
        if (response.ok) {
          console.log("Evento eliminado correctamente");
          // Redirigir a la página principal
          navigate("/");
        } else {
          console.error("Error al eliminar el evento");
        }
      })
      .catch(error => console.error("Error eliminando evento:", error));
  }

  // Abrir modal
  const openModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setIsDeleteModalOpen(false);
  };

  // Cargar evento al montar el componente
  useEffect(() => {
    console.log("eventoId", id);
    getEvents();
  }, []);

  // Convertir tipo de evento a español
  const tipoDeEvento = (type) => {
    switch (type) {
      case "WEDDING":
        return "Boda";
      case "CHRISTENING":
        return "Bautizo";
      case "COMMUNION":
        return "Comunión";
      default:
        return "Evento desconocido";
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  };

  // Decodificar caracteres especiales en caso de problemas de codificación
  const decodeText = (text) => {
    try {
      return decodeURIComponent(escape(text));
    } catch {
      return text;
    }
  };
  console.log

  return (
    <>
      <div className="event-contain">
        <div className="event-details">
          <div className="event-header">
            <h2 className="event-title">{tipoDeEvento(evento?.eventType)}</h2>
            <button className="delete-button" onClick={openModal}>Eliminar Evento</button>
          </div>
          <div className="event-info">
            <p className="event-date">Fecha: {formatearFecha(evento?.eventDate)}</p>
            <p className="event-guests">Invitados: {evento?.guests}</p>
            <p className="event-budget">
              Presupuesto: {evento?.budget?.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="event-venues">
            <h3>Recinto contratado</h3>
            {evento?.eventPropertiesDTO?.map((prop, i) =>
              prop.venueDTO ? (
                <div key={i} className="venue-card">
                  <p><strong>Nombre:</strong> {decodeText(prop.venueDTO.name)}</p>
                  <p><strong>Ubicación:</strong> {decodeText(prop.venueDTO.address)}</p>
                  <div style={{ textAlign: "center" }}>
                    <img style={{ maxWidth: "80%" }} src={prop.venueDTO.picture} alt="Venue" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <button className="payment-buttom" onClick={() => navigate(`/payment/${prop.id}`)}>
                      Pagar señal
                    </button>
                  </div>
                </div>

              ) : null
            )}
          </div>

          <div className="event-services">
            <h3>Otros servicios contratados</h3>
            {evento?.eventPropertiesDTO?.map((prop, i) =>
              prop.otherServiceDTO ? (
                <div key={i} className="service-card">
                  <p><strong>Servicio:</strong> {decodeText(prop.otherServiceDTO.name)}</p>
                  <div style={{ textAlign: "center" }}>
                    <img style={{ maxWidth: "80%" }} src={prop.otherServiceDTO.picture} alt="Other-service" />
                  </div>
                  <p><strong>Descripción:</strong> {decodeText(prop.otherServiceDTO.description)}</p>
                  <div style={{ textAlign: "center" }}>
                    <button
                      className="payment-buttom"
                      disabled={prop.status === "PENDING" || prop.status === "COMPLETED"}
                      onClick={() => navigate(`/payment/${prop.id}`)}
                    >
                        {prop.status === "PENDING"
                        ? "Pendiente de aprobación"
                        : prop.status === "APROVED"
                        ? "Pagar señal"
                        : prop.status === "DEPOSIT_PAID"
                        ? "Pago Final"
                        : prop.status === "COMPLETED"
                        ? "Servicio pagado"
                        : "Pagar"}
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

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
  );
}

export default EventDetails;
