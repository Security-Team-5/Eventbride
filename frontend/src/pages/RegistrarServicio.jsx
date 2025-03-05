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

    const handleSubmit = (e) => {
        console.log('Datos del formulario:', formData);
    };

    return (
        <div>
            <h2>Registrar Servicio</h2>
            <h3>Tipo de servicio</h3>
            <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                <option value="unselected" className="hidden-option" disabled>Selecciona un tipo de servicio</option>
                <option value="venue">Recinto para eventos</option>
                <option value="other">Otro</option>
            </select>
            <p>Seleccionaste: {serviceType}</p>
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
                            {serviceType === "venue" && (
                                <div>
                                    <p>Campos específicos para recintos de eventos</p>
                                    <button type="submit">Registrar recinto</button>
                                </div>
                            )}
                            {serviceType === "other" && (
                                <div>
                                    <p>Campos específicos para otro tipo de servicio</p>
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