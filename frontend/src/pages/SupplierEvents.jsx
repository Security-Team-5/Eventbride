"use client"
 
 import { useState, useEffect } from "react"
 import apiClient from "../apiClient"
 import { useNavigate } from "react-router-dom"
 import { Calendar, Users, Clock, Eye, Info, CalendarClock } from "lucide-react"
 import "../static/resources/css/SupplierEvents.css"
 
 const SupplierEvents = () => {
   const [eventos, setEventos] = useState([])
   const [loading, setLoading] = useState(true)
   const navigate = useNavigate()
 
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
           <p className="empty-text">Cuando tus servicios sean contratados para eventos, aparecerán aquí.</p>
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
               </div>
 
               <div className="service-footer">
                 <button className="view-button" onClick={() => navigate(`/eventos/${evento.id}`)}>
                   <Eye size={16} />
                   Ver detalles
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