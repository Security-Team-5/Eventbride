/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [editEventId, setEditEventId] = useState(null); // Para saber qué evento se está editando
  const [eventData, setEventData] = useState({});
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const eventTypeMap = {
    WEDDING: "Boda",
    CHRISTENING: "Bautizo",
    COMMUNION: "comunión",
  }
  useEffect(() => {
    getEvents();
  }, []);

  function getEvents() {
    fetch("/api/v1/events/DTO", {
      headers: {
        "Content-Type": "application/json",
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
    fetch(`/api/events/${event.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(eventData[event.id]),
    })
      .then(response => response.json())
      .then(updatedEvent => {
        console.log("Evento actualizado:", updatedEvent);
        setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setEditEventId(null);  // Salimos del modo de edición
      })
      .catch(error => console.error("Error actualizando evento:", error));
  }

  function deleteEvent(eventId) {
    fetch(`/api/events/${eventId}`, {
      headers: {
        "Content-Type": "application/json",
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

  return (
    <>
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
                  <form onSubmit={e => { e.preventDefault(); updateEvent(event) }}>
                    <div>
                      <label>Tipo de Evento:</label>
                      <select
                        name="eventType"
                        value={eventData[editEventId]?.eventType || event.eventType} 
                        onChange={handleInputChange}  
                        style={{ width: "100%" }}
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
                      />
                    </div>
                    <div>
                      <label>Presupuesto:</label>
                      <input
                        type="number"
                        name="budget"
                        value={eventData[editEventId]?.budget || event.budget}
                        onChange={handleInputChange}
                        readOnly={editEventId !== event.id}
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
                    {event.eventPropertiesDTO && event.eventPropertiesDTO.length > 0 ? (
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
                          {event.eventPropertiesDTO.map((prop, i) => (
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
                      {editEventId === event.id ? (
                        <div className="button-container">
                          <button className="save-btn" type="submit">Guardar</button>
                          <button className="delete-btn" onClick={() => deleteEvent(event.id)}>Borrar</button>
                      </div>
                      ) : (
                        <div className="button-container">
                          <button onClick={() => startEditing(event)} className="edit-btn">Editar</button>
                          <button className="delete-btn" onClick={() => deleteEvent(event.id)}>Borrar</button>
                        </div>
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
