import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import axios from 'axios';
import "../App.css"; 
import { useNavigate } from "react-router-dom";
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
  const [hours, setHours] = useState(0);
  const navigate = useNavigate();

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

  const handleConfirmService = async (eventId, selectedOtherServiceId, hours = 0) => {
    try {
      if (hours > 0) {
        await axios.post(`/api/v1/eventProperties/${eventId}/add-otherservice-hours/${selectedOtherServiceId}/${hours}`);
      } else {
        await axios.post(`/api/v1/eventProperties/${eventId}/add-otherservice/${selectedOtherServiceId}`);
      }
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