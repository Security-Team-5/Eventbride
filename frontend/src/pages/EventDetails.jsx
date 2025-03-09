import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../static/resources/css/EventDetails.css";

function EventDetails() {
  const [evento, setEvento] = useState(null);
  const { id } = useParams();

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

  return (
    <>
          <div className="event-contain">
            <div className="event-details">
              <h2 className="event-title">{tipoDeEvento(evento?.eventType)}</h2>
              <div className="event-info">
                <p className="event-date">Fecha: {formatearFecha(evento?.eventDate)}</p>
                <p className="event-guests">Invitados: {evento?.guests}</p>
                <p className="event-budget">
                  Presupuesto: {evento?.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </p>
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div className="event-venues">
                <h3>Recinto contratado</h3>
                {evento?.eventPropertiesDTO?.map((prop, i) =>
                  prop.venueDTO ? (
                    <div key={i} className="venue-card">
                      <p><strong>Nombre:</strong> {decodeText(prop.venueDTO.name)}</p>
                      <p><strong>Ubicación:</strong> {decodeText(prop.venueDTO.address)}</p>
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
                      <p><strong>Descripción:</strong> {decodeText(prop.otherServiceDTO.description)}</p>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
    </>
  );
}

export default EventDetails;
