import { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css";
import "../static/resources/css/OtherService.css";

const OtherServiceScreen = () => {
  const [otherServices, setOtherServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [serviceDetailsVisible, setServiceDetailsVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOtherServiceId, setSelectedOtherServiceId] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [venueTimes, setVenueTimes] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const getFilteredOtherServices = async () => {
    try {
      const params = { name, city, type };
      const response = await axios.get(`/api/other-services/filter`, { params });
      setOtherServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getAllOtherServices = async () => {
    try {
      const response = await axios.get("/api/other-services");
      setOtherServices(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getUserEvents = async () => {
    try {
      const response = await fetch(`/api/v1/events/next/${currentUser.id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const data = await response.json();
      setEvents((prevEvents) => [...prevEvents, ...data]);
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
    }
  };

  const getServiceDetails = async (serviceId) => {
    try {
      const response = await axios.get(`/api/other-services/${serviceId}`);
      setServiceDetails(response.data);
      setServiceDetailsVisible(true);
    } catch (error) {
      console.error("Error obteniendo detalles del servicio:", error);
    }
  };

  const handleCategoryClick = (category) => {
    if (category !== type) {
      setCategory(category);
      setType(category);
    }
  };

  const handleCategoryClickDeactivate = () => {
    setCategory(null);
    setType(null);
  };

  const handleServiceClick = (serviceId) => {
    getServiceDetails(serviceId);
  };

  const handleAddServiceClick = (e, serviceId) => {
    e.stopPropagation();
    setSelectedOtherServiceId(serviceId);
    setSelectedService(serviceId);
    getUserEvents();
    setModalVisible(true);
  };

  const handleTimeChange = (eventObj, field, value) => {
    setVenueTimes(prevTimes => ({
      ...prevTimes,
      [eventObj]: {
        ...prevTimes[eventObj],
        [field]: value
      }
    }));
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

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

  const combineDateAndTime = (eventDate, time) => {
    const dateObj = new Date(eventDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    // time es un string tipo "HH:mm", se le añade ":00" para segundos
    return `${year}-${month}-${day} ${time}:00`;
  };


  const handleConfirmService = async (eventObj, selectedOtherServiceId) => {
    const times = venueTimes[eventObj.id] || {};
    if (!times.startTime || !times.endTime) {
      alert("Por favor, ingresa la hora de inicio y la hora de fin para este servicio.");
      return;
    }
    // Combinar la fecha del evento con la hora que indicó el usuario
    const startDate = combineDateAndTime(eventObj.eventDate, times.startTime);
    const endDate = combineDateAndTime(eventObj.eventDate, times.endTime);
    try {
      await axios.put(`/api/event-properties/${eventObj.id}/add-otherservice/${selectedOtherServiceId}`,
        null,
        { params: { startDate, endDate } }
      );
      alert("¡Operación realizada con éxito!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error al añadir el servicio:", error);
    }
  };

  useEffect(() => {
    getAllOtherServices();
  }, []);

  useEffect(() => {
    if (type) {
      getFilteredOtherServices();
    } else {
      getAllOtherServices();
    }
  }, [type, name, city]);


  return (
    <div className="other-service-container">
      <h1 className="title">Categorías de servicios</h1>
      <div className="category-buttons">
        <button onClick={handleCategoryClickDeactivate}>Todos</button>
        <button onClick={() => handleCategoryClick("CATERING")}>Catering</button>
        <button onClick={() => handleCategoryClick("ENTERTAINMENT")}>Entretenimiento</button>
        <button onClick={() => handleCategoryClick("DECORATION")}>Decoración</button>

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
          <div key={service.id} className="service-card" onClick={() => handleServiceClick(service.id)}>
            <h3 className="service-title">{service.name}</h3>
            <p><strong>Precio:</strong> {service.limitedByPricePerGuest ? `${service.servicePricePerGuest} € por invitado` :
              service.limitedByPricePerHour ? `${service.servicePricePerHour} € por hora` :
                `${service.fixedPrice} €`}</p>
            <button
              className="confirm-button"
              onClick={(e) => handleAddServiceClick(e, service.id)}
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
              events.map((eventObj) => (
                <div key={eventObj.id}>
                  <p><strong>Tipo de evento:</strong> {tipoDeEvento(eventObj.eventType)}</p>
                  <p><strong>Fecha del evento:</strong> {new Date(eventObj.eventDate).toLocaleDateString()}</p>
                  <p><strong>Invitados:</strong> {eventObj.guests}</p>
                  {/* Hora de inicio del service */}
                  <div>
                    <label>Hora de inicio del venue: </label>
                    <input
                      type="time"
                      value={venueTimes[eventObj.id]?.startTime || ""}
                      onChange={(e) => handleTimeChange(eventObj.id, 'startTime', e.target.value)}
                    />
                  </div>

                  {/* Hora de fin del service */}
                  <div>
                    <label>Hora de fin del venue: </label>
                    <input
                      type="time"
                      value={venueTimes[eventObj.id]?.endTime || ""}
                      onChange={(e) => handleTimeChange(eventObj.id, 'endTime', e.target.value)}
                    />
                  </div>
                  <button onClick={() => handleConfirmService(eventObj, selectedOtherServiceId)}>
                    Confirmar
                  </button>
                  <button className="close-button" onClick={() => setModalVisible(false)}>Cerrar</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {serviceDetailsVisible && serviceDetails && (
        <div className="modal">
          <div className="modal-content">
            <h2>{serviceDetails.name}</h2>
            <p><strong>Descripción:</strong> {serviceDetails.description}</p>
            <button className="close-button" onClick={() => setServiceDetailsVisible(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherServiceScreen;