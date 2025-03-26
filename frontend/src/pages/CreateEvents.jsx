"use client"

import { useState } from "react"
import { Calendar, Users, DollarSign, PartyPopper } from "lucide-react"
import apiClient from "../apiClient"
import { useNavigate } from "react-router-dom"
import "../static/resources/css/CreateEvents.css"

const EVENT_TYPES = {
  WEDDING: "Boda",
  CHRISTENING: "Bautizo",
  COMMUNION: "Comunión",
}

function CreateEvents() {
  const currentUser = JSON.parse(localStorage.getItem("user"))
  const [eventType, setEventType] = useState("")
  const [guests, setGuests] = useState("")
  const [budget, setBudget] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const user = currentUser
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Simple validation
    if (!eventType || !guests || !budget || !eventDate) {
      setError("Por favor completa todos los campos")
      return
    }

    const newEvent = {
      eventType,
      guests,
      budget,
      eventDate,
      user,
    }

    setIsSubmitting(true)

    try {
      const response = await apiClient.post("/api/v1/events", newEvent)
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
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">
              <DollarSign size={18} className="input-icon" />
              Presupuesto estimado (€)
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
              placeholder="Ej: 5000"
              min="1"
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

