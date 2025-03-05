import React from 'react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/misservicios/registrar');
    };

    return (
        <div>
            <h1>Servicios</h1>
            <button onClick={handleRegisterClick}>Crear nuevo servicio</button>
        </div>
    );
};

export default Services;