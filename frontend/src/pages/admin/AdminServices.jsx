/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminServices() {
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    // Get JWT token
    const jwt = window.localStorage.getItem("jwt");

    if (jwt === undefined) {
        return "This page is for admin users."
    }

    useEffect(() => {
        getServices();
    }, []);

    function getServices() {
        fetch("api/services/admin", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Servicios obtenidos:", data);
                // Unimos `otherServices` y `venues` en un solo array
                const otherServices = Array.isArray(data[0].otherServices) ? data[0].otherServices.map(otherService => ({ ...otherService, type: "other-services" })) : [];
                const venues = Array.isArray(data[0].venues) ? data[0].venues.map(venue => ({ ...venue, type: "venues" })) : [];

                // Combinar ambos arrays en uno solo
                setServices([...otherServices, ...venues]);
                console.log("Servicios combinados:", services);
            })
            .catch(error => console.error("Error obteniendo servicios:", error));
    }

    function updateService(service) {
        fetch(`/api/${service.type}/admin/${service.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "PUT",
            body: JSON.stringify(service),
        })
            .then(response => response.json())
            .then(updatedService => {
                console.log("Servicio actualizado:", updatedService);
                setServices(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
                setEditingService(null);
            })
            .catch(error => console.error("Error actualizando servicio:", error));
    }

    function deleteService(serviceId, serviceType) {
        fetch(`/api/${serviceType}/admin/${serviceId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "DELETE",
        })
            .then((response) => {
                console.log("Servicio eliminado:", serviceId);
                if (response.ok)
                    setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
            })
            .catch(error => console.error("Error eliminando servicio:", error));
    }

    function handleInputChange(e, field) {
        const { name, value } = e.target;
        setEditingService(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleEdit(service) {
        setEditingService(service);
    }

    function handleSave() {
        updateService(editingService);
    }

    return (
        <>
            {currentUser?.role === "ADMIN" ? (
                services.length > 0 ? (
                    services.map((service, index) => (
                        <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                            <div>
                                <h2 className="service-title">{service.name}</h2>
                                {editingService?.id === service.id ? (
                                    <div className="service-info">
                                        <form onSubmit={handleSave}>
                                            <div className="form-group">
                                                <label htmlFor="name"><strong>Título del Servicio:</strong></label>
                                                <input type="text" name="name" value={editingService.name} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="available"><strong>Disponible:</strong></label>
                                                <select name="available" value={editingService.available} onChange={handleInputChange}>
                                                    <option value={true}>Sí</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="cityAvailable"><strong>Ciudad Disponible:</strong></label>
                                                <input type="text" name="cityAvailable" value={editingService.cityAvailable} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="servicePricePerGuest"><strong>Precio por Invitado:</strong></label>
                                                <input type="number" name="servicePricePerGuest" value={editingService.servicePricePerGuest} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="servicePricePerHour"><strong>Precio por Hora:</strong></label>
                                                <input type="number" name="servicePricePerHour" value={editingService.servicePricePerHour} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="fixedPrice"><strong>Precio Fijo:</strong></label>
                                                <input type="number" name="fixedPrice" value={editingService.fixedPrice} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="hours"><strong>Horas:</strong></label>
                                                <input type="number" name="hours" value={editingService.hours} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="limitedByPricePerGuest"><strong>Limitado por Precio por Invitado:</strong></label>
                                                <select name="limitedByPricePerGuest" value={editingService.limitedByPricePerGuest} onChange={handleInputChange}>
                                                    <option value={true}>Sí</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="limitedByPricePerHour"><strong>Limitado por Precio por Hora:</strong></label>
                                                <select name="limitedByPricePerHour" value={editingService.limitedByPricePerHour} onChange={handleInputChange}>
                                                    <option value={true}>Sí</option>
                                                    <option value={false}>No</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description"><strong>Descripción:</strong></label>
                                                <input type="text" name="description" value={editingService.description} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="picture"><strong>Enlace de la Imagen:</strong></label>
                                                <input type="text" name="picture" value={editingService.picture} onChange={handleInputChange} />
                                            </div>
                                            {service.type === "venue" && (
                                                <>
                                                    <div className="form-group">
                                                        <label htmlFor="postalCode"><strong>Código Postal:</strong></label>
                                                        <input type="text" name="postalCode" value={editingService.postalCode} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="coordinates"><strong>Coordenadas:</strong></label>
                                                        <input type="text" name="coordinates" value={editingService.coordinates} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="address"><strong>Dirección:</strong></label>
                                                        <input type="text" name="address" value={editingService.address} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="maxGuests"><strong>Capacidad Máxima:</strong></label>
                                                        <input type="number" name="maxGuests" value={editingService.maxGuests} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="surface"><strong>Superficie:</strong></label>
                                                        <input type="number" name="surface" value={editingService.surface} onChange={handleInputChange} />
                                                    </div>
                                                </>
                                            )}
                                            {service.type === "other-service" && (
                                                <>
                                                    <div className="form-group">
                                                        <label htmlFor="otherServiceType"><strong>Tipo de Servicio:</strong></label>
                                                        <input type="text" name="otherServiceType" value={editingService.otherServiceType} onChange={handleInputChange} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="extraInformation"><strong>Información Extra:</strong></label>
                                                        <input type="text" name="extraInformation" value={editingService.extraInformation} onChange={handleInputChange} />
                                                    </div>
                                                </>
                                            )}
                                            <button type="submit" className="submit-button">Guardar</button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="service-info">
                                        <p><strong>Disponible:</strong> {service.available ? "Sí" : "No"}</p>
                                        <p><strong>Ciudad Disponible:</strong> {service.cityAvailable}</p>
                                        <p>
                                            <strong>Precio por Invitado:</strong>{" "}
                                            {service.servicePricePerGuest.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                        </p>
                                        <p>
                                            <strong>Precio por Hora:</strong>{" "}
                                            {service.servicePricePerHour.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                        </p>
                                        <p>
                                            <strong>Precio Fijo:</strong>{" "}
                                            {service.fixedPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                        </p>
                                        <p><strong>Horas:</strong> {service.hours}</p>
                                        <p>
                                            <strong>Limitado por Precio por Invitado:</strong> {service.limitedByPricePerGuest ? "Sí" : "No"}
                                        </p>
                                        <p>
                                            <strong>Limitado por Precio por Hora:</strong> {service.limitedByPricePerHour ? "Sí" : "No"}
                                        </p>
                                        <p><strong>Descripción:</strong> {service.description}</p>
                                        {service.type === "venue" && (
                                            <>
                                                <p><strong>Código Postal:</strong> {service.postalCode}</p>
                                                <p><strong>Coordenadas:</strong> {service.coordinates}</p>
                                                <p><strong>Dirección:</strong> {service.address}</p>
                                                <p><strong>Capacidad Máxima:</strong> {service.maxGuests}</p>
                                                <p><strong>Superficie:</strong> {service.surface} m²</p>
                                            </>
                                        )}
                                        {service.type === "other-service" && (
                                            <>
                                                <p><strong>Tipo de Servicio:</strong> {service.otherServiceType}</p>
                                                <p><strong>Información Extra:</strong> {service.extraInformation}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <img
                                src={service.picture}
                                alt={service.name}
                                className="service-image"
                                onClick={() => navigate(`/service/${service.id}`)}
                                style={{ cursor: "pointer" }}
                            />
                            <div className="button-container">
                                {editingService?.id !== service.id && (
                                    <button className="edit-btn" onClick={() => handleEdit(service)}>Editar</button>
                                )}
                                <button className="delete-btn" onClick={() => deleteService(service.id, service.type)}>Borrar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-service">
                        <p>No hay servicios disponibles en este momento.</p>
                    </div>
                )
            ) : (
                <p>No tienes permisos para ver esta sección.</p>
            )}
        </>
    );
}

export default AdminServices;
