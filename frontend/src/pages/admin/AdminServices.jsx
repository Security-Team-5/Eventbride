/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminServices() {
    const [services, setServices] = useState([]);
    const [editServiceId, setEditServiceId] = useState(null); // Para saber qué servicio se está editando
    const [serviceData, setServiceData] = useState({});

    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const jwt = window.localStorage.getItem("jwt");
    const otherServiceTypeMap = {
        CATERING: "Catering",
        ENTERTAINMENT: "Entretenimiento",
        DECORATION :"Decoración",
    };

    if (jwt === undefined) {
        return "This page is for admin users.";
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
                const otherServices = Array.isArray(data[0].otherServices) ? data[0].otherServices.map(otherService => ({ ...otherService, type: "other-service" })) : [];
                const venues = Array.isArray(data[0].venues) ? data[0].venues.map(venue => ({ ...venue, type: "venue" })) : [];
                setServices([...otherServices, ...venues]);
            })
            .catch(error => console.error("Error obteniendo servicios:", error));
    }

    function updateService(service) {
        fetch(`/api/admin/services/${service.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            },
            method: "PUT",
            body: JSON.stringify(serviceData[service.id]), 
        })
            .then(response => response.json())
            .then(updatedService => {
                console.log("Servicio actualizado:", updatedService);
                setServices(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
                setEditServiceId(null);
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

    function handleInputChange(e) {
        const { name, value } = e.target;
        const updatedData = {
            ...serviceData,
            [editServiceId]: {
                ...serviceData[editServiceId],
                [name]: value
            }
        };
        setServiceData(updatedData); 
    }


    function startEditing(service) {
        setEditServiceId(service.id);  
        setServiceData(prevData => ({
            ...prevData,
            [service.id]: service  
        }));
    }

    function autoResizeTextarea(e) {
        e.target.style.height = 'auto'; 
        e.target.style.height = `${e.target.scrollHeight}px`; 
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
                                    <form onSubmit={e => { e.preventDefault(); updateService(service) }}>
                                        <div>
                                            <label>Nombre del Servicio:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={serviceData[editServiceId]?.name || service.name}
                                                onChange={handleInputChange}
                                                readOnly={editServiceId !== service.id}  
                                            />
                                        </div>
                                        <div>
                                            <label>Disponible:</label>
                                            <select
                                                name="available"
                                                value={serviceData[editServiceId]?.available || service.available}
                                                onChange={handleInputChange}
                                                disabled={editServiceId !== service.id} 
                                                style={{ width: "100%" }}
                                            >
                                                <option value="true">Sí</option>
                                                <option value="false">No</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Ciudad Disponible:</label>
                                            <input
                                                type="text"
                                                name="cityAvailable"
                                                value={serviceData[editServiceId]?.cityAvailable || service.cityAvailable}
                                                onChange={handleInputChange}
                                                readOnly={editServiceId !== service.id}  
                                            />
                                        </div>
                                        <div>
                                            <label>Descripción:</label>
                                            <textarea
                                                name="description"
                                                value={serviceData[editServiceId]?.description || service.description}
                                                onChange={handleInputChange}
                                                onInput={autoResizeTextarea}
                                                rows="1"
                                                style={{
                                                    width: "98%",
                                                    resize: "none",
                                                    overflow: "hidden",
                                                    minHeight: "50px",
                                                    padding: "8px",
                                                    fontSize: "14px",
                                                    borderRadius: "5px",
                                                    border: "1px solid #ccc"
                                                }}
                                                readOnly={editServiceId !== service.id}  
                                            />
                                        </div>

                                        {service.type === "venue" && (
                                            <>
                                                <div>
                                                    <label>Código Postal:</label>
                                                    <input
                                                        type="text"
                                                        name="postalCode"
                                                        value={serviceData[editServiceId]?.postalCode || service.postalCode}
                                                        onChange={handleInputChange}
                                                        readOnly={editServiceId !== service.id} 
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {service.type === "other-service" && (
                                            <>
                                                <div>
                                                    <label>Tipo de Servicio:</label>
                                                    <select
                                                        name="role"
                                                        value={serviceData.id === service.id ? service.otherServiceType : service.otherServiceType}
                                                        onChange={handleInputChange}
                                                        style={{ width: "100%" }}
                                                    >
                                                        {Object.keys(otherServiceTypeMap).map(otherServiceType => (
                                                            <option key={otherServiceType} value={otherServiceType}>{otherServiceTypeMap[otherServiceType]}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label>Información Extra:</label>
                                                    <textarea
                                                        name="extraInformation"
                                                        value={serviceData[editServiceId]?.extraInformation || service.extraInformation}
                                                        onChange={handleInputChange}
                                                        onInput={autoResizeTextarea}
                                                        rows="1"
                                                        style={{
                                                            width: "98%",
                                                            resize: "none",
                                                            overflow: "hidden",
                                                            minHeight: "50px",
                                                            padding: "8px",
                                                            fontSize: "14px",
                                                            borderRadius: "5px",
                                                            border: "1px solid #ccc"
                                                        }}
                                                        readOnly={editServiceId !== service.id}  
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div>
                                            <label>Foto:</label>
                                            <img src={service.picture} className="service-image" />
                                        </div>

                                        {editServiceId === service.id ? (
                                            <div className="button-container">
                                                <button className="save-btn" type="submit">Guardar</button>
                                                <button className="delete-btn" onClick={() => deleteService(service.id)}>Borrar</button>
                                            </div>
                                        ) : (
                                            <div className="button-container">
                                                <button onClick={() => startEditing(service)} className="edit-btn">Editar</button>
                                                <button className="delete-btn" onClick={() => deleteService(service.id)}>Borrar</button>
                                            </div>
                                        )}
                                    </form>
                                </div>
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
