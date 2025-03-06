import React, { useState } from 'react';
import "../static/resources/css/RegistrarServicio.css";

const RegistrarServicio = () => {
    const [serviceType, setServiceType] = useState("unselected");
    const [formData, setFormData] = useState({
        name: '',
        available: false,
        cityAvailable: '',
        servicePrice: '',
        picture: '',
        description: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = () => {
        console.log('Datos del formulario:', formData);
        fetch("/api/" + serviceType, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(formData) 

          })
    };
    return (
        <div>
            <h2>Registrar Servicio</h2>
            <h3>Tipo de servicio</h3>
            <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                <option value="unselected" className="hidden-option" disabled>Selecciona un tipo de servicio</option>
                <option value="venues">Recinto para eventos</option>
                <option value="other-services">Otro</option>
            </select>
            <div>
                <form onSubmit={handleSubmit}>
                    {serviceType !== "unselected" && (
                        <div>
                            <div>
                                <label htmlFor="name">Nombre:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="500"
                                />
                            </div>
                            <div>
                                <label htmlFor="available">Disponible:</label>
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label htmlFor="cityAvailable">Ciudad Disponible:</label>
                                <input
                                    type="text"
                                    id="cityAvailable"
                                    name="cityAvailable"
                                    value={formData.cityAvailable}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="30"
                                />
                            </div>
                            <div>
                                <label htmlFor="servicePrice">Precio del Servicio:</label>
                                <input
                                    type="number"
                                    id="servicePrice"
                                    name="servicePrice"
                                    value={formData.servicePrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div>
                                <label htmlFor="picture">Imagen:</label>
                                <input
                                    type="text"
                                    id="picture"
                                    name="picture"
                                    value={formData.picture}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="250"
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Descripción:</label>
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="250"
                                />
                            </div>
                            {serviceType === "venues" && (
                                <div>
                                    <p>Campos específicos para recintos de eventos:</p>

                                    <div>
                                        <label htmlFor="postalCode">Código postal:</label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            required
                                            minLength="1"
                                            maxLength="5"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="coordinates">Coordenadas:</label>
                                        <input
                                            type="text"
                                            id="coordinates"
                                            name="coordinates"
                                            value={formData.coordinates}
                                            onChange={handleChange}
                                            required
                                            minLength="1"
                                            maxLength="30"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address">Dirección:</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            minLength="1"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="maxGuests">Máximo de invitados:</label>
                                        <input
                                            type="number"
                                            id="maxGuests"
                                            name="maxGuests"
                                            value={formData.maxGuests}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="surface">Superficie (m²):</label>
                                        <input
                                            type="number"
                                            id="surface"
                                            name="surface"
                                            value={formData.surface}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <button type="submit">Registrar recinto</button>
                                </div>
                            )}
                            {serviceType === "other-services" && (
                                <div>
                                    <p>Campos específicos para otro tipo de servicio:</p>
                                    
                                    <div>
                                        <label htmlFor="otherServiceType">Tipo de servicio:</label>
                                        <select
                                            id="otherServiceType"
                                            name="otherServiceType"
                                            value={formData.otherServiceType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="CATERING">Catering</option>
                                            <option value="ENTERTAINMENT">Entretenimiento</option>
                                            <option value="DECORATION">Decoración</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="extraInformation">Información extra:</label>
                                        <input
                                            type="text"
                                            id="extraInformation"
                                            name="extraInformation"
                                            value={formData.extraInformation}
                                            onChange={handleChange}
                                            required
                                            minLength="1"
                                            maxLength="250"
                                        />
                                    </div>

                                    <button type="submit">Registrar otro servicio</button>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegistrarServicio;