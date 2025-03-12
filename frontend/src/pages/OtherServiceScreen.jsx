import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../static/resources/css/OtherService.css";

const OtherServiceScreen = () => {
  const [otherServices, setOtherServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOtherServiceId, setSelectedOtherServiceId] = useState(null); // Nuevo estado para almacenar el ID
  const [hours, setHours] = useState(0);
  const navigate = useNavigate();

  // Obtener el usuario logueado desde localStorage
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Obtener los servicios filtrados
  const getFilteredOtherServices = async () => {
    try {
      const params = { name, city, type };
      const response = await axios.get(`/api/other-services/filter`, { params });
      setOtherServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener todos los servicios disponibles
  const getAllOtherServices = async () => {
    try {
      const response = await axios.get("/api/other-services");
      setOtherServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Obtener eventos del usuario logueado (usando fetch)
  const getUserEvents = async () => {
    try {
      const response = await fetch(`/api/v1/events/next/${currentUser.id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      });
      const data = await response.json();
      console.log("Eventos obtenidos:", data);
      setEvents(data);
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
    }
  };

  // Controlador para la categoría de los servicios
  const handleCategoryClick = (category) => {
    if (category !== type) {
      setCategory(category);
      setType(category);
    }
  };

  // Desactivar la categoría seleccionada
  const handleCategoryClickDeactivate = () => {
    setCategory(null);
    setType(null);
  };

  // Mostrar el modal con los eventos del usuario
  const handleServiceClick = (serviceId, limitedByPricePerHour) => {
    setSelectedOtherServiceId(serviceId); // Guardamos el ID del servicio al hacer clic
    setSelectedService(serviceId);
    getUserEvents(); // Obtener los eventos para el usuario logueado
    setModalVisible(true); // Mostrar el modal con los eventos
  };

  // Confirmar la adición del servicio al evento
  const handleConfirmService = async (eventId, selectedOtherServiceId, hours = 0) => {
    try {
      if (hours > 0) {
        // Llamada al backend para añadir el servicio con horas
        await axios.post(`/api/v1/eventProperties/${eventId}/add-otherservice-hours/${selectedOtherServiceId}/${hours}`);
      } else {
        // Llamada al backend para añadir el servicio sin horas
        await axios.post(`/api/v1/eventProperties/${eventId}/add-otherservice/${selectedOtherServiceId}`);
      }
      alert("¡Operación realizada con éxito!");
      setModalVisible(false); // Cerrar el modal después de la operación
    } catch (error) {
      console.error("Error al añadir el servicio:", error);
    }
  };

  useEffect(() => {
    getAllOtherServices(); // Cargar todos los servicios al montar el componente
  }, []);

  useEffect(() => {
    if (type) {
      getFilteredOtherServices(); // Obtener los servicios filtrados cuando cambian los filtros
    } else if (type === null) {
      getAllOtherServices(); // Obtener todos los servicios si no hay filtro
    }
  }, [type, name, city]);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Convertir el tipo de evento a español
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

  return (
    <div className="other-service-container">
      <h1 className="title">Categorías de servicios</h1>
      <div className="category-buttons">
        <button onClick={() => handleCategoryClick("CATERING")}>Catering</button>
        <button onClick={() => handleCategoryClick("ENTERTAINMENT")}>Entretenimiento</button>
        <button onClick={() => handleCategoryClick("DECORATION")}>Decoración</button>
        <button onClick={handleCategoryClickDeactivate}>Todos</button>
      </div>

      <div className="filters-toggle">
        <button onClick={toggleFilters}>
          {filtersVisible ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {filtersVisible && (
        <div className="filters-container">
          <h2>Filtros disponibles</h2>
          <input
            type="text"
            placeholder="Nombre del servicio"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ciudad en la que buscas"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getFilteredOtherServices}>Aplicar filtros</button>
        </div>
      )}

      <h2 className="category-title">Servicios disponibles en la categoría: {category}</h2>
      <div className="services-grid">
        {otherServices.map((service) => (
          <div key={service.id} className="service-card">
            <h3 className="service-title">{service.name}</h3>
            <p><strong>Ciudad:</strong> {service.cityAvailable}</p>
            <p><strong>Precio:</strong> {service.limitedByPricePerGuest ? `${service.servicePricePerGuest} € por invitado` : 
              service.limitedByPricePerHour ? `${service.servicePricePerHour} € por hora` : 
              `${service.fixedPrice} €`}</p>
            <p><strong>Información extra:</strong> {service.extraInformation}</p>
            <button
              className="confirm-button"
              onClick={() => handleServiceClick(service.id, service.limitedByPricePerHour)}
            >
              Añadir a mi evento
            </button>
          </div>
        ))}
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>Selecciona un evento</h2>
            {events.length === 0 ? (
              <p>No tienes eventos disponibles.</p>
            ) : (
              events.map((event) => (
                <div key={event.id}>
                  <p><strong>Tipo de evento:</strong> {tipoDeEvento(event.eventType)}</p>
                  <p><strong>Fecha del evento:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
                  <p><strong>Invitados:</strong> {event.guests}</p>
                  {selectedService.limitedByPricePerHour && (
                    <input
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="Horas"
                    />
                  )}
                  <button onClick={() => handleConfirmService(event.id, selectedOtherServiceId, hours)}>
                    Confirmar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherServiceScreen;
