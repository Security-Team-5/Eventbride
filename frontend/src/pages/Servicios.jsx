import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../static/resources/css/RegistrarServicio.css";

const Servicios = () => {
    const [services, setServices] = useState([]);

    useEffect(() => {
        // Fetch the services of the provider
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/other-services/provider');
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
                {services.map(service => (
                    <div key={service.id} className="service-item">
                        <h3>{service.name}</h3>
                        <p>Disponible: {service.available ? 'Sí' : 'No'}</p>
                        <p>Ciudad: {service.cityAvailable}</p>
                        <p>Precio: {service.servicePrice}</p>
                        <p>Descripción: {service.description}</p>
                        {/* Add more attributes as needed */}
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