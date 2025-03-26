"use client"
 
 import { useState, useEffect } from "react"
 import apiClient from "../apiClient"
 import { Calendar, Users, Clock, XIcon, Info, CalendarClock, Loader, CheckCircle, Hourglass, XCircle} from "lucide-react"
 import "../static/resources/css/SupplierEvents.css"
 
 const SupplierEvents = () => {
   const [eventos, setEventos] = useState([])
   const [loading, setLoading] = useState(true)
   const [eventProperties, setEventProperties] = useState({})
   const [loadingProperties, setLoadingProperties] = useState({})
 
   // Obtener datos user desde localStorage
   const currentUser = JSON.parse(localStorage.getItem("user"))
 
   useEffect(() => {
         // Fetch the events of the provider using the correct endpoint
         const fetchEventos = async () => {
             try {
                 setLoading(true)
                 const response = await apiClient.get(`/api/v1/events/supplier/${currentUser.id}`)
                 console.log("Response:", response.data)
                 setEventos(response.data)
             } catch (error) {
                 console.error("Error fetching events:", error)
                 if (error.response && error.response.status === 404) {
                     setEventos([])
                 }
             } finally {
                 setLoading(false)
             }
         }
         fetchEventos()
     }, [currentUser.id])


     useEffect(() => {
      const fetchEventProperties = async () => {
        if (eventos.length === 0) return
  
        const initialLoadingState = {}
        eventos.forEach((evento) => {
          initialLoadingState[evento.id] = true
        })
        setLoadingProperties(initialLoadingState)
  
        const properties = {}
  
        for (const evento of eventos) {
          try {
            const response = await apiClient.get(`/api/event-properties/byevent/${evento.id}/${currentUser.id}`)
            properties[evento.id] = response.data
          } catch (error) {
            console.error(`Error fetching properties for event ${evento.id}:`, error)
            properties[evento.id] = null
          } finally {
            setLoadingProperties((prev) => ({
              ...prev,
              [evento.id]: false,
            }))
          }
        }
  
        setEventProperties(properties)
      }
  
      fetchEventProperties()
    }, [eventos, currentUser.id])

    const cancelarEvento = async (eventPropertieId) => {
      if (window.confirm("¿Estás seguro de que deseas cancelar este evento? Esta acción no se puede deshacer.")) {
        try {
          // Llamada a la API para cancelar el evento
          await apiClient.put(`/api/event-properties/cancel/${eventPropertieId}`)

          const response = await apiClient.get(`/api/v1/events/supplier/${currentUser.id}`)
          setEventos(response.data)
  
          alert("El evento ha sido cancelado correctamente.")
        } catch (error) {
          console.error("Error al cancelar el evento:", error)
          alert("No se pudo cancelar el evento. Por favor, inténtalo de nuevo.")
        }
      }
    }
 
   // Función para formatear la fecha
   const formatDate = (dateString) => {
     const options = {
       weekday: "long",
       year: "numeric",
       month: "long",
       day: "numeric",
     }
     return new Date(dateString).toLocaleDateString("es-ES", options)
   }
 
   // Función para formatear la hora
   const formatTime = (dateString) => {
     const options = {
       hour: "2-digit",
       minute: "2-digit",
     }
     return new Date(dateString).toLocaleTimeString("es-ES", options)
   }
 
   // Función para determinar si un evento es futuro
   const isFutureEvent = (dateString) => {
     const eventDate = new Date(dateString)
     const today = new Date()
     return eventDate > today
   }

   const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-confirmed"
      case "pending":
        return "status-pending"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const translateStatus = (status) => {
    if (!status) return "No disponible"

    switch (status.toLowerCase()) {
      case "pending":
        return "Pendiente"
      case "approved":
        return "Aceptado"
      case "cancelled":
        return "Cancelado"
      case "deposit_paid":
        return "Depósito pagado"
      case "completed":
        return "Completado"
      default:
        return status
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <CheckCircle size={18} className="info-icon status-confirmed-icon" />
      case "pending":
        return <Hourglass size={18} className="info-icon status-pending-icon" />
      case "cancelled":
        return <XCircle size={18} className="info-icon status-cancelled-icon" />
      default:
        return <Info size={18} className="info-icon" />
    }
  }
 
   // Filtrar solo eventos futuros y ordenarlos por fecha
   const futureEventos = eventos
     .filter((evento) => isFutureEvent(evento.eventDate))
     .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
 
     return (
      <div className="mis-servicios-container">
        <h1 className="mis-servicios-title">Próximos eventos</h1>
    
        {loading ? (
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Cargando eventos...</p>
          </div>
        ) : futureEventos.length === 0 ? (
          <div className="empty-state">
            <Info size={48} className="empty-icon" />
            <h2 className="empty-title">No tienes eventos próximos</h2>
            <p className="empty-text">
              Cuando tus servicios sean contratados para eventos, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="services-list">
            {futureEventos.map((evento) => (
              <div key={evento.id} className="service-item">
                <div className="service-header">
                  <h3 className="service-title">{evento.eventName}</h3>
                  <span className="service-badge">{evento.eventType}</span>
                </div>
    
                <div className="service-body">
                  <div className="service-info">
                    <Calendar size={18} className="info-icon" />
                    <div>
                      <span className="info-label">Fecha:</span>
                      <span className="info-value">{formatDate(evento.eventDate)}</span>
                    </div>
                  </div>
    
                  <div className="service-info">
                    <Clock size={18} className="info-icon" />
                    <div>
                      <span className="info-label">Hora:</span>
                      <span className="info-value">{formatTime(evento.eventDate)}</span>
                    </div>
                  </div>
    
                  <div className="service-info">
                    <Users size={18} className="info-icon" />
                    <div>
                      <span className="info-label">Invitados:</span>
                      <span className="info-value">{evento.guests} personas</span>
                    </div>
                  </div>
    
                  {evento.duration && (
                    <div className="service-info">
                      <CalendarClock size={18} className="info-icon" />
                      <div>
                        <span className="info-label">Duración:</span>
                        <span className="info-value">{evento.duration} horas</span>
                      </div>
                    </div>
                  )}
    
                  {evento.notes && (
                    <div className="service-description">
                      <span className="description-label">Notas:</span>
                      <p className="description-text">{evento.notes}</p>
                    </div>
                  )}
    
                  <div className="service-info">
                    {getStatusIcon(eventProperties[evento.id]?.status)}
                    <div>
                      <span className="info-label">Estado:</span>
                      {loadingProperties[evento.id] ? (
                        <span className="info-value">
                          <Loader size={14} className="loading-icon" /> Cargando...
                        </span>
                      ) : (
                        <span className={`info-value status-badge ${getStatusClass(eventProperties[evento.id]?.status)}`}>
                          {translateStatus(eventProperties[evento.id]?.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
    
                <div className="service-footer">
                <button className="cancel-button" onClick={() => cancelarEvento(eventProperties[evento.id]?.id)}>
                   <XIcon size={16} />
                   Cancelar evento
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
    
 }
 
 export default SupplierEvents