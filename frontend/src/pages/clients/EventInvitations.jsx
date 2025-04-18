import { useEffect, useState } from "react";
import "../../static/resources/css/Invitations.css";
import { useParams } from "react-router-dom";
import { Copy, Trash2 } from "lucide-react";
import { useAlert } from "../../context/AlertContext.jsx";

function EventInvitations() {
  const [invitaciones, setInvitaciones] = useState([]);
  const { currentEventId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [maxGuests, setMaxGuests] = useState("");
  const [eventData, setEventData] = useState(null); // Para guardar info del evento
  const [jwtToken] = useState(localStorage.getItem("jwt"));

  const { showAlert } = useAlert();

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
        setEventData(data);
      })
      .catch((error) =>
        console.error("Error obteniendo los datos del evento:", error)
      );
  }

  // Cargar invitaciones al montar el componente
  useEffect(() => {
    getEventData();
    console.log(window.location.origin)
    getInvitations();
  }, []);

  const copyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        showAlert("Link copiado: " + link);
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
      showAlert("Por favor, ingresa un número válido mayor a 0.");
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
          copyLink(`${window.location.origin}/invitaciones/registro/${id}`);
          showAlert("Link a la invitación copiado al portapapeles");
          setInvitaciones(prev => [...prev, data])
        }
      })
      .catch((error) =>
        console.error("Error al crear la invitación:", error)
      );

    setModalOpen(false);
    setMaxGuests("");
  };

  const handleRemove = (id) => {
    const isRemoving = confirm("¿Deseas eliminar la invitación?")
    if (!isRemoving) { return }

    fetch(`/api/invitation/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          const newInvitations = invitaciones.filter(i => i.id !== id)
          setInvitaciones(newInvitations)
        } else {
          showAlert(data.error)
        }
      })
      .catch((error) =>
        console.error("Error al crear la invitación:", error)
      );
  }

  // Calcular el total de invitados (1 por el invitado principal + sus invitados)
  const totalInvitados = invitaciones.reduce(
    (total, invitacion) => total + Number(invitacion.numberOfGuests),
    0
  );

  return (
    <div className="event-invitations-container">
      <h2>Invitaciones estimadas {eventData && (<>del evento: {eventData.name}</>)}</h2>
      <div className="total-invitations">
        {eventData && (
          <div>
            <p style={{ fontSize: "130%", marginBottom: '-10vh' }}>Invitados estimados: {eventData.guests}</p>
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

      {/* Mostrar todas las invitados */}
      {invitaciones.length > 0 ? (
        <>
          {invitaciones.map((invitacion, index) => (
            <div key={index} className="event-container-i">
              <div>
                {
                  invitacion.invitationType === "ACCEPTED" ? (
                    <div className="event-info-i">
                      <div className="left-event">
                        <p className="invitation-name">
                          Nombre del invitado: {invitacion.firstName + " " + invitacion.lastName}
                        </p>
                        <p className="invitation-name">
                          Invitados de su parte: {invitacion.numberOfGuests}
                        </p>
                      </div>
                      <div className="right-event">
                        <button
                          onClick={() => { handleRemove(invitacion.id) }}
                          title="Copiar enlace"
                          className="trash"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="event-info-i">
                      <div className="left-event">
                        <p className="invitation-name">
                          Invitación creada
                        </p>
                        <p className="invitation-name">
                          Invitados máximos: {invitacion.maxGuests}
                        </p>
                      </div>
                      <div className="right-event">
                        <button
                          onClick={() => { copyLink(`${window.location.origin}/invitaciones/registro/${invitacion.id}`) }}
                          title="Copiar enlace"
                        >
                          <Copy size={20} />
                        </button>
                        <button
                          onClick={() => { handleRemove(invitacion.id) }}
                          title="Copiar enlace"
                          className="trash"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
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
