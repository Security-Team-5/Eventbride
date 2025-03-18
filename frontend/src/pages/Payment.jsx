import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../static/resources/css/EventDetails.css";
import PaypalButtom from "../components/PaypalButtom";

function Payment() {
  const [eventProp, setEventProp] = useState(null);
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [amount, setAmount] = useState(null);

  function getEventProp() {
    fetch(`/api/event-properties/DTO/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Event propertie obtenido:", data);
        setEventProp(data);
        setAmount(data.depositAmount);
      })
      .catch(error => console.error("Error obteniendo evento:", error));
  }

  useEffect(() => {
    console.log("Event prop", eventProp);
    getEventProp();
  }, []);

  return (
    <div className="event-contain" style={{ maxWidth: "35%" }}>
      <div className="event-details">
        <h1 className="event-title">Pago del servicio</h1>

        {eventProp ? (
          <>
            {eventProp.venueDTO ? (
              <div className="venue-info">
                <h2 className="text-xl font-semibold">{eventProp.venueDTO.name}</h2>
                <p>📅 Fecha solicitada: {eventProp.requestDate ? eventProp.requestDate : "Nada"}</p>

                <p>📏 Superficie: {eventProp.venueDTO.surface} m²</p>
                <p>👥 Capacidad máxima: {eventProp.venueDTO.maxGuests} invitados</p>

                <div className="pricing-info">
                  <h3 className="font-semibold mt-4">Tarifa</h3>
                  {(eventProp.venueDTO.limitedByPricePerGuest == false  && eventProp.venueDTO.limitedByPricePerHour == false)  && (
                    <p>💰 Precio fijo: {eventProp.venueDTO.fixedPrice}€</p>
                  )}
                  {(eventProp.venueDTO.limitedByPricePerGuest == true && eventProp.venueDTO.limitedByPricePerHour == false) && (
                    <p>👤 Precio por invitado: {eventProp.venueDTO.servicePricePerGuest}€</p>
                  )}
                  {(eventProp.venueDTO.limitedByPricePerGuest == false && eventProp.venueDTO.limitedByPricePerHour == true) && (
                    <p>⏳ Precio por hora: {eventProp.venueDTO.servicePricePerHour}€</p>
                  )}
                </div>
                <div className="schedule-info">
                  <h3 className="font-semibold mt-4">Horario de la reserva</h3>
                  <p>🕒 Apertura: {eventProp.startTime}</p>
                  <p>🌙 Cierre: {eventProp.finishTime}</p>
                </div>

                <div className="venue-image mt-4" style={{ textAlign: "center" }}>
                  <img 
                    style={{ maxWidth: "100%" }}
                    src={eventProp.venueDTO.picture} 
                    alt={eventProp.venueDTO.name} 
                    className="w-full max-w-lg rounded-xl shadow-lg" 
                  />
                </div>
              </div>
            ) : eventProp.otherServiceDTO ? (
              <div className="other-service-info">
                <h2 className="text-xl font-semibold">{eventProp.otherServiceDTO.name}</h2>
                <p>📅 Fecha solicitada: {eventProp.requestDate ? eventProp.requestDate : "Nada"}</p>

                <p className="text-gray-600">{eventProp.otherServiceDTO.description}</p>

                <p><strong>🛠 Servicio:</strong> {eventProp.otherServiceDTO.extraInformation}</p>

                <p><strong>📌 Tipo de servicio:</strong> {eventProp.otherServiceDTO.otherServiceType}</p>

                <div className="pricing-info">
                  <h3 className="font-semibold mt-4">Tarifa</h3>
                  {(eventProp.otherServiceDTO.limitedByPricePerGuest == false  && eventProp.otherServiceDTO.limitedByPricePerHour == false)  && (
                    <p>💰 Precio fijo: {eventProp.otherServiceDTO.fixedPrice}€</p>
                  )}
                  {(eventProp.otherServiceDTO.limitedByPricePerGuest == true && eventProp.otherServiceDTO.limitedByPricePerHour == false) && (
                    <p>👤 Precio por invitado: {eventProp.otherServiceDTO.servicePricePerGuest}€</p>
                  )}
                  {(eventProp.otherServiceDTO.limitedByPricePerGuest == false && eventProp.otherServiceDTO.limitedByPricePerHour == true) && (
                    <p>⏳ Precio por hora: {eventProp.otherServiceDTO.servicePricePerHour}€</p>
                  )}
                </div>

                <div className="service-image mt-4" style={{ textAlign: "center" }}>
                  <img 
                    style={{ maxWidth: "100%" }}
                    src={eventProp.otherServiceDTO.picture} 
                    alt={eventProp.otherServiceDTO.name} 
                    className="w-full max-w-lg rounded-xl shadow-lg" 
                  />
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">⚠ No hay información disponible.</p>
            )}

            <div style={{ textAlign: "center" }}>
              <PaypalButtom amount={amount} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">⏳ Cargando información...</p>
        )}
      </div>
    </div>
  );
}

export default Payment;
