import { useEffect, useState } from "react";
import "../static/resources/css/Invitations.css";
import { useParams } from "react-router-dom";

function EventInvitations() {

    const [invitaciones, setInvitaciones] = useState([]);

    const { currentEventId } = useParams();

    // Obtener la lista de invitaciones
    function getInvitations() {
        fetch(`/api/invitation/eventInvitations/${currentEventId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        })
            .then(response => response.json())
            .then(data => {
                console.log("evento:", currentEventId)
                console.log("Invitaciones de este evento:", data);
                setInvitaciones(data);
            })
            .catch(error => console.error("Error obteniendo las invitaciones de este evento:", error));
    }

    //Cargar invitaciones al montar el componente
    useEffect(() => {
        getInvitations();
      }, []);

      return (
        <>
          {invitaciones.length > 0 ? (
            invitaciones.map((invitacion, index) => (
              <div key={index} className="event-container-i">
                <div>
                  <div className="event-info-i">
                    <p className="invitation-name">Nombre del invitado: {invitacion.firstName + " " + invitacion.lastName}</p>
                    <p className="invitation-name">Invitados de su parte: {invitacion.numberOfGuests}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-invitation">
              <p>No hay invitaciones disponibles para este evento.</p>
            </div>
          )}
        </>
      )

}

export default EventInvitations