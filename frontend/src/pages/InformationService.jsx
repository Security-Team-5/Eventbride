import { useEffect, useState } from "react";
import "../static/resources/css/EventDetails.css";
import { useParams } from "react-router-dom";

function InformationService() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/other-services/${id}`, {
      headers: { "Content-Type": "application/json" },
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
            console.log(response.data);
          throw new Error("No se pudo obtener el servicio");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Servicio obtenido:", data);
        setService(data);
      })
      .catch((error) => {
        console.error("Error obteniendo servicio:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando información...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!service) return <p>No se encontró el servicio.</p>;

  return (
    <div className="service-details">
      <h1>{service.name}</h1>
      <img src={service.picture} alt={service.name} className="service-image" />
      <p><strong>Descripción:</strong> {service.description}</p>
      <p><strong>Disponible:</strong> {service.available ? "Sí" : "No"}</p>
      <p><strong>Ciudad Disponible:</strong> {service.cityAvailable}</p>
      <p><strong>Tipo de Servicio:</strong> {service.otherServiceType}</p>
      <p><strong>Información Extra:</strong> {service.extraInformation}</p>

      <h2>Precios</h2>
      <ul>
        <li><strong>Precio por invitado:</strong> ${service.servicePricePerGuest}</li>
        <li><strong>Precio por hora:</strong> ${service.servicePricePerHour}</li>
        <li><strong>Precio fijo:</strong> ${service.fixedPrice}</li>
      </ul>

      <h2>Propiedades del Evento</h2>
      {service.eventProperties?.length > 0 ? (
        <ul>
          {service.eventProperties.map((prop, index) => (
            <li key={index}>{prop.name}</li>
          ))}
        </ul>
      ) : (
        <p>No hay propiedades asociadas.</p>
      )}

      <h2>Valoraciones</h2>
      {service.ratings?.length > 0 ? (
        <ul>
          {service.ratings.map((rating, index) => (
            <li key={index}><strong>Puntuación:</strong> {rating.score} - {rating.comment}</li>
          ))}
        </ul>
      ) : (
        <p>No hay valoraciones aún.</p>
      )}

      <h2>Proveedor del Servicio</h2>
      {service.user ? (
        <p>{service.user.name} - {service.user.email}</p>
      ) : (
        <p>No hay información del proveedor.</p>
      )}
    </div>
  );


}

export default InformationService;
