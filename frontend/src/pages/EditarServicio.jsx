import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Check, AlertCircle, Save } from 'lucide-react';
import apiClient from '../apiClient';
import "../static/resources/css/EditarServicio.css";

const EditarServicio = () => {
    const navigate = useNavigate();
    const { id, serviceType } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [limitedBy, setLimitedBy] = useState("perGuest");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [errors, setErrors] = useState({
        name: '',
        cityAvailable: '',
        servicePricePerGuest: '',
        servicePricePerHour: '',
        fixedPrice: '',
        picture: '',
        description: '',
        otherServiceType: '',
        postalCode: '',
        coordinates: '',
        address: '',
        maxGuests: '',
        surface: '',
        earliestTime: '',
        latestTime: '',
        extraInformation: ''
    });

    const [formData, setFormData] = useState({
        name: '',
        available: false,
        cityAvailable: '',
        servicePricePerGuest: 0,
        servicePricePerHour: 0,
        fixedPrice: '',
        picture: '',
        description: '',
        limitedByPricePerGuest: false,
        limitedByPricePerHour: false,
        otherServiceType: 'CATERING',
        postalCode: '',
        coordinates: '',
        address: '',
        maxGuests: 0,
        surface: 0,
        earliestTime: '',
        latestTime: '',
        extraInformation: '',
        user: {
            id: currentUser.id
        }
    });

    useEffect(() => {
        const fetchServiceData = async () => {
            setIsLoading(true);
            try {
                let response;
                if (serviceType === 'venue') {
                    response = await apiClient.get(`/api/venues/${id}`);
                } else {
                    response = await apiClient.get(`/api/other-services/${id}`);
                }

                setFormData({
                    ...response.data,
                    user: { id: currentUser.id }
                });

                setLimitedBy(
                    response.data.limitedByPricePerGuest
                        ? "perGuest"
                        : response.data.limitedByPricePerHour
                            ? "perHour"
                            : "fixed"
                );
            } catch (error) {
                console.error(`Error fetching the ${serviceType}:`, error);
                setError(`No se pudo cargar la información del ${serviceType === 'venue' ? 'recinto' : 'servicio'}.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceData();
    }, [id, serviceType, currentUser.id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const updatedFormData = {
            ...formData,
            limitedByPricePerGuest: limitedBy === "perGuest",
            limitedByPricePerHour: limitedBy === "perHour"
        };

        try {
            if (serviceType === 'venue') {
                await apiClient.put(`/api/venues/${id}`, updatedFormData);
            } else {
                await apiClient.put(`/api/other-services/${id}`, updatedFormData);
            }
            navigate('/misservicios');
        } catch (error) {
            console.error(`Error updating the ${serviceType}:`, error);
            setError(`No se pudo actualizar el ${serviceType === 'venue' ? 'recinto' : 'servicio'}. Por favor, inténtelo de nuevo.`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !formData.name) {
        return <div className="loading-container">Cargando información del servicio...</div>;
    }

    return (
        <div className="edit-service-container">
            <div className="edit-service-card">
                <div className="edit-service-header">
                    <Edit className="header-icon" />
                    <h1>Editar {serviceType === 'venue' ? 'Recinto' : 'Servicio'}</h1>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="edit-service-form">
                    <div className="form-section">
                        <h2>Información General</h2>

                        <div className="form-group">

                            <label htmlFor="name">
                                Nombre
                            </label>
                            {errors.name && <p className="error-text">{errors.name}</p>}
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                minLength="1"
                                maxLength="500"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <label htmlFor="available" className="checkbox-label">
                                <input
                                    type="checkbox"
                                    id="available"
                                    name="available"
                                    checked={formData.available}
                                    onChange={handleChange}
                                    className="checkbox-input"
                                />
                                <span className="checkbox-text">
                                    <Check size={16} className="checkbox-icon" />
                                    Disponible
                                </span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="cityAvailable">
                                Ciudad Disponible
                            </label>
                            {errors.cityAvailable && <p className="error-text">{errors.cityAvailable}</p>}
                            <input
                                type="text"
                                id="cityAvailable"
                                name="cityAvailable"
                                value={formData.cityAvailable}
                                onChange={handleChange}
                                required
                                minLength="1"
                                maxLength="30"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="picture">
                                URL de la Imagen
                            </label>
                            {errors.picture && <p className="error-text">{errors.picture}</p>}
                            <input
                                type="text"
                                id="picture"
                                name="picture"
                                value={formData.picture}
                                onChange={handleChange}
                                required
                                minLength="1"
                                maxLength="250"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Descripción
                            </label>
                            {errors.description && <p className="error-text">{errors.description}</p>}
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                minLength="1"
                                maxLength="1000"
                                className="form-textarea"
                                rows="4"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Información de Precios</h2>

                        <div className="form-group">
                            <label htmlFor="limitedBy">
                                Tipo de Precio
                            </label>
                            <select
                                id="limitedBy"
                                value={limitedBy}
                                onChange={(e) => setLimitedBy(e.target.value)}
                                className="form-select"
                            >
                                <option value="perGuest">Por invitado</option>
                                <option value="perHour">Por hora</option>
                                <option value="fixed">Precio fijo</option>
                            </select>
                        </div>

                        {limitedBy === "perGuest" && (
                            <div className="form-group">
                                <label htmlFor="servicePricePerGuest">
                                    Precio por Invitado (€)
                                </label>
                                {errors.servicePricePerGuest && <p className="error-text">{errors.servicePricePerGuest}</p>}
                                <input
                                    type="number"
                                    id="servicePricePerGuest"
                                    name="servicePricePerGuest"
                                    value={formData.servicePricePerGuest}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    max="10000000.00"
                                    className="form-input"
                                />
                            </div>
                        )}

                        {limitedBy === "perHour" && (
                            <div className="form-group">
                                <label htmlFor="servicePricePerHour">
                                    Precio por Hora (€)
                                </label>
                                {errors.servicePricePerHour && <p className="error-text">{errors.servicePricePerHour}</p>}
                                <input
                                    type="number"
                                    id="servicePricePerHour"
                                    name="servicePricePerHour"
                                    value={formData.servicePricePerHour}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    max="10000000.00"
                                    className="form-input"
                                />
                            </div>
                        )}

                        {limitedBy === "fixed" && (
                            <div className="form-group">
                                <label htmlFor="fixedPrice">
                                    Precio Fijo (€)
                                </label>
                                {errors.fixedPrice && <p className="error-text">{errors.fixedPrice}</p>}
                                <input
                                    type="number"
                                    id="fixedPrice"
                                    name="fixedPrice"
                                    value={formData.fixedPrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    max="10000000.00"
                                    className="form-input"
                                />
                            </div>
                        )}
                    </div>

                    {serviceType === "venue" ? (
                        <div className="form-section">
                            <h2>Información del Recinto</h2>

                            <div className="form-group">
                                <label htmlFor="postalCode">
                                    Código Postal
                                </label>
                                {errors.postalCode && <p className="error-text">{errors.postalCode}</p>}
                                <input
                                    type="text"
                                    id="postalCode"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="5"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="coordinates">
                                    Coordenadas
                                </label>
                                {errors.coordinates && <p className="error-text">{errors.coordinates}</p>}
                                <input
                                    type="text"
                                    id="coordinates"
                                    name="coordinates"
                                    value={formData.coordinates}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="30"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">
                                    Dirección
                                </label>
                                {errors.address && <p className="error-text">{errors.address}</p>}
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="50"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="maxGuests">
                                        Máximo de Invitados
                                    </label>
                                    {errors.maxGuests && <p className="error-text">{errors.maxGuests}</p>}
                                    <input
                                        type="number"
                                        id="maxGuests"
                                        name="maxGuests"
                                        value={formData.maxGuests}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="surface">
                                        Superficie (m²)
                                    </label>
                                    {errors.surface && <p className="error-text">{errors.surface}</p>}
                                    <input
                                        type="number"
                                        id="surface"
                                        name="surface"
                                        value={formData.surface}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="earliestTime">
                                        Hora de Apertura
                                    </label>
                                    {errors.earliestTime && <p className="error-text">{errors.earliestTime}</p>}
                                    <input
                                        type="time"
                                        id="earliestTime"
                                        name="earliestTime"
                                        value={formData.earliestTime}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="latestTime">
                                        Hora de Cierre
                                    </label>
                                    {errors.latestTime && <p className="error-text">{errors.latestTime}</p>}
                                    <input
                                        type="time"
                                        id="latestTime"
                                        name="latestTime"
                                        value={formData.latestTime}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-section">
                            <h2>Información del Servicio</h2>

                            <div className="form-group">
                                <label htmlFor="otherServiceType">
                                    Tipo de Servicio
                                </label>
                                <select
                                    id="otherServiceType"
                                    name="otherServiceType"
                                    value={formData.otherServiceType}
                                    onChange={handleChange}
                                    required
                                    className="form-select"
                                >
                                    <option value="CATERING">Catering</option>
                                    <option value="ENTERTAINMENT">Entretenimiento</option>
                                    <option value="DECORATION">Decoración</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="extraInformation">
                                    Información Adicional
                                </label>
                                {errors.extraInformation && <p className="error-text">{errors.extraInformation}</p>}
                                <textarea
                                    id="extraInformation"
                                    name="extraInformation"
                                    value={formData.extraInformation}
                                    onChange={handleChange}
                                    required
                                    minLength="1"
                                    maxLength="1000"
                                    className="form-textarea"
                                    rows="4"
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate('/misservicios')}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-button" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>Guardar Cambios</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarServicio;