import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import "../../static/resources/css/AdminUsers.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [editServiceId, setEditServiceId] = useState(null);
  const [serviceData, setServiceData] = useState({});
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const jwtToken = localStorage.getItem("jwt");

  useEffect(() => {
    getServices();
  }, []);

  function getServices() {
    fetch("/api/services/admin", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const otherServices = Array.isArray(data[0].otherServices)
          ? data[0].otherServices.map((s) => ({ ...s, type: "other-services" }))
          : [];
        const venues = Array.isArray(data[0].venues)
          ? data[0].venues.map((v) => ({ ...v, type: "venues" }))
          : [];
        const allServices = [...otherServices, ...venues];
        setServices(allServices);
      })
      .catch((err) => console.error("Error obteniendo servicios:", err));
  }

  function startEditing(service) {
    setEditServiceId(service.id);
    setServiceData((prev) => ({ ...prev, [service.id]: { ...service } }));
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [editServiceId]: {
        ...prev[editServiceId],
        [name]: value,
      },
    }));
  }

  function validateServiceData(service) {
    setError("");
    const data = serviceData[service.id];
    if (!data.name || !data.cityAvailable || !data.description) {
      setError("Por favor, complete todos los campos obligatorios.");
      return false;
    }
    if (data.name.length > 100) {
      setError("El nombre del servicio no puede tener más de 100 caracteres.");
      return false;
    }
    return true;
  }

  function updateService(service) {
    if (!validateServiceData(service)) return;

    const updated = serviceData[service.id];

    fetch(`/api/${service.type}/admin/${service.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(updated),
    })
      .then((res) => res.json())
      .then((updatedService) => {
        setServices((prev) =>
          prev.map((s) => (s.id === updatedService.id ? updatedService : s))
        );
        setEditServiceId(null);
        setError("");
      })
      .catch((err) => {
        console.error("Error actualizando servicio:", err);
        setError("Error actualizando servicio");
      });
  }

  function searchServiceById() {
    if (!searchId.trim()) {
      setFilteredServices([]);
      return;
    }
    const found = services.find((s) => String(s.id) === searchId.trim());
    if (found) {
      setFilteredServices([found]);
      setError("");
    } else {
      setFilteredServices([]);
      setError("No se encontró ningún servicio con ese ID.");
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "6%", marginBottom: "20px", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "40%", width: "100%" }}>
          <input
            type="text"
            placeholder="Buscar por ID de servicio..."
            value={searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              if (!e.target.value.trim()) {
                setFilteredServices([]);
                setError("");
              }
            }}
            style={{ padding: "10px", maxWidth: "40%", borderRadius: "8px", border: "1px solid #ccc" }}
          />
          <button
            onClick={searchServiceById}
            style={{ padding: "10px 16px", borderRadius: "8px", backgroundColor: "#007BFF", color: "white", maxWidth: "20%", border: "none" }}
          >
            Buscar
          </button>
          <button
            onClick={() => {
              setSearchId("");
              setFilteredServices([]);
              setError("");
            }}
            style={{ padding: "10px 16px", borderRadius: "8px", maxWidth: "20%", backgroundColor: "#ccc", border: "none" }}
          >
            Limpiar
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {currentUser?.role === "ADMIN" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {(filteredServices.length > 0 ? filteredServices : services).map((service, index) => (
            <div key={index} className="service-container">
              <h2 className="service-title">Servicio ID: {service.id}</h2>
              <h2 className="service-title">{service.name}</h2>
              <div className="service-info">
                <form style={{ width: "100%" }} onSubmit={(e) => e.preventDefault()}>
                  <div className="form-group">
                    <label>Ciudad Disponible:</label>
                    <input
                      name="cityAvailable"
                      value={serviceData[service.id]?.cityAvailable || service.cityAvailable}
                      onChange={handleInputChange}
                      readOnly={editServiceId !== service.id}
                    />
                  </div>
                  <div className="form-group">
                    <label>Descripción:</label>
                    <textarea
                      name="description"
                      value={serviceData[service.id]?.description || service.description}
                      onChange={handleInputChange}
                      readOnly={editServiceId !== service.id}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        width: "100%",
                        minHeight: "120px",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        fontSize: "16px",
                        padding: "10px",
                        fontFamily: "inherit"
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio Fijo:</label>
                    <input
                      type="number"
                      name="fixedPrice"
                      value={serviceData[service.id]?.fixedPrice || service.fixedPrice}
                      onChange={handleInputChange}
                      readOnly={editServiceId !== service.id}
                    />
                  </div>
                  <div className="button-container">
                    {editServiceId === service.id ? (
                      <button className="save-btn" style={{ backgroundColor: "#4CAF50" }} onClick={() => updateService(service)}>Guardar</button>
                    ) : (
                      <button className="edit-btn" onClick={() => startEditing(service)}>Editar</button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tienes permisos para ver esta sección.</p>
      )}
    </>
  );
}

export default AdminServices;