/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

function AdminServices() {
    const [services, setServices] = useState([]);
    const [editingService, setEditingService] = useState(null);
    const [error, setError] = useState("");
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
        
        // Manejo especial para el codigo postal (sólo numeros)
        if (name === "postalCode") {
            // Permite solo números
            const digits = value.replace(/\D/g, '');
            
            // Limita la longitud a 5 dígitos
            const newPostalCode = digits.substring(0, 5);
            
            setEditingService(prev => ({
                ...prev,
                [name]: newPostalCode
            }));
        } 
        // Manejo especial para la ciudad (sólo letras y espacios)
        else if (name === "cityAvailable") {
            // Permite solo letras, espacios y algunos caracteres especiales para ciudades con acentos
            const letters = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '');
            
            setEditingService(prev => ({
                ...prev,
                [name]: letters
            }));
        }
        else {
            setEditingService(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }

    function handleEdit(service) {
        setEditingService(service);
    }

    function validateService(service) {
        setError("");
        
        // Comprobar campos obligatorios
        if (!service.name || !service.cityAvailable || !service.description) {
            setError("Por favor, complete todos los campos obligatorios.");
            return false;
        }
        
        // Validar longitud del nombre
        if (service.name.length > 100) {
            setError("El nombre del servicio no puede tener más de 100 caracteres.");
            return false;
        }
        
        // Validar precios
        if (service.servicePricePerGuest < 0) {
            setError("El precio por invitado no puede ser negativo.");
            return false;
        }
        
        if (service.servicePricePerHour < 0) {
            setError("El precio por hora no puede ser negativo.");
            return false;
        }
        
        if (service.fixedPrice < 0) {
            setError("El precio fijo no puede ser negativo.");
            return false;
        }
        
        // Validar URL de la imagen
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (service.picture && !urlPattern.test(service.picture)) {
            setError("La URL de la imagen no es válida.");
            return false;
        }
        
        // Validaciones específicas para venues
        if (service.type === "venues") {
            // Validar código postal (5 dígitos para España)
            const postalCodePattern = /^\d{5}$/;
            if (!postalCodePattern.test(service.postalCode)) {
                setError("El código postal debe tener 5 dígitos.");
                return false;
            }
            
            // Validar capacidad máxima
            if (service.maxGuests <= 0) {
                setError("La capacidad máxima debe ser mayor que cero.");
                return false;
            }
            
            // Validar superficie
            if (service.surface <= 0) {
                setError("La superficie debe ser mayor que cero.");
                return false;
            }
            
            // Validar dirección
            if (!service.address) {
                setError("La dirección es obligatoria.");
                return false;
            }
            
            // Validar horarios
            if (!service.earliestTime || !service.latestTime) {
                setError("Los horarios de apertura y cierre son obligatorios.");
                return false;
            }
        }
        
        // Validaciones específicas para otros servicios
        if (service.type === "other-services") {
            if (!service.otherServiceType) {
                setError("El tipo de servicio es obligatorio.");
                return false;
            }
            
            if (!service.extraInformation) {
                setError("La información extra es obligatoria.");
                return false;
            }
            
            if (service.extraInformation.length > 1000) {
                setError("La información extra no puede tener más de 1000 caracteres.");
                return false;
            }
        }
        
        return true;
    }

    function handleSave() {
        if (validateService(editingService)) {
            updateService(editingService);
        }
    }

    return (
        <>
            {error && (
                <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}
            
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
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    value={editingService.name} 
                                                    onChange={handleInputChange} 
                                                    required 
                                                    maxLength="100" 
                                                />
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
                                                <input 
                                                    type="text" 
                                                    name="cityAvailable" 
                                                    value={editingService.cityAvailable} 
                                                    onChange={handleInputChange} 
                                                    required 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="servicePricePerGuest"><strong>Precio por Invitado:</strong></label>
                                                <input 
                                                    type="number" 
                                                    name="servicePricePerGuest" 
                                                    value={editingService.servicePricePerGuest} 
                                                    onChange={handleInputChange} 
                                                    min="0" 
                                                    step="0.01" 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="servicePricePerHour"><strong>Precio por Hora:</strong></label>
                                                <input 
                                                    type="number" 
                                                    name="servicePricePerHour" 
                                                    value={editingService.servicePricePerHour} 
                                                    onChange={handleInputChange} 
                                                    min="0" 
                                                    step="0.01" 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="fixedPrice"><strong>Precio Fijo:</strong></label>
                                                <input 
                                                    type="number" 
                                                    name="fixedPrice" 
                                                    value={editingService.fixedPrice} 
                                                    onChange={handleInputChange} 
                                                    min="0" 
                                                    step="0.01" 
                                                />
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
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={editingService.description}
                                                    onChange={handleInputChange}
                                                    rows={5}
                                                    style={{
                                                        width: "100%",
                                                        borderColor: '#ccc',
                                                        borderRadius: "5px",
                                                        fontSize: "16px"
                                                    }}
                                                    placeholder="Escribe la descripción aquí..."
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="picture"><strong>Enlace de la Imagen:</strong></label>
                                                <input style={{ fontSize: "16px" }} type="text" name="picture" value={editingService.picture} onChange={handleInputChange} />
                                            </div>
                                            {service.type === "venues" && (
                                                <>
                                                    <div className="form-group">
                                                        <label htmlFor="postalCode"><strong>Código Postal:</strong></label>
                                                        <input 
                                                            type="text" 
                                                            name="postalCode" 
                                                            value={editingService.postalCode} 
                                                            onChange={handleInputChange} 
                                                            pattern="[0-9]{5}" 
                                                            maxLength="5"
                                                            inputMode="numeric"
                                                            placeholder="12345"
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="coordinates"><strong>Coordenadas:</strong></label>
                                                        <input 
                                                            type="text" 
                                                            name="coordinates" 
                                                            value={editingService.coordinates} 
                                                            onChange={handleInputChange} 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="address"><strong>Dirección:</strong></label>
                                                        <input 
                                                            type="text" 
                                                            name="address" 
                                                            value={editingService.address} 
                                                            onChange={handleInputChange} 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="maxGuests"><strong>Capacidad Máxima:</strong></label>
                                                        <input 
                                                            type="number" 
                                                            name="maxGuests" 
                                                            value={editingService.maxGuests} 
                                                            onChange={handleInputChange} 
                                                            min="1" 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="surface"><strong>Superficie:</strong></label>
                                                        <input 
                                                            type="number" 
                                                            name="surface" 
                                                            value={editingService.surface} 
                                                            onChange={handleInputChange} 
                                                            min="1" 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="earliestTime"><strong>Hora de apertura:</strong></label>
                                                        <input 
                                                            type="time" 
                                                            name="earliestTime" 
                                                            value={editingService.earliestTime} 
                                                            onChange={handleInputChange} 
                                                            required 
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="latestTime"><strong>Hora de cierre:</strong></label>
                                                        <input 
                                                            type="time" 
                                                            name="latestTime" 
                                                            value={editingService.latestTime} 
                                                            onChange={handleInputChange} 
                                                            required 
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {service.type === "other-services" && (
                                                <>
                                                    <div className="form-group">
                                                        <label htmlFor="otherServiceType"><strong>Tipo de Servicio:</strong></label>
                                                        <select
                                                            id="otherServiceType"
                                                            name="otherServiceType"
                                                            value={editingService.otherServiceType}
                                                            onChange={handleInputChange}
                                                            required
                                                        >
                                                            <option value="CATERING">Catering</option>
                                                            <option value="ENTERTAINMENT">Entretenimiento</option>
                                                            <option value="DECORATION">Decoración</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="extraInformation"><strong>Información Extra:</strong></label>
                                                        <input
                                                            type="text"
                                                            id="extraInformation"
                                                            name="extraInformation"
                                                            value={editingService.extraInformation}
                                                            onChange={handleInputChange}
                                                            required
                                                            minLength="1"
                                                            maxLength="10000"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <img
                                                src={service.picture}
                                                alt={service.name}
                                                className="service-image"
                                                style={{ cursor: "pointer", paddingBottom: "0.5rem" }}
                                            />
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
                                        <p>
                                            <strong>Limitado por Precio por Invitado:</strong> {service.limitedByPricePerGuest ? "Sí" : "No"}
                                        </p>
                                        <p>
                                            <strong>Limitado por Precio por Hora:</strong> {service.limitedByPricePerHour ? "Sí" : "No"}
                                        </p>
                                        <p><strong>Descripción:</strong> {service.description}</p>
                                        {service.type === "venues" && (
                                            <>
                                                <p><strong>Código Postal:</strong> {service.postalCode}</p>
                                                <p><strong>Coordenadas:</strong> {service.coordinates}</p>
                                                <p><strong>Dirección:</strong> {service.address}</p>
                                                <p><strong>Capacidad Máxima:</strong> {service.maxGuests}</p>
                                                <p><strong>Superficie:</strong> {service.surface} m²</p>
                                                <p><strong>Hora de apertura:</strong> {service.earliestTime}</p>
                                                <p><strong>Hora de cierre:</strong> {service.latestTime}</p>
                                            </>
                                        )}
                                        {service.type === "other-services" && (
                                            <>
                                                <p><strong>Tipo de Servicio:</strong> {service.otherServiceType}</p>
                                                <p><strong>Información Extra:</strong> {service.extraInformation}</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            {!editingService && (
                                <img
                                    src={service.picture}
                                    alt={service.name}
                                    className="service-image"
                                    style={{ cursor: "pointer" }}
                                />
                            )}
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
