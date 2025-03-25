"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import apiClient from "../apiClient"
import {
    AlertCircle,
    Clock,
    DollarSign,
    MapPin,
    Save,
    Users,
    Home,
    Info,
    Image,
    FileText,
    Mail,
    Package,
    SquareIcon,
} from "lucide-react"
import "../static/resources/css/RegistrarServicio.css"

const EditarServicio = () => {
    const navigate = useNavigate()
    const { id, serviceType } = useParams()
    const currentUser = JSON.parse(localStorage.getItem("user"))

    const [limitedBy, setLimitedBy] = useState("perGuest")
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        name: "",
        available: false,
        cityAvailable: "",
        servicePricePerGuest: 0,
        servicePricePerHour: 0,
        fixedPrice: "",
        picture: "",
        description: "",
        limitedByPricePerGuest: false,
        limitedByPricePerHour: false,
        otherServiceType: "CATERING",
        postalCode: "",
        coordinates: "",
        address: "",
        maxGuests: 0,
        surface: 0,
        earliestTime: "",
        latestTime: "",
        extraInformation: "",
        user: { id: currentUser.id },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = serviceType === "venue" ? `/api/venues/${id}` : `/api/other-services/${id}`
                const response = await apiClient.get(endpoint)
                const data = response.data

                setFormData({
                    ...formData,
                    ...data,
                    user: { id: currentUser.id },
                })

                setLimitedBy(
                    data.limitedByPricePerGuest ? "perGuest" : data.limitedByPricePerHour ? "perHour" : "fixed"
                )
            } catch (error) {
                console.error("Error fetching the service:", error)
            }
        }

        fetchData()
    }, [id, serviceType])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        formData.limitedByPricePerGuest = limitedBy === "perGuest"
        formData.limitedByPricePerHour = limitedBy === "perHour"

        const endpoint = serviceType === "venue" ? `/api/venues/${id}` : `/api/other-services/${id}`
        try {
            await apiClient.put(endpoint, formData)
            navigate("/misservicios")
        } catch (error) {
            console.error("Error updating the service:", error)
        }
    }

    return (
        <div className="service-registration-container">
            <div className="service-registration-header">
                <h1 className="service-registration-title">Editar Servicio</h1>
                <h2 className="service-registration-subtitle">Actualiza los datos de tu servicio</h2>
            </div>

            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3 className="form-section-title">Información básica del servicio</h3>

                        <div className="form-group">
                            <label htmlFor="name" className="form-label">
                                <Package size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                Nombre del servicio
                            </label>
                            {errors.name && <div className="error-message"><AlertCircle size={14} />{errors.name}</div>}
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="Ej: Salón de eventos El Dorado"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="cityAvailable" className="form-label">
                                    <MapPin size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Ciudad disponible
                                </label>
                                {errors.cityAvailable && <div className="error-message"><AlertCircle size={14} />{errors.cityAvailable}</div>}
                                <input
                                    type="text"
                                    id="cityAvailable"
                                    name="cityAvailable"
                                    value={formData.cityAvailable}
                                    onChange={handleChange}
                                    required
                                    className="form-input"
                                    placeholder="Ej: Madrid"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="available" className="form-label">Disponibilidad</label>
                                <div className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        id="available"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleChange}
                                        className="form-checkbox"
                                    />
                                    <span>Servicio disponible para reservas</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="limitedBy" className="form-label">
                                <DollarSign size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                Tipo de tarifa
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
                                <label htmlFor="servicePricePerGuest" className="form-label">
                                    <Users size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Precio por invitado (€)
                                </label>
                                <input
                                    type="number"
                                    id="servicePricePerGuest"
                                    name="servicePricePerGuest"
                                    value={formData.servicePricePerGuest}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}

                        {limitedBy === "perHour" && (
                            <div className="form-group">
                                <label htmlFor="servicePricePerHour" className="form-label">
                                    <Clock size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Precio por hora (€)
                                </label>
                                <input
                                    type="number"
                                    id="servicePricePerHour"
                                    name="servicePricePerHour"
                                    value={formData.servicePricePerHour}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}

                        {limitedBy === "fixed" && (
                            <div className="form-group">
                                <label htmlFor="fixedPrice" className="form-label">
                                    <DollarSign size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Precio fijo (€)
                                </label>
                                <input
                                    type="number"
                                    id="fixedPrice"
                                    name="fixedPrice"
                                    value={formData.fixedPrice}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="picture" className="form-label">
                                <Image size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                URL de la imagen
                            </label>
                            <input
                                type="text"
                                id="picture"
                                name="picture"
                                value={formData.picture}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description" className="form-label">
                                <FileText size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="form-input"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    {serviceType === "venue" ? (
                        <div className="form-section">
                            <h3 className="form-section-title">Información específica del recinto</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="address" className="form-label">
                                        <Home size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="postalCode" className="form-label">
                                        <Mail size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Código postal
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="coordinates" className="form-label">
                                    <MapPin size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Coordenadas
                                </label>
                                <input
                                    type="text"
                                    id="coordinates"
                                    name="coordinates"
                                    value={formData.coordinates}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="maxGuests" className="form-label">
                                        <Users size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Máximo de invitados
                                    </label>
                                    <input
                                        type="number"
                                        id="maxGuests"
                                        name="maxGuests"
                                        value={formData.maxGuests}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="surface" className="form-label">
                                        <SquareIcon size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Superficie (m²)
                                    </label>
                                    <input
                                        type="number"
                                        id="surface"
                                        name="surface"
                                        value={formData.surface}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="earliestTime" className="form-label">
                                        <Clock size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Hora de apertura
                                    </label>
                                    <input
                                        type="time"
                                        id="earliestTime"
                                        name="earliestTime"
                                        value={formData.earliestTime}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="latestTime" className="form-label">
                                        <Clock size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                        Hora de cierre
                                    </label>
                                    <input
                                        type="time"
                                        id="latestTime"
                                        name="latestTime"
                                        value={formData.latestTime}
                                        onChange={handleChange}
                                        className="form-input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="form-section">
                            <h3 className="form-section-title">Información específica del servicio</h3>
                            <div className="form-group">
                                <label htmlFor="otherServiceType" className="form-label">
                                    <Package size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Tipo de servicio
                                </label>
                                <select
                                    id="otherServiceType"
                                    name="otherServiceType"
                                    value={formData.otherServiceType}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="CATERING">Catering</option>
                                    <option value="ENTERTAINMENT">Entretenimiento</option>
                                    <option value="DECORATION">Decoración</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="extraInformation" className="form-label">
                                    <Info size={16} className="inline-block mr-2" style={{ color: "#d9be75" }} />
                                    Información adicional
                                </label>
                                <textarea
                                    id="extraInformation"
                                    name="extraInformation"
                                    value={formData.extraInformation}
                                    onChange={handleChange}
                                    className="form-input"
                                    rows={4}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="submit-button">
                        <Save size={18} />
                        Guardar cambios
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditarServicio
