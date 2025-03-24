"use client"

import { useState, useEffect } from "react"
import apiClient from "../apiClient"
import { useNavigate } from "react-router-dom"
import { CheckCircle, MapPin, DollarSign, Users, Clock, Plus, Edit, Package, Info } from "lucide-react"
import "../static/resources/css/Servicios.css"

const Servicios = () => {
    const [services, setServices] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Obtener datos user desde localStorage
    const currentUser = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        // Fetch the services of the provider
        const fetchServices = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get(`/api/services/user/${currentUser.id}`)
                console.log("Response:", response.data)
                const otherServices = Array.isArray(response.data.otherServices)
                    ? response.data.otherServices.map((otherService) => ({ ...otherService, type: "otherService" }))
                    : []
                const venues = Array.isArray(response.data.venues)
                    ? response.data.venues.map((venue) => ({ ...venue, type: "venue" }))
                    : []
                setServices([...otherServices, ...venues])
            } catch (error) {
                console.error("Error fetching services:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [currentUser.id])

    // Función para formatear el tipo de servicio
    const formatServiceType = (type, otherServiceType) => {
        if (type === "venue") return "Recinto para eventos"

        switch (otherServiceType) {
            case "CATERING":
                return "Catering"
            case "ENTERTAINMENT":
                return "Entretenimiento"
            case "DECORATION":
                return "Decoración"
            default:
                return "Otro servicio"
        }
    }

    return (
        <div className="mis-servicios-container">
            <h1 className="mis-servicios-title">Mis Servicios</h1>

            {loading ? (
                <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Cargando servicios...</p>
                </div>
            ) : services.length === 0 ? (
                <div className="empty-state">
                    <Info size={48} className="empty-icon" />
                    <h2 className="empty-title">No tienes servicios registrados</h2>
                    <p className="empty-text">Comienza creando tu primer servicio.</p>
                </div>
            ) : (
                <div className="services-list">
                    {services.map((service) => (
                        <div key={service.id} className="service-item">
                            <div className="service-header">
                                <h3 className="service-title">{service.name}</h3>
                                <span className="service-badge">{formatServiceType(service.type, service.otherServiceType)}</span>
                            </div>

                            <div className="service-body">
                                <div className="service-info">
                                    <CheckCircle size={18} className="info-icon" />
                                    <div>
                                        <span className="info-label">Disponible:</span>
                                        <span className="info-value">{service.available ? "Sí" : "No"}</span>
                                    </div>
                                </div>

                                <div className="service-info">
                                    <MapPin size={18} className="info-icon" />
                                    <div>
                                        <span className="info-label">Ciudad:</span>
                                        <span className="info-value">{service.cityAvailable}</span>
                                    </div>
                                </div>

                                {service.limitedByPricePerGuest && (
                                    <div className="service-info">
                                        <Users size={18} className="info-icon" />
                                        <div>
                                            <span className="info-label">Precio por invitado:</span>
                                            <span className="info-value">{service.servicePricePerGuest}€</span>
                                        </div>
                                    </div>
                                )}

                                {service.limitedByPricePerHour && (
                                    <div className="service-info">
                                        <Clock size={18} className="info-icon" />
                                        <div>
                                            <span className="info-label">Precio por hora:</span>
                                            <span className="info-value">{service.servicePricePerHour}€</span>
                                        </div>
                                    </div>
                                )}

                                {!service.limitedByPricePerHour && !service.limitedByPricePerGuest && (
                                    <div className="service-info">
                                        <DollarSign size={18} className="info-icon" />
                                        <div>
                                            <span className="info-label">Precio fijo:</span>
                                            <span className="info-value">{service.fixedPrice}€</span>
                                        </div>
                                    </div>
                                )}

                                {service.type === "venue" && (
                                    <>
                                        <div className="service-info">
                                            <Users size={18} className="info-icon" />
                                            <div>
                                                <span className="info-label">Capacidad:</span>
                                                <span className="info-value">{service.maxGuests} personas</span>
                                            </div>
                                        </div>

                                        <div className="service-info">
                                            <Package size={18} className="info-icon" />
                                            <div>
                                                <span className="info-label">Superficie:</span>
                                                <span className="info-value">{service.surface} m²</span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="service-description">
                                    <span className="description-label">Descripción:</span>
                                    <p className="description-text">{service.description}</p>
                                </div>
                            </div>

                            <div className="service-footer">
                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        navigate(`/misservicios/editar/${service.type}/${service.id}/`, {
                                            id: service.id,
                                            serviceType: service.type,
                                        })
                                    }
                                >
                                    <Edit size={16} />
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="create-service-container">
                <button className="create-service-button" onClick={() => navigate("/misservicios/registrar")}>
                    <Plus size={18} />
                    Crear nuevo servicio
                </button>
            </div>
        </div>
    )
}

export default Servicios

