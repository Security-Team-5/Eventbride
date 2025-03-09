import { useState } from 'react';
import "../static/resources/css/RegistrarServicio.css";
import {useNavigate} from "react-router-dom";

const RegistrarServicio = () => {

    // Obtener datos user desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [serviceType, setServiceType] = useState("unselected");
    const [limitedBy, setLimitedBy] = useState("perGuest");
    const [errors, setErrors] = useState({
        name: '',
        cityAvailable: '',
        servicePricePerGuest: '',
        servicePricePerHour: '',
        fixedPrice: '',
        picture: '',
        description: '',
        hours: '',
        otherServiceType: 'CATERING',
    })

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: '',
        available: false,
        cityAvailable: '',
        servicePricePerGuest: 0,
        servicePricePerHour: 0,
        fixedPrice: '',
        picture: '',
        description: '',
        hours: '',
        limitedByPricePerGuest: false,
        limitedByPricePerHour: false,
        otherServiceType: 'CATERING',
        user: {
                id: currentUser.id
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        formData.limitedByPricePerGuest = limitedBy === "perGuest";
        formData.limitedByPricePerHour = limitedBy === "perHour";

        console.log('Datos del formulario:', formData);
        fetch("/api/" + serviceType, {
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(formData) 
        })
            .then(response => response.json())
            .then(data => {
                if(!data.error){
                    navigate("/misservicios")
                } else{
                    const errorName = data.error
                    setErrors(data);
                }

            })
            .catch(error => console.error("Error obteniendo evento:", error));
    };

    return (
        <div className="registrar-servicio-container">
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
                        <div className="form-section">
                            <div className="form-group">
                                <label htmlFor="name">Nombre:</label>
                                <p className="error-title">{errors.name}</p>
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
                            <div className="form-group">
                                <label htmlFor="available">Disponible:</label>
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cityAvailable">Ciudad Disponible:</label>
                                <p className="error-title">{errors.cityAvailable}</p>
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
                            <div className="form-group">
                                <label htmlFor="limitedByPricePerGuest">¿Cobro por invitado o por hora?</label>
                                <select id="limitedBy" value={limitedBy} onChange={(e) => setLimitedBy(e.target.value)}>
                                    <option value="perGuest">Por invitado</option>
                                    <option value="perHour">Por hora</option>
                                    <option value="fixed">Precio fijo</option>
                                </select>
                            </div>
                            <>
                                {
                                    limitedBy==="perGuest" && (
                                        <div className="form-group">
                                            <label htmlFor="servicePricePerGuest">Precio del Servicio por Invitado:</label>
                                            <p className="error-title">{errors.servicePricePerGuest}</p>
                                            <input
                                                type="number"
                                                id="servicePricePerGuest"
                                                name="servicePricePerGuest"
                                                value={formData.servicePricePerGuest}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )
                                }
                                {
                                    limitedBy==="perHour" && (
                                        <div className="form-group">
                                            <label htmlFor="servicePricePerHour">Precio del Servicio por hora:</label>
                                            <p className="error-title">{errors.servicePricePerHour}</p>
                                            <input
                                                type="number"
                                                id="servicePricePerHour"
                                                name="servicePricePerHour"
                                                value={formData.servicePricePerHour}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )
                                }
                                {
                                    limitedBy==="fixed" && (
                                        <div className="form-group">
                                            <label htmlFor="fixedPrice">Precio del Servicio fijo:</label>
                                            <p className="error-title">{errors.fixedPrice}</p>
                                            <input
                                                type="number"
                                                id="fixedPrice"
                                                name="fixedPrice"
                                                value={formData.fixedPrice}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    )
                                }
                            </>
                            <div className="form-group">
                                <label htmlFor="hours">Horas disponibles:</label>
                                <p className="error-title">{errors.hours}</p>
                                <input
                                    type="number"
                                    id="hours"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="picture">Imagen:</label>
                                <p className="error-title">{errors.picture}</p>
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
                            <div className="form-group">
                                <label htmlFor="description">Descripción:</label>
                                <p className="error-title">{errors.description}</p>
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
                                <div className="form-section">
                                    <p>Campos específicos para recintos de eventos:</p>
                                    <div className="form-group">
                                        <label htmlFor="postalCode">Código postal:</label>
                                        <p className="error-title">{errors.postalCode}</p>
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
                                    <div className="form-group">
                                        <label htmlFor="coordinates">Coordenadas:</label>
                                        <p className="error-title">{errors.coordinates}</p>
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
                                    <div className="form-group">
                                        <label htmlFor="address">Dirección:</label>
                                        <p className="error-title">{errors.address}</p>
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
                                    <div className="form-group">
                                        <label htmlFor="maxGuests">Máximo de invitados:</label>
                                        <p className="error-title">{errors.maxGuests}</p>
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
                                    <div className="form-group">
                                        <label htmlFor="surface">Superficie (m²):</label>
                                        <p className="error-title">{errors.surface}</p>
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
                                    <button type="submit" className="submit-button">Registrar recinto</button>
                                </div>
                            )}
                            {serviceType === "other-services" && (
                                <div className="form-section">
                                    <p>Campos específicos para otro tipo de servicio:</p>
                                    <div className="form-group">
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
                                    <div className="form-group">
                                        <label htmlFor="extraInformation">Información extra:</label>
                                        <p className="error-title">{errors.extraInformation}</p>
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
                                    <button type="submit" className="submit-button">Registrar otro servicio</button>
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
