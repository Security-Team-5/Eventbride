import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/resources/css/MyEvents.css";

function MyEvents() {
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const [jwtToken] = useState(localStorage.getItem("jwt"));

  // Obtener la lista de eventos
  function getEvents() {
    setIsLoading(true);
    setError(null);

    if (!currentUser || !currentUser.id) {
      setError("No se ha encontrado información del usuario");
      setIsLoading(false);
      return;
    }

    fetch(`/api/v1/events/next/${currentUser.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los eventos");
        }
        return response.json();
      })
      .then(data => {
        console.log("Eventos obtenidos:", data);
        setEventos(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error obteniendo eventos:", error);
        setError("No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.");
        setIsLoading(false);
      });
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

  // Obtener imagen según tipo de evento
  const getEventImage = (eventType) => {
    switch (eventType) {
      case "WEDDING":
        return 'https://imgix.bustle.com/uploads/image/2023/3/24/09d2b351-99fd-49eb-a5b1-9e4ad742109f-24350248-f965-4ac2-8cd5-687c79fac92b.jpeg?w=414&h=275&fit=crop&crop=focalpoint&dpr=2&fp-x=0.356&fp-y=0.3052';
      case "COMMUNION":
        return 'https://media.istockphoto.com/id/2046030661/es/foto/comuni%C3%B3n-santo-grial-con-panes-sin-levadura-y-c%C3%A1liz-de-vino-%C3%BAltima-cena-con-corpus-christi-de.jpg?s=612x612&w=0&k=20&c=tVRw3ZhhEY8FIhZWybDC1-J3hB74tkI2LURJq-2Gjto=';
      case "CHRISTENING":
        return 'https://cdn.pixabay.com/photo/2016/04/20/23/35/religion-1342376_1280.jpg';
      default:
        return 'https://via.placeholder.com/400x250';
    }
  };

  // Calcular días restantes hasta el evento
  const calcularDiasRestantes = (fecha) => {
    const hoy = new Date();
    const fechaEvento = new Date(fecha);
    const diferencia = fechaEvento.getTime() - hoy.getTime();
    const dias = Math.ceil(diferencia / (1000 * 3600 * 24));
    return dias;
  };

  // Renderizar estado de carga
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando eventos...</p>
      </div>
    );
  }

  // Renderizar mensaje de error
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <button className="retry-button" onClick={getEvents}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="page-title">Mis Eventos</h1>
        <button className="new-event-button" onClick={() => navigate("/create-events")}>
          Nuevo Evento
        </button>
      </div>

      {eventos.length > 0 ? (

        <div className="events-grid">
          {eventos.map((evento, index) => {
            const diasRestantes = calcularDiasRestantes(evento.eventDate);

            const calcularCosteEvento = () => {
              if (!evento || !evento.eventPropertiesDTO) return 0;

              let total = 0;
              for (let i = 0; i < evento.eventPropertiesDTO.length; i++) {
                const prop = evento.eventPropertiesDTO[i];
                total += (prop.setPricePerService || 0);
              }
              return total;
            };

            return (
              <div
                key={index}
                className="event-card"
                onClick={() => navigate(`/event/${evento.id}`)}
              >
                <div className="event-image-container">
                  <img
                    src={getEventImage(evento.eventType) || "/placeholder.svg"}
                    alt={tipoDeEvento(evento.eventType)}
                    className="event-image"
                  />
                  <div className="event-type-badge">
                    {tipoDeEvento(evento.eventType)}
                  </div>
                  {diasRestantes > 0 && (
                    <div className="days-remaining">
                      <span className="days-number">{diasRestantes}</span>
                      <span className="days-text">días</span>
                    </div>
                  )}
                </div>

                <div className="event-content">
                  <h2 className="event-title">{tipoDeEvento(evento.eventType)} de {currentUser.username}</h2>

                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span className="detail-text">{formatearFecha(evento.eventDate)}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span className="detail-text">{evento.guests} invitados</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">💰</span>
                      <span className="detail-text">
                        Coste acumulado: {calcularCosteEvento().toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                      </span>
                    </div>
                  </div>

                  <div className="event-footer">
                    <span className="view-details">Ver detalles</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      ) : (
        <div className="no-events-container">
          <div className="no-events-icon">📅</div>
          <h2>No hay eventos disponibles</h2>
          <p>No tienes eventos programados en este momento.</p>
          <button className="create-event-button" onClick={() => navigate("/new-event")}>
            Crear mi primer evento
          </button>
        </div>
      )}
    </div>
  );
}

export default MyEvents;
