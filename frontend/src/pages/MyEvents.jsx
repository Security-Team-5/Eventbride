import { useEffect, useState } from "react";
import "../static/resources/css/MyEvents.css";

function MyEvents() {
  const [evento, setEvento] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Obtener el evento
  function getEvent() {
    fetch(`/api/v1/events/next/${currentUser.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Evento obtenido:", data);
        setEvento(data);
      })
      .catch(error => console.error("Error obteniendo evento:", error));
  }

  // Cargar evento al montar el componente
  useEffect(() => {
    getEvent();
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

  return (
    <>
      <div className="event-container">
        {evento ? (
          <div className="event-details">
            <h2 className="event-title">{tipoDeEvento(evento.eventType)}</h2>
            <div className="event-info">
              <p className="event-date">Fecha: {formatearFecha(evento.eventDate)}</p>
              <p className="event-guests">Invitados: {evento.guests}</p>
              <p className="event-budget">
                Presupuesto: {evento.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
              </p>
            </div>
          </div>
        ) : (
          <div className="no-event">
            <p>No hay eventos disponibles en este momento.</p>
          </div>
        )}
      </div>

      {evento && (
        <div className="event-properties">
          <div className="event-venues">
            <h3>Recinto contratado</h3>
            {evento.eventPropertiesDTO?.map((prop, index) =>
              prop.venueDTO ? (
                <div key={index} className="venue-card">
                  <p><strong>Nombre:</strong> {decodeText(prop.venueDTO.name)}</p>
                  <p><strong>Ubicación:</strong> {decodeText(prop.venueDTO.address)}</p>
                </div>
              ) : null
            )}
          </div>
          <div className="event-services">
            <h3>Otros servicios contratados</h3>
            {evento.eventPropertiesDTO?.map((prop, index) =>
              prop.otherServiceDTO ? (
                <div key={index} className="service-card">
                  <p><strong>Servicio:</strong> {decodeText(prop.otherServiceDTO.name)}</p>
                  <p><strong>Descripción:</strong> {decodeText(prop.otherServiceDTO.description)}</p>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

    </>
  );
}

export default MyEvents;
