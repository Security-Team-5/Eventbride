"use client"

import { useState } from "react"
import { Calendar, Users, PartyPopper } from "lucide-react"
import apiClient from "../../apiClient"

import { useNavigate } from "react-router-dom"
import "../../static/resources/css/CreateEvents.css"

const EVENT_TYPES = {
  WEDDING: "Boda",
  CHRISTENING: "Bautizo",
  COMMUNION: "Comunión",
}

function CreateEvents() {
  const currentUser = JSON.parse(localStorage.getItem("user"))
  const [jwtToken] = useState(localStorage.getItem("jwt"));
  const [eventType, setEventType] = useState("")
  const [guests, setGuests] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const user = currentUser
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!eventType || !guests || !eventDate) {
      setError("Por favor completa todos los campos")
      return
    }

    // Additional validation for guests
    const minGuests = 1
    const maxGuests = 9999
    if (guests < minGuests || guests > maxGuests) {
      setError(`El número de invitados debe estar entre ${minGuests} y ${maxGuests}`)
      return
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const selectedDate = new Date(eventDate);
    
    // Calcula la diferencia en días
    const minDaysDifference = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));
    
    console.log("Diferencia en días:", minDaysDifference);
      if (eventType === "CHRISTENING" && minDaysDifference > 30) {
        setError("Para un bautizo, la fecha debe ser como máximo 30 días después de hoy");
        return;
      } else if (eventType === "COMMUNION" && minDaysDifference > 90) {
        setError("Para una comunión, la fecha debe ser como máximo 90 días después de hoy");
        return;
      } else if (eventType === "WEDDING" && minDaysDifference > 120) {
        setError("Para una boda, la fecha debe ser al como máximo 120 días después de hoy");
        return;
      }
    // }


    const newEvent = {
      eventType,
      guests,
      eventDate,
      user,
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/v1/events/create`, {
        method: "POST", // Usamos POST para crear un nuevo evento
        headers: {
          "Authorization": `Bearer ${jwtToken}`,
          "Content-Type": "application/json", // Asegúrate de que el contenido es JSON
        },
        body: JSON.stringify(newEvent), // Se envían los datos en el cuerpo de la solicitud
      });

      console.log(response.data)
      navigate("/events")
    } catch (error) {
      setError("Error al crear el evento")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="event-container">
      <div className="event-card">
        <div className="event-header">
          <PartyPopper className="event-icon" />
          <h2>Crear Evento</h2>
          <p className="event-subtitle">Completa el formulario para crear tu nuevo evento</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="eventType">
              <PartyPopper size={18} className="input-icon" />
              Tipo de evento
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              required
              className="form-select"
            >
              <option value="" disabled>
                Selecciona un tipo de evento
              </option>
              {Object.entries(EVENT_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="guests">
              <Users size={18} className="input-icon" />
              Número de invitados estimado
            </label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              required
              placeholder="Ej: 100"
              min="1"
              max="9999"
              className="form-input"
            />
          </div>


          <div className="form-group">
            <label htmlFor="eventDate">
              <Calendar size={18} className="input-icon" />
              Fecha del evento
            </label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
              className="form-input"
              min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0]} 
              max={new Date(new Date().setDate(new Date().getDate() + 120)).toISOString().split("T")[0]}
            />
          </div>

          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Creando evento..." : "Crear evento"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateEvents

