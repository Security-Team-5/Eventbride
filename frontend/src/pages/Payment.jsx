import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../static/resources/css/EventDetails.css";
import PaypalButtom from "../components/PaypalButtom";

function Payment() {
  const [eventProp, setEventProp] = useState(null);
  const { id } = useParams();
  const jwt = localStorage.getItem("jwt");

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

                <p>📍 Dirección: {eventProp.venueDTO.address}, {eventProp.venueDTO.cityAvailable} ({eventProp.venueDTO.postalCode})</p>
                <p>🌍 Coordenadas: {eventProp.venueDTO.coordinates}</p>

                <p>📏 Superficie: {eventProp.venueDTO.surface} m²</p>
                <p>👥 Capacidad máxima: {eventProp.venueDTO.maxGuests} invitados</p>

                <div className="pricing-info">
                  <h3 className="font-semibold mt-4">Tarifas</h3>
                  <p>💰 Precio fijo: {eventProp.venueDTO.fixedPrice}€</p>
                  <p>👤 Precio por invitado: {eventProp.venueDTO.servicePricePerGuest}€</p>
                  <p>⏳ Precio por hora: {eventProp.venueDTO.servicePricePerHour}€</p>
                </div>

                <div className="schedule-info">
                  <h3 className="font-semibold mt-4">Horario Disponible</h3>
                  <p>🕒 Apertura: {eventProp.venueDTO.earliestTime}</p>
                  <p>🌙 Cierre: {eventProp.venueDTO.latestTime}</p>
                </div>

                <div className="status-info mt-4" style={{ textAlign: "center" }}>
                  <span className={`px-3 py-1 rounded-full text-white text-sm ${eventProp.venueDTO.available ? 'bg-green-500' : 'bg-red-500'}`}>
                    {eventProp.venueDTO.available ? "✅ Disponible" : "❌ No Disponible"}
                  </span>
                </div>

                <div className="venue-image mt-4" style={{ textAlign: "center" }}>
                  <img src={eventProp.venueDTO.picture} alt={eventProp.venueDTO.name} className="w-full max-w-lg rounded-xl shadow-lg" />
                </div>
              </div>
            ) : eventProp.otherServiceDTO ? (
              <div className="other-service-info">
                <h2 className="text-xl font-semibold">{eventProp.otherServiceDTO.name}</h2>
                <p>📅 Fecha solicitada: {eventProp.requestDate ? eventProp.requestDate : "Nada"}</p>

                <p className="text-gray-600">{eventProp.otherServiceDTO.description}</p>

                <p><strong>🛠 Servicio:</strong> {eventProp.otherServiceDTO.extraInformation}</p>

                <p><strong>📍 Disponible en:</strong> {eventProp.otherServiceDTO.cityAvailable}</p>

                <p><strong>📌 Tipo de servicio:</strong> {eventProp.otherServiceDTO.otherServiceType}</p>

                <div className="pricing-info bg-gray-50 p-4 rounded-xl shadow-md mt-4">
                  <h3 className="text-lg font-semibold">Tarifas</h3>
                  <p><strong>💰 Precio fijo:</strong> {eventProp.otherServiceDTO.fixedPrice}€</p>
                  <p><strong>👤 Precio por invitado:</strong> {eventProp.otherServiceDTO.servicePricePerGuest}€</p>
                  <p><strong>⏳ Precio por hora:</strong> {eventProp.otherServiceDTO.servicePricePerHour}€</p>
                </div>

                <div className="limits-info bg-gray-50 p-4 rounded-xl shadow-md mt-4">
                  <h3 className="text-lg font-semibold">Restricciones</h3>
                  <p>🔹 Limitado por invitado: {eventProp.otherServiceDTO.limitedByPricePerGuest ? "✅ Sí" : "❌ No"}</p>
                  <p>🔹 Limitado por hora: {eventProp.otherServiceDTO.limitedByPricePerHour ? "✅ Sí" : "❌ No"}</p>
                </div>

                <div className="service-image mt-4" style={{ textAlign: "center" }}>
                  <img 
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
              <PaypalButtom/>
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
