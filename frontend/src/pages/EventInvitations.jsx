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

    const copyLink = (link) => {
        navigator.clipboard.writeText(link)
            .then(() => {
                alert("Link copiado: " + link);
            })
            .catch(err => {
                console.error("Error al copiar: ", err);
            });
    }

    const createInvitation = () => {
        fetch(`/api/invitation/create/${currentEventId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        })
            .then(response => response.json())
            .then(data => {
                if(!data.error){
                    copyLink("https://ispp-2425-03.ew.r.appspot.com/")
                    alert("Link a la invitación copiada al portapeles")
                }
            })
            .catch(error => console.error("Error obteniendo las invitaciones de este evento:", error));
    }

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
            <button onClick={createInvitation}>Crear invitación</button>
        </>
      )

}

export default EventInvitations
