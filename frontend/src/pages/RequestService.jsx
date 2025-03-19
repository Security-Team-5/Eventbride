import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import "../static/resources/css/RegistrarServicio.css";
import { useNavigate } from "react-router-dom";

const Servicios = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await apiClient.get(`/api/services/solicitudes/${currentUser.id}`);
                console.log('Response:', response.data);
                const otherServices = Array.isArray(response.data.otherServices)
                    ? response.data.otherServices.map(otherService => ({ ...otherService, type: 'otherService' }))
                    : [];
                const venues = Array.isArray(response.data.venues)
                    ? response.data.venues.map(venue => ({ ...venue, type: 'venue' }))
                    : [];
                setServices([...otherServices, ...venues]);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, [currentUser.id]);

    const handleAccept = async (id) => {
        try {
            await apiClient.put(`/api/event-properties/${id}`);
            setServices(services.filter(service => service.id !== id)); // Eliminar del estado local
        } catch (error) {
            console.error("Error al aceptar el servicio:", error);
        }
    };

    const handleReject = async (id) => {
        try {
            await apiClient.delete(`/api/event-properties/${id}`);
            setServices(services.filter(service => service.id !== id)); // Eliminar del estado local
        } catch (error) {
            console.error("Error al rechazar el servicio:", error);
        }
    };

    return (
        <div className="mis-servicios-container">
            <h2>Mis solicitudes</h2>
            <div className="services-list">
                {services?.map(service => (
                    <div key={service.id} className="service-item">
                        <h3>{service.name}</h3>
                        <p>Disponible: {service.available ? 'Sí' : 'No'}</p>
                        <p>Ciudad: {service.cityAvailable}</p>
                        {service.limitedByPricePerGuest && <p>Precio por invitado: {service.servicePricePerGuest}€</p>}
                        {service.limitedByPricePerHour && <p>Precio por hora: {service.servicePricePerHour}€</p>}
                        {!service.limitedByPricePerHour && !service.limitedByPricePerGuest && <p>Precio fijo: {service.fixedPrice}€</p>}
                        <p>Descripción: {service.description}</p>
                        
                        <div className="service-buttons">
                            <button 
                                className="accept-button" 
                                onClick={() => handleAccept(service.id)}
                            >
                                ✅ Confirmar
                            </button>
                            <button 
                                className="reject-button" 
                                onClick={() => handleReject(service.id)}
                            >
                                ❌ Rechazar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="create-service-button" onClick={() => window.location.href = '/misservicios/registrar'}>
                + Crear nuevo servicio
            </button>
        </div>
    );
};

export default Servicios;
