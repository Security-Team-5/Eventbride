import { useEffect, useState } from "react";
import "../static/resources/css/Invitations.css";
import { useParams } from "react-router-dom";

function EventInvitations() {
  const [invitaciones, setInvitaciones] = useState([]);
  const { currentEventId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [maxGuests, setMaxGuests] = useState("");

  // Obtener la lista de invitaciones
  function getInvitations() {
    fetch(`/api/invitation/eventInvitations/${currentEventId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("evento:", currentEventId);
        console.log("Invitaciones de este evento:", data);
        setInvitaciones(data);
      })
      .catch((error) =>
        console.error("Error obteniendo las invitaciones de este evento:", error)
      );
  }

  // Cargar invitaciones al montar el componente
  useEffect(() => {
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
    // Llamada a la API con el body que contiene el número máximo de invitados
    fetch(`/api/invitation/create/${currentEventId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(max),
      // Si el API espera un objeto, podrías usar: body: JSON.stringify({ maxGuests: max })
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
            const id = data.id
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

  return (
    <>
      {invitaciones.length > 0 ? (
        invitaciones.map((invitacion, index) => (
          <div key={index} className="event-container-i">
            <div>
              <div className="event-info-i">
                <p className="invitation-name">
                  Nombre del invitado:{" "}
                  {invitacion.firstName + " " + invitacion.lastName}
                </p>
                <p className="invitation-name">
                  Invitados de su parte: {invitacion.numberOfGuests}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="no-invitation">
          <p>No hay invitaciones disponibles para este evento.</p>
        </div>
      )}
      <button onClick={handleCreateInvitation}>Crear invitación</button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Ingresa el número máximo de invitados por invitación
            </h3>
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
    </>
  );
}

export default EventInvitations;
