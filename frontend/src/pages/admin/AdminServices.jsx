/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminServices() {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getServices();
    }, []);

    function getServices() {
        fetch("api/services/admin", {
            headers: {
                "Content-Type": "application/json",
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
                const otherServices = Array.isArray(data[0].otherServices) ? data[0].otherServices : [];
                const venues = Array.isArray(data[0].venues) ? data[0].venues : [];

                // Combinar ambos arrays en uno solo
                setServices([...otherServices, ...venues]);
                console.log("Servicios combinados:", services);
            })
            .catch(error => console.error("Error obteniendo servicios:", error));
    }

    function updateService(service) {
        fetch(`/api/admin/services/${service.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(service),
        })
            .then(response => response.json())
            .then(updatedService => {
                console.log("Servicio actualizado:", updatedService);
                setServices(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
            })
            .catch(error => console.error("Error actualizando servicio:", error));
    }

    function deleteService(serviceId) {
        fetch(`/api/admin/services/${serviceId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "DELETE",
        })
            .then(() => {
                console.log("Servicio eliminado:", serviceId);
                setServices(prevServices => prevServices.filter(service => service.id !== serviceId));
            })
            .catch(error => console.error("Error eliminando servicio:", error));
    }

    return (
        <>
            {currentUser?.role === "ADMIN" ? (
                services.length > 0 ? (
                    services.map((service, index) => (
                        <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                            <div>
                                <h2 className="service-title">{service.name}</h2>
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
                                </div>
                            </div>
                            <img
                                src={service.picture}
                                alt={service.name}
                                className="service-image"
                                onClick={() => navigate(`/service/${service.id}`)}
                                style={{ cursor: "pointer" }}
                            />
                            <div className="button-container">
                                <button className="save-btn" onClick={() => updateService(service.id)}>Guardar</button>
                                <button className="delete-btn" onClick={() => deleteService(service.id)}>Borrar</button>
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
