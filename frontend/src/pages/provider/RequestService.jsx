"use client"

import { useState, useEffect } from "react"
import apiClient from "../../apiClient"
import { MapPin, DollarSign, Users, Clock, Check, X, Info, Package, CheckCircle, Calendar } from "lucide-react"
import "../../static/resources/css/RequestService.css"
import "../../static/resources/css/Servicios.css"

const Servicios = () => {
    const [eventProps, setEventProps] = useState([])
    const [loading, setLoading] = useState(true)

    const [spinner, setSpinner] = useState(null)

    const currentUser = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                const response = await apiClient.get(`/api/event-properties/pending/${currentUser.id}`)
                setEventProps(response.data)
            } catch (error) {
                console.error("Error fetching services:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    const handleAccept = async (id) => {
        setSpinner(id)
        try {
            await apiClient.put(`/api/event-properties/${id}`)
            setEventProps(eventProps.filter((service) => service.id !== id)) // Eliminar del estado local
        } catch (error) {
            console.error("Error al aceptar el servicio:", error)
        } finally {
            setSpinner(null)
            window.location.href = "/dashboard"
        }
    }

    const handleReject = async (id) => {
        setSpinner(id)
        try {
            await apiClient.delete(`/api/event-properties/${id}`)
            setEventProps(eventProps.filter((service) => service.id !== id)) // Eliminar del estado local
        } catch (error) {
            console.error("Error al rechazar el servicio:", error)
        } finally {
            setSpinner(null)
            window.location.href = "/dashboard"
        }
    }

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
        <div className="solicitudes-container">
            <div className="solicitudes-header">
                <h1 className="solicitudes-title">Solicitudes de Servicios</h1>
            </div>

            <div className="solicitudes-list">
                {loading ? (
                    <div className="empty-state">
                        <div className="loading-spinner"></div>
                        <p>Cargando solicitudes...</p>
                    </div>
                ) : eventProps.length === 0 ? (
                    <div className="empty-state">
                        <Info size={48} className="empty-icon" />
                        <h2 className="empty-title">No tienes solicitudes pendientes</h2>
                        <p className="empty-text">Cuando recibas solicitudes para tus servicios, aparecerán aquí.</p>
                    </div>
                ) : (
                    eventProps.map((eventProp) => {
                        const service = eventProp.otherServiceDTO !== null ? eventProp.otherServiceDTO : eventProp.venueDTO

                        return (
                            service ? <div key={eventProp.id} className="solicitud-card">
                                <h3 className="solicitud-title">{service.name}</h3>
                                <span className="solicitud-badge">{formatServiceType(service.type, service.otherServiceType)}</span>

                                <div className="solicitud-details">
                                    <div className="solicitud-detail">
                                        <Calendar size={18} className="detail-icon" />
                                        <div>
                                            <span className="detail-label">Fecha solicitada:</span>
                                            <span className="detail-value">{eventProp.requestDate}</span>
                                        </div>
                                    </div>

                                    <div className="solicitud-detail">
                                        <MapPin size={18} className="detail-icon" />
                                        <div>
                                            <span className="detail-label">Ciudad:</span>
                                            <span className="detail-value">{service.cityAvailable}</span>
                                        </div>
                                    </div>

                                    <div className="solicitud-detail">
                                        <CheckCircle size={18} className="detail-icon" />
                                        <div>
                                            <span className="detail-label">Disponible:</span>
                                            <span className="detail-value">{service.available ? "Sí" : "No"}</span>
                                        </div>
                                    </div>

                                    {service.limitedByPricePerGuest && (
                                        <div className="solicitud-detail">
                                            <Users size={18} className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Precio por invitado:</span>
                                                <span className="detail-value">{service.servicePricePerGuest}€</span>
                                            </div>
                                        </div>
                                    )}

                                    {service.limitedByPricePerHour && (
                                        <div className="solicitud-detail">
                                            <Clock size={18} className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Precio por hora:</span>
                                                <span className="detail-value">{service.servicePricePerHour}€</span>
                                            </div>
                                        </div>
                                    )}

                                    {!service.limitedByPricePerHour && !service.limitedByPricePerGuest && (
                                        <div className="solicitud-detail">
                                            <DollarSign size={18} className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Precio fijo:</span>
                                                <span className="detail-value">{service.fixedPrice}€</span>
                                            </div>
                                        </div>
                                    )}

                                    {service.type === "venue" && (
                                        <>
                                            <div className="solicitud-detail">
                                                <Users size={18} className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Capacidad:</span>
                                                    <span className="detail-value">{service.maxGuests} personas</span>
                                                </div>
                                            </div>

                                            <div className="solicitud-detail">
                                                <Package size={18} className="detail-icon" />
                                                <div>
                                                    <span className="detail-label">Superficie:</span>
                                                    <span className="detail-value">{service.surface} m²</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {service.type === "otherService" && service.extraInformation && (
                                        <div className="solicitud-detail">
                                            <Info size={18} className="detail-icon" />
                                            <div>
                                                <span className="detail-label">Info adicional:</span>
                                                <span className="detail-value">{service.extraInformation}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="solicitud-description">
                                    <span className="description-label">Descripción:</span>
                                    <p className="description-text">{service.description}</p>
                                </div>

                                <div className="solicitud-actions">
                                    <button className="accept-button" onClick={() => handleAccept(eventProp.id)}>
                                        {
                                            spinner === eventProp.id ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <Check size={18} />
                                                    Confirmar
                                                </>
                                            )
                                        }
                                    </button>
                                    <button className="reject-button" onClick={() => handleReject(eventProp.id)}>
                                        {
                                            spinner === eventProp.id ? (
                                                <>
                                                    <span className="spinner"></span>
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <X size={18} />
                                                    Rechazar
                                                </>
                                            )
                                        }
                                    </button>
                                </div>
                            </div> : ''
                        )
                    })
                )}
            </div>
        </div >
    )
}

export default Servicios

