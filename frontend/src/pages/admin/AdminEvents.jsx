/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null); // Para saber qué evento se está editando
  const [eventData, setEventData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [jwtToken] = useState(localStorage.getItem("jwt"));
  const eventTypeMap = {
    WEDDING: "Boda",
    CHRISTENING: "Bautizo",
    COMMUNION: "comunión",
  }

  useEffect(() => {
    getEvents();
  }, []);

  // Validar los datos del evento antes de enviarlos
  function validateEventData(event) {
    setError("");

    const eventToValidate = eventData[event.id];

    // Comprobar campos obligatorios
    if (!eventToValidate.eventType || !eventToValidate.guests || !eventToValidate.eventDate) {
      setError("Por favor, complete todos los campos obligatorios.");
      return false;
    }

    // Validar número de invitados
    if (eventToValidate.guests <= 0) {
      setError("El número de invitados debe ser mayor que cero.");
      return false;
    }


    // Validar fecha del evento
    const eventDate = new Date(eventToValidate.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(eventDate.getTime())) {
      setError("La fecha del evento no es válida.");
      return false;
    }

    if (eventDate < today) {
      setError("La fecha del evento no puede estar en el pasado.");
      return false;
    }

    return true;
  }

  function getEvents() {
    fetch("/api/v1/events/DTO", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Eventos obtenidos:", data);
        setEvents(data);
      })
      .catch(error => console.error("Error obteniendo eventos:", error));
  }

  function updateEvent(event) {
    // Validar datos antes de enviar
    if (!validateEventData(event)) {
      return;
    }

    const evento = eventData[event.id];
    evento.eventProperties = evento.eventPropertiesDTO;
    delete evento.eventPropertiesDTO;

    fetch(`/api/v1/events/${event.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "PUT",
      body: JSON.stringify(evento),
    })
      .then(response => response.json())
      .then(updatedEvent => {
        console.log("Evento actualizado:", updatedEvent);
        console.log("Aqui");
        setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setEditEventId(null);  // Salimos del modo de edición
        setError(""); // Limpiar errores después de una actualización exitosa
      })
      .catch(error => {
        console.error("Error actualizando evento:", error);
        setError("Error al actualizar el evento. Por favor, inténtelo de nuevo.");
      });
  }

  function deleteEvent(eventId) {
    fetch(`/api/v1/events/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "DELETE",
    })
      .then(() => {
        console.log("Evento eliminado:", eventId);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      })
      .catch(error => console.error("Error eliminando evento:", error));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    const updatedData = {
      ...eventData,
      [editEventId]: {
        ...eventData[editEventId],
        [name]: value,
      }
    };

    setEventData(updatedData);
  }


  function startEditing(event) {
    setEditEventId(event.id);
    setEventData(prevData => ({
      ...prevData,
      [event.id]: event,
    }));
  }

  function handleOnSubmit(event) {
    console.log(event);
    updateEvent(event);
  }

  return (
    <>
      {error && (
        <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {currentUser?.role === "ADMIN" ? (
        events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={index}
              className="service-container"
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "6%",
                maxWidth: "60%", // Limitar el ancho del contenedor
              }}
            >
              <div>
                <h2 className="service-title">Evento #{event.id}</h2>
                <div className="service-info">
                  <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label>Tipo de Evento:</label>
                      <select
                        name="eventType"
                        value={eventData[editEventId]?.eventType || event.eventType}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                        required
                      >
                        {Object.keys(eventTypeMap).map(eventType => (
                          <option key={eventType} value={eventType}>
                            {eventTypeMap[eventType]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label>Invitados:</label>
                      <input
                        type="number"
                        name="guests"
                        value={eventData[editEventId]?.guests || event.guests}
                        onChange={handleInputChange}
                        readOnly={editEventId !== event.id}
                        min="1"
                        required
                      />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                      <label>Fecha:</label>
                      <input
                        type="date"
                        name="eventDate"
                        value={eventData[editEventId]?.eventDate || new Date(event.eventDate).toISOString().split('T')[0]}
                        onChange={handleInputChange}
                        readOnly={editEventId !== event.id}
                        required
                        min={new Date().toISOString().split('T')[0]} // Fecha mínima es hoy
                        style={{
                          borderRadius: "5px",
                          border: "1px solid #ccc",
                          padding: "10px",
                          fontSize: "16px",
                          height: "15px",
                          width: "15%",
                          marginLeft: "5px",
                        }}
                      />
                    </div>
                    {event.eventPropertiesDTO && event.eventPropertiesDTO?.length > 0 || (event.eventProperties && event.eventProperties?.length > 0) ? (
                      <div
                        className="event-properties"
                        style={{
                          border: "1px solid #ccc",
                          padding: "0",
                          borderRadius: "5px",
                          marginTop: "10px",
                          backgroundColor: "#f9f9f9", // Fondo ligeramente diferente para diferenciar
                        }}
                      >
                        <h3 style={{ padding: "10px", margin: "0", backgroundColor: "#efefef", borderRadius: "5px" }}>
                          Propiedades del Evento
                        </h3>
                        <ul style={{ listStyleType: "none", padding: "0" }}>
                          {event.eventPropertiesDTO?.map((prop, i) => (
                            <li key={i} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                              {/* Si hay Venue asociado */}
                              {prop.venueDTO && (
                                <p><strong>Ubicación:</strong> {prop.venueDTO.name} ({prop.venueDTO.cityAvailable})</p>
                              )}

                              {/* Si hay OtherService asociado */}
                              {prop.otherServiceDTO && (
                                <p><strong>Servicio:</strong> {prop.otherServiceDTO.name} ({prop.otherServiceDTO.cityAvailable})</p>
                              )}

                              <p><strong>Aprobado:</strong> {prop.approved ? "Sí" : "No"}</p>
                              <p><strong>Fecha de Solicitud:</strong> {new Date(prop.requestDate).toLocaleDateString("es-ES")}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p>Este evento no tiene propiedades adicionales.</p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-service">
            <p>No hay eventos disponibles.</p>
          </div>
        )
      ) : (
        <p>No tienes permisos para ver esta sección.</p>
      )}
    </>
  );
}

export default AdminEvents;
