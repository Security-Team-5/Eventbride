import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/resources/css/MyEvents.css";

function MyEvents() {
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

  // Decodificar caracteres especiales en caso de problemas de codificación
  /*
  const decodeText = (text) => {
    try {
      return decodeURIComponent(escape(text));
    } catch {
      return text;
    }
  };
  */

  return (
    <>
      {eventos.length > 0 ? (
        eventos.map((evento, index) => (
          <div key={index} className="event-container">
            <div>
              <h2 className="event-title">{tipoDeEvento(evento.eventType)}</h2>
              <div className="event-info">
                <p className="event-date">Fecha: {formatearFecha(evento.eventDate)}</p>
                <p className="event-guests">Invitados: {evento.guests}</p>
                <p className="event-budget">
                  Presupuesto: {evento.budget.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                </p>
              </div>
            </div>
            {evento.eventType === "WEDDING" && (
              <img onClick={() => { console.log("Navegando a:", `/event/${evento.id}`); navigate(`/event/${evento.id}`)}} src={'https://imgix.bustle.com/uploads/image/2023/3/24/09d2b351-99fd-49eb-a5b1-9e4ad742109f-24350248-f965-4ac2-8cd5-687c79fac92b.jpeg?w=414&h=275&fit=crop&crop=focalpoint&dpr=2&fp-x=0.356&fp-y=0.3052'} alt="Boda" className="foto" />
            )}
            {evento.eventType === "COMMUNION" && (
              <img onClick={() => navigate(`/event/${evento.id}`)} src={'https://media.istockphoto.com/id/2046030661/es/foto/comuni%C3%B3n-santo-grial-con-panes-sin-levadura-y-c%C3%A1liz-de-vino-%C3%BAltima-cena-con-corpus-christi-de.jpg?s=612x612&w=0&k=20&c=tVRw3ZhhEY8FIhZWybDC1-J3hB74tkI2LURJq-2Gjto='} alt="Comunión" className="foto" />
            )}
            {evento.eventType === "CHRISTENING" && (
              <img onClick={() => navigate(`/event/${evento.id}`)} src={'https://cdn.pixabay.com/photo/2016/04/20/23/35/religion-1342376_1280.jpg'} alt="Bautizo" className="foto" />
            )}
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

export default MyEvents;
