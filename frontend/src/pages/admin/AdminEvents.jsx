/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
      body: JSON.stringify(event),
    })
      .then(response => response.json())
      .then(updatedEvent => {
        console.log("Evento actualizado:", updatedEvent);
        setEvents(prevEvents => prevEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
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

  return (
    <>
      {events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
            <div>
              <h2 className="service-title">Evento #{event.id}</h2>
              <div className="service-info">
                <p><strong>Tipo de Evento:</strong> {event.eventType}</p>
                <p><strong>Invitados:</strong> {event.guests}</p>
                <p><strong>Presupuesto:</strong> {event.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</p>
                <p><strong>Fecha:</strong> {new Date(event.eventDate).toLocaleDateString("es-ES")}</p>
                <p><strong>Propiedades:</strong></p>
                {event.eventPropertiesDTO && event.eventPropertiesDTO.length > 0 ? (
                  <div className="event-properties">
                    <h3>Propiedades del Evento</h3>
                    <ul>
                      {event.eventPropertiesDTO.map((prop, i) => (
                        <li key={i}>
                          <p><strong>Aprobado:</strong> {prop.approved ? "Sí" : "No"}</p>
                          <p><strong>Fecha de Solicitud:</strong> {new Date(prop.requestDate).toLocaleDateString("es-ES")}</p>
                          
                          {/* Si hay Venue asociado */}
                          {prop.venueDTO && (
                            <p><strong>Ubicación:</strong> {prop.venueDTO.name} ({prop.venueDTO.cityAvailable})</p>
                          )}

                          {/* Si hay OtherService asociado */}
                          {prop.otherServiceDTO && (
                            <p><strong>Servicio:</strong> {prop.otherServiceDTO.name} ({prop.otherServiceDTO.cityAvailable})</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>Este evento no tiene propiedades adicionales.</p>
                )}
              </div>
            </div>
            <div className="button-container">
              <button className="save-btn" onClick={() => updateEvent(event)}>Editar</button>
              <button className="delete-btn" onClick={() => deleteEvent(event.id)}>Borrar</button>
            </div>
          </div>
        ))
      ) : (
        <div className="no-service">
          <p>No hay eventos disponibles.</p>
        </div>
      )}
    </>
  );
}

export default AdminEvents;
