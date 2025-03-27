import { useEffect, useState } from "react";
import "../static/resources/css/Invitations.css";
import { useParams } from "react-router-dom";

function EventInvitations() {
  const [invitaciones, setInvitaciones] = useState([]);
  const { currentEventId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [maxGuests, setMaxGuests] = useState("");
  const [eventData, setEventData] = useState(null); // Para guardar info del evento
  const [jwtToken] = useState(localStorage.getItem("jwt"));


  // Obtener la lista de invitaciones
  function getInvitations() {
    fetch(`/api/invitation/eventInvitations/${currentEventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Invitaciones recibidas:", data);
        setInvitaciones(data);
      })
      .catch((error) =>
        console.error("Error obteniendo las invitaciones de este evento:", error)
      );
  }

  function getEventData() {
    fetch(`/api/v1/events/${currentEventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos del evento:", data);
        setEventData(data);
      })
      .catch((error) =>
        console.error("Error obteniendo los datos del evento:", error)
      );
  }

  // Cargar invitaciones al montar el componente
  useEffect(() => {
    getEventData();
    getInvitations();
  }, []);

  const copyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Link copiado: " + link);
      })
      .catch((err) => {
        console.error("Error al copiar: ", err);
      });
  };

  // Al hacer click se abre el modal
  const handleCreateInvitation = () => {
    setModalOpen(true);
  };

  // Enviar la invitación con el valor ingresado en el modal
  const handleModalSubmit = () => {
    const max = parseInt(maxGuests, 10);
    if (isNaN(max) || max <= 0) {
      alert("Por favor, ingresa un número válido mayor a 0.");
      return;
    }

    fetch(`/api/invitation/create/${currentEventId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "POST",
      body: JSON.stringify(max),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          const id = data.id;
          copyLink(`https://ispp-2425-03.ew.r.appspot.com/invitaciones/registro/${id}`);
          alert("Link a la invitación copiado al portapapeles");
        }
      })
      .catch((error) =>
        console.error("Error al crear la invitación:", error)
      );

    setModalOpen(false);
    setMaxGuests("");
  };

  // Calcular el total de invitados (1 por el invitado principal + sus invitados)
  const totalInvitados = invitaciones.reduce(
    (total, invitacion) => total + Number(invitacion.numberOfGuests),
    0
  );

  // Para comprobarlo en consola
  console.log("Total de invitados calculado:", totalInvitados);

  return (
    <div className="event-invitations-container">
      <div className="total-invitations">
        {eventData && (
          <div>
            <p style={{ fontSize: "130%" }}>Invitados estimados: {eventData.guests}</p>
          </div>
        )}
        <h2>Total de invitados: {totalInvitados}</h2>
      </div>
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ingresa el número máximo de invitados por invitación</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
              placeholder="Número máximo de invitados"
            />
            <button onClick={handleModalSubmit}>Enviar</button>
            <button onClick={() => setModalOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {/* Mostrar el total de invitados */}
      {invitaciones.length > 0 ? (
        <>
          {invitaciones.map((invitacion, index) => (
            <div key={index} className="event-container-i">
              <div>
                <div className="event-info-i">
                  <p className="invitation-name">
                    Nombre del invitado: {invitacion.firstName + " " + invitacion.lastName}
                  </p>
                  <p className="invitation-name">
                    Invitados de su parte: {invitacion.numberOfGuests}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="no-invitation">
          <p>No hay invitaciones disponibles para este evento.</p>
        </div>
      )}

      <button className="boton-crear-invitacion" onClick={handleCreateInvitation}>
        Crear invitación
      </button>

    </div>
  );
}

export default EventInvitations;
