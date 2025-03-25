import { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; 
import apiClient from '../apiClient';
import "../static/resources/css/OtherService.css";
import LeafletMap from "../components/LeafletMap";

const VenuesScreen = () => {
  const [venues, setVenues] = useState([]);
  const [city, setCity] = useState('');
  const [maxGuests, setMaxGuests] = useState('');
  const [surface, setSurface] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Modal para ver detalles del venue al hacer click en la card
  const [selectedVenue, setSelectedVenue] = useState(null);
  // Modal para añadir el venue a un evento
  const [selectedVenueForAdd, setSelectedVenueForAdd] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [events, setEvents] = useState([]);
  // Para almacenar la hora de inicio y fin (solo horas y minutos) de cada venue dentro del evento
  const [venueTimes, setVenueTimes] = useState({});

  // ------------------------------------------------------------------------------
  // Obtiene venues con o sin filtros
  // ------------------------------------------------------------------------------
  const getFilteredVenues = async () => {
    try {
      const params = {};
      if (city) params.city = city;
      if (maxGuests) params.maxGuests = maxGuests;
      if (surface) params.surface = surface;
      const response = await apiClient.get("/api/venues/filter", { params });
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const findAllVenues = async () => {
    try {
      const response = await apiClient.get("/api/venues");
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (city || maxGuests || surface) {
      getFilteredVenues();
    } else {
      findAllVenues();
    }
  }, []);

  // ------------------------------------------------------------------------------
  // Lógica de filtros
  // ------------------------------------------------------------------------------
  const applyFilters = () => {
    getFilteredVenues();
  };

  const clearFilters = () => {
    setCity('');
    setMaxGuests('');
    setSurface('');
    findAllVenues();
  };

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // ------------------------------------------------------------------------------
  // Obtiene los eventos del usuario
  // ------------------------------------------------------------------------------
  const getUserEvents = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(`/api/v1/events/next/${currentUser.id}`, {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error obteniendo eventos:", error);
    }
  };

  // ------------------------------------------------------------------------------
  // Manejo de modales
  // ------------------------------------------------------------------------------
  // Muestra el modal con detalles del venue
  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
  };

  // Al hacer click en "Añadir a mi evento", abre el modal de asignar venue
  const handleAddVenueClick = (e, venue) => {
    e.stopPropagation();
    setSelectedVenueForAdd(venue);
    getUserEvents();
    setAddModalVisible(true);
  };

  // ------------------------------------------------------------------------------
  // Almacena la hora de inicio/fin seleccionada del venue para un evento específico
  // ------------------------------------------------------------------------------
  const handleTimeChange = (eventId, field, value) => {
    setVenueTimes(prevTimes => ({
      ...prevTimes,
      [eventId]: {
        ...prevTimes[eventId],
        [field]: value
      }
    }));
  };

  // ------------------------------------------------------------------------------
  // Combina la fecha del evento (día, mes, año) con la hora (HH:mm) seleccionada
  // para formar un LocalDateTime "yyyy-MM-dd HH:mm:ss"
  // ------------------------------------------------------------------------------
  const combineDateAndTime = (eventDate, time) => {
    const dateObj = new Date(eventDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    // time es un string tipo "HH:mm", se le añade ":00" para segundos
    return `${year}-${month}-${day} ${time}:00`;
  };

  // ------------------------------------------------------------------------------
  // Envía la petición PUT para añadir el venue al evento
  // utilizando las horas de inicio/fin del venue (no cambia la fecha del evento)
  // ------------------------------------------------------------------------------
  const handleConfirmVenue = async (eventObj, venueId) => {
    const times = venueTimes[eventObj.id] || {};
    if (!times.startTime || !times.endTime) {
      alert("Por favor, ingresa la hora de inicio y la hora de fin para este venue.");
      return;
    }
    // Combinar la fecha del evento con la hora que indicó el usuario
    const startDate = combineDateAndTime(eventObj.eventDate, times.startTime);
    const endDate = combineDateAndTime(eventObj.eventDate, times.endTime);

    try {
      await axios.put(
        `/api/event-properties/${eventObj.id}/add-venue/${venueId}`,
        null,
        { params: { startDate, endDate } }
      );
      alert("¡Operación realizada con éxito!");
      setAddModalVisible(false);
    } catch (error) {
      console.error("Error al añadir el venue:", error);
      alert("Este evento ya tiene un servicio asociado.");
    }
  };

  return (
    <div className="other-service-container">
      <h1 className="title">Venues Disponibles</h1>

      <LeafletMap venues={venues} />
      
      <div className="filters-toggle">
        <button onClick={toggleFilters}>
          {filtersVisible ? "Ocultar filtros" : "Mostrar filtros"}
        </button>
      </div>

      {filtersVisible && (
        <div className="filters-container">
          <h2>Filtros disponibles</h2>
          <input
            type="text"
            placeholder="Ciudad"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="number"
            placeholder="Máximo de invitados"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
          />
          <input
            type="number"
            placeholder="Superficie (m²)"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
          />
          <button style={{marginRight:"2%"}} onClick={applyFilters}>Aplicar filtros</button>
          <button onClick={clearFilters}>Borrar filtros</button>
        </div>
      )}

      {/* Lista de venues en formato "card" */}
      <div className="services-grid">
        {venues.map((venue) => (
          <div 
            key={venue.id} 
            className="service-card" 
            onClick={() => handleVenueClick(venue)}
          >
            <h3 className="service-title">{venue.name}</h3>
            <p><strong>Dirección:</strong> {venue.address}</p>
            <p><strong>Capacidad máxima:</strong> {venue.maxGuests} personas</p>
            <p><strong>Superficie:</strong> {venue.surface} m²</p>
            <p><strong>Ciudad:</strong> {venue.cityAvailable}</p>
            <button 
              className="confirm-button" 
              onClick={(e) => handleAddVenueClick(e, venue)}>
              Añadir a mi evento
            </button>
          </div>
        ))}
      </div>

      {/* Modal con detalles del venue (solo lectura) */}
      {selectedVenue && !addModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedVenue.name}</h2>
            <p><strong>Dirección:</strong> {selectedVenue.address}</p>
            <p><strong>Capacidad máxima:</strong> {selectedVenue.maxGuests} personas</p>
            <p><strong>Superficie:</strong> {selectedVenue.surface} m²</p>
            <p><strong>Ciudad:</strong> {selectedVenue.cityAvailable}</p>
            <p><strong>Ubicación:</strong> {selectedVenue.coordinates}</p>
            <p><strong>Código Postal:</strong> {selectedVenue.postalCode}</p>
            <button className="close-button" onClick={() => setSelectedVenue(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Modal para asignar el venue al evento con horas de inicio/fin */}
      {addModalVisible && selectedVenueForAdd && (
        <div className="modal">
          <div className="modal-content">
            <h2>
              Selecciona un evento para añadir: {selectedVenueForAdd.name}
            </h2>
            {events.length === 0 ? (
              <p>No tienes eventos disponibles.</p>
            ) : (
              events.map((eventObj) => (
                <div
                  key={eventObj.id}
                  style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}
                >
                  <p><strong>Tipo de evento:</strong> {eventObj.eventType}</p>
                  <p>
                    <strong>Fecha del evento:</strong>{" "}
                    {new Date(eventObj.eventDate).toLocaleDateString()}
                  </p>
                  <p><strong>Invitados:</strong> {eventObj.guests}</p>

                  {/* Hora de inicio del venue */}
                  <div>
                    <label>Hora de inicio del venue: </label>
                    <input
                      type="time"
                      value={venueTimes[eventObj.id]?.startTime || ""}
                      onChange={(e) => handleTimeChange(eventObj.id, 'startTime', e.target.value)}
                    />
                  </div>

                  {/* Hora de fin del venue */}
                  <div>
                    <label>Hora de fin del venue: </label>
                    <input
                      type="time"
                      value={venueTimes[eventObj.id]?.endTime || ""}
                      onChange={(e) => handleTimeChange(eventObj.id, 'endTime', e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => handleConfirmVenue(eventObj, selectedVenueForAdd.id)}
                  >
                    Confirmar
                  </button>
                  <button
                    className="close-button"
                    onClick={() => setAddModalVisible(false)}
                  >
                    Cerrar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesScreen;
