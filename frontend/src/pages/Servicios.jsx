import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../static/resources/css/RegistrarServicio.css";
import { useNavigate } from "react-router-dom";

const Servicios = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    
    // Obtener datos user desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Fetch the services of the provider
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/user/${currentUser.id}`);
                console.log('Response:', response.data);
                const otherServices = Array.isArray(response.data.otherServices) ? response.data.otherServices.map(otherService => ({ ...otherService, type: 'otherService' })) : [];
                const venues = Array.isArray(response.data.venues) ? response.data.venues.map(venue => ({ ...venue, type: 'venue' })) : [];
                setServices([ ...otherServices, ...venues ]);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, [currentUser.id]);

    console.log('Services:', services);
    return (
        <div className="mis-servicios-container">
            <h2>Mis Servicios</h2>
            <div className="services-list">
                {services?.map(service => (
                    <div key={service.id} className="service-item">
                        <h3>{service.name}</h3>
                        <p>Disponible: {service.available ? 'Sí' : 'No'}</p>
                        <p>Ciudad: {service.cityAvailable}</p>
                        {
                            service.limitedByPricePerGuest && (
                                <p>Precio por invitado: {service.servicePricePerGuest}€</p>
                            )
                        }
                        {
                            service.limitedByPricePerHour && (
                                <p>Precio por hora: {service.servicePricePerHour}€</p>
                            )
                        }
                        {
                            !service.limitedByPricePerHour && !service.limitedByPricePerGuest && (
                                <p>Precio fijo: {service.fixedPrice}€</p>
                            )
                        }
                        <p>Descripción: {service.description}</p>
                        <button onClick={() => navigate(`/misservicios/editar/${service.type}/${service.id}/`, { id: service.id , serviceType: service.type })}>Editar</button>
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
