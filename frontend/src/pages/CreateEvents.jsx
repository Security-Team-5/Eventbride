/* eslint-disable no-unused-vars */
import "../static/resources/css/CreateEvents.css";
import "../static/resources/css/Login.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const EVENT_TYPES = {
    WEDDING: "Boda",
    CHRISTENING: "Bautizo",
    COMMUNION: "Comunión",
  };

function CreateEvents() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [eventType, setEventType] = useState('');
    const [guests, setGuests] = useState('');
    const [budget, setBudget] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = currentUser;
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEvent = {
      eventType,
      guests,
      budget,
      eventDate,
      user
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/v1/events', newEvent);
      console.log(response.data);
      navigate("/")
    
    } catch (error) {
      alert('Error al crear el evento');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-event-form">
      <h2>Crear Evento</h2>
      <form onSubmit={handleSubmit}>
      <div>
      <label htmlFor="guests">Tipo de evento: </label>
      <select
            id="eventType"
            value={eventType}
            style={{ marginLeft: "0px",fontSize: "16px", borderRadius: "5px"}}
            onChange={(e) => setEventType(e.target.value)}
            required
          >
            <option value="" disabled className="no-mostrar">Selecciona un tipo de evento</option>
            {Object.entries(EVENT_TYPES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="guests">Número de invitados estimado: </label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
          />
        </div>
        <div>

          <label htmlFor="budget">Presupuesto estimado: </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="eventDate">Fecha del evento: </label>
          <input
            type="date"
            id="eventDate"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando evento...' : 'Crear evento'}
          </button>
        </div>
      </form>
    </div>
  );
}

 export default CreateEvents;