import { useEffect, useState } from "react";
import "../static/resources/css/Invitations.css";
import { useNavigate } from "react-router-dom";


function Invitations() {

  const [eventos, setEventos] = useState([]);
  const navigate = useNavigate(); // Hook para redirigir


  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Obtener la lista de eventos
  function getEvents() {
    fetch(`/api/v1/events/next/${currentUser.id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Eventos obtenidos:", data);
        setEventos(data); // Guardamos la lista de eventos en el estado
      })
      .catch(error => console.error("Error obteniendo eventos:", error));
  }

  // Cargar eventos al montar el componente
  useEffect(() => {
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

    return (
        <>
          {eventos.length > 0 ? (
            eventos.map((evento, index) => (
              <div key={index} className="event-container-i">
                <div>
                  <h2 className="event-title-i">{tipoDeEvento(evento.eventType)}</h2>
                  <div className="event-info-i">
                    <p className="event-date-i">Fecha: {formatearFecha(evento.eventDate)}</p>
                    <p className="event-guests-i">Invitados: {evento.guests}</p>
                  </div>
                  <button 
                    className="boton-editar"
                    onClick={() => navigate(`/invitaciones/${evento.id}`)}
                    >
                        Editar Invitados
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-event">
              <p>No hay eventos disponibles en este momento.</p>
            </div>
          )}
        </>
      );

}

export default Invitations