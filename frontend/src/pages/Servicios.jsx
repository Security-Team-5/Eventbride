import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../static/resources/css/RegistrarServicio.css";

const Servicios = () => {
    const [services, setServices] = useState([]);

    // Obtener datos user desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        // Fetch the services of the provider
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/services/${currentUser.id}`);
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    return (
        <div className="mis-servicios-container">
            <h2>Mis Servicios</h2>
            <div className="services-list">
                {services.venues?.map(venue => (
                    <div key={venue.id} className="service-item">
                        <h3>{venue.name}</h3>
                        <p>Disponible: {venue.available ? 'Sí' : 'No'}</p>
                        <p>Ciudad: {venue.cityAvailable}</p>
                        <p>Precio: {venue.servicePricePerGuest}</p>
                        <p>Descripción: {venue.description}</p>
                    </div>
                ))}
                {services.otherServices?.map(otherService => (
                    <div key={otherService.id} className="service-item">
                        <h3>{otherService.name}</h3>
                        <p>Disponible: {otherService.available ? 'Sí' : 'No'}</p>
                        <p>Ciudad: {otherService.cityAvailable}</p>
                        <p>Precio: {otherService.servicePricePerGuest}</p>
                        <p>Descripción: {otherService.description}</p>
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
