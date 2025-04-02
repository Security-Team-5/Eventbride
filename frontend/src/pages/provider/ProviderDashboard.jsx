"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronRight, ChevronLeft, Filter, Check, X, Clock, MapPin, User, Phone, Mail, MessageSquare, FileText, MoreHorizontal, Search, ArrowUpDown, CalendarDays, ListFilter, Grid, List } from 'lucide-react'
import logo from "../../static/resources/images/logo-eventbride.png"
import "../../static/resources/css/ProviderDashboard.css"
import axios from "axios"

export default function SupplierDashboard() {
    const [currentView, setCurrentView] = useState("list") // "list" or "calendar"
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [filterStatus, setFilterStatus] = useState("all") // "all", "pending", "accepted", "rejected"
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [sortBy, setSortBy] = useState("date") // "date", "client", "service"
    const [sortOrder, setSortOrder] = useState("asc") // "asc" or "desc"
    const [requests, setRequests] = useState("")
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const [jwtToken] = useState(localStorage.getItem("jwt"));

    // Mock data for service requests
    const [serviceRequests, setServiceRequests] = useState([
        {
            id: 1,
            clientName: "María García",
            clientEmail: "maria.garcia@example.com",
            clientPhone: "+34 612 345 678",
            serviceName: "Catering Premium",
            eventType: "Boda",
            date: new Date(2025, 3, 15), // April 15, 2025
            time: "18:00",
            location: "Finca El Olivar, Madrid",
            guests: 120,
            status: "pending",
            message: "Necesitamos un menú que incluya opciones vegetarianas y veganas. También nos gustaría incluir una mesa de postres variados.",
            createdAt: new Date(2025, 2, 10)
        },
        {
            id: 2,
            clientName: "Carlos Rodríguez",
            clientEmail: "carlos.rodriguez@example.com",
            clientPhone: "+34 623 456 789",
            serviceName: "Fotografía Completa",
            eventType: "Bautizo",
            date: new Date(2025, 3, 22), // April 22, 2025
            time: "12:00",
            location: "Iglesia San Miguel, Barcelona",
            guests: 50,
            status: "accepted",
            message: "Queremos un reportaje completo que incluya la ceremonia y la celebración posterior. Nos interesan especialmente las fotos familiares.",
            createdAt: new Date(2025, 2, 15)
        },
        {
            id: 3,
            clientName: "Laura Martínez",
            clientEmail: "laura.martinez@example.com",
            clientPhone: "+34 634 567 890",
            serviceName: "Decoración Floral",
            eventType: "Comunión",
            date: new Date(2025, 4, 8), // May 8, 2025
            time: "11:30",
            location: "Salón Celebraciones Royale, Valencia",
            guests: 80,
            status: "rejected",
            message: "Buscamos una decoración en tonos pastel con flores de temporada. Necesitamos centros de mesa, decoración para la mesa principal y un arco floral.",
            createdAt: new Date(2025, 3, 1)
        },
        {
            id: 4,
            clientName: "Javier López",
            clientEmail: "javier.lopez@example.com",
            clientPhone: "+34 645 678 901",
            serviceName: "DJ y Sonido",
            eventType: "Boda",
            date: new Date(2025, 4, 29), // May 29, 2025
            time: "20:00",
            location: "Hotel Miramar, Málaga",
            guests: 150,
            status: "pending",
            message: "Necesitamos un DJ para la recepción y la fiesta. Tenemos una lista de canciones específicas que nos gustaría incluir. También necesitamos micrófono para los discursos.",
            createdAt: new Date(2025, 3, 20)
        },
        {
            id: 5,
            clientName: "Ana Sánchez",
            clientEmail: "ana.sanchez@example.com",
            clientPhone: "+34 656 789 012",
            serviceName: "Catering Premium",
            eventType: "Comunión",
            date: new Date(2025, 5, 5), // June 5, 2025
            time: "13:00",
            location: "Jardines La Rosaleda, Sevilla",
            guests: 70,
            status: "accepted",
            message: "Buscamos un menú infantil para 20 niños y menú de adultos para el resto. Nos gustaría incluir una fuente de chocolate con frutas.",
            createdAt: new Date(2025, 4, 10)
        },
        {
            id: 6,
            clientName: "Pedro Gómez",
            clientEmail: "pedro.gomez@example.com",
            clientPhone: "+34 667 890 123",
            serviceName: "Fotografía Completa",
            eventType: "Bautizo",
            date: new Date(2025, 5, 12), // June 12, 2025
            time: "11:00",
            location: "Parroquia Santa Teresa, Zaragoza",
            guests: 40,
            status: "pending",
            message: "Queremos fotos de la ceremonia y un pequeño reportaje familiar antes del evento. También nos gustaría algunas fotos del bebé en un entorno natural.",
            createdAt: new Date(2025, 4, 25)
        }
    ])

    async function getRequests() {
        try {
            const response = await axios.get(`/api/event-properties/requests/${currentUser.id}`, { headers: { Authorization: `Bearer ${jwtToken}` } })
            setRequests(response.data)
        } catch (error) {
            console.error("Error fetching data:", error)
        }
    }

    useEffect(() => {
        setIsLoading(false)
        getRequests()
    }, [])

    // Filter requests based on status and search query
    const filteredRequests = serviceRequests.filter(request => {
        const matchesStatus = filterStatus === "all" || request.status === filterStatus
        const matchesSearch =
            request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.eventType.toLowerCase().includes(searchQuery.toLowerCase())

        return matchesStatus && matchesSearch
    })

    // Sort requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        let comparison = 0

        if (sortBy === "date") {
            comparison = a.date.getTime() - b.date.getTime()
        } else if (sortBy === "client") {
            comparison = a.clientName.localeCompare(b.clientName)
        } else if (sortBy === "service") {
            comparison = a.serviceName.localeCompare(b.serviceName)
        }

        return sortOrder === "asc" ? comparison : -comparison
    })

    // Group requests by date for calendar view
    const requestsByDate = sortedRequests.reduce((acc, request) => {
        const dateStr = request.date.toDateString()
        if (!acc[dateStr]) {
            acc[dateStr] = []
        }
        acc[dateStr].push(request)
        return acc
    }, {})

    // Handle status change
    const handleStatusChange = (requestId, newStatus) => {
        setServiceRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        )
        // Close detail panel if the current selected request status was changed
        if (selectedRequest && selectedRequest.id === requestId) {
            setSelectedRequest({ ...selectedRequest, status: newStatus })
        }
    }

    // Toggle sort order
    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        } else {
            setSortBy(field)
            setSortOrder("asc")
        }
    }

    // Generate calendar days
    const generateCalendarDays = () => {
        const year = selectedDate.getFullYear()
        const month = selectedDate.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i))
        }

        return days
    }

    // Get day of week names
    const getDayNames = () => {
        return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    }

    // Get month name
    const getMonthName = (date) => {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
        return `${months[date.getMonth()]} ${date.getFullYear()}`
    }

    // Navigate to previous month
    const goToPreviousMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))
    }

    // Navigate to next month
    const goToNextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))
    }

    // Check if a date has requests
    const hasRequests = (date) => {
        if (!date) return false
        return !!requestsByDate[date.toDateString()]
    }

    // Get requests for a specific date
    const getRequestsForDate = (date) => {
        if (!date) return []
        return requestsByDate[date.toDateString()] || []
    }

    // Format date
    const formatDate = (date) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' }
        return date.toLocaleDateString('es-ES', options)
    }

    // Status badge component
    const StatusBadge = ({ status }) => {
        let bgColor = ""
        let textColor = ""
        let statusText = ""

        switch (status) {
            case "pending":
                bgColor = "bg-amber-100"
                textColor = "text-amber-800"
                statusText = "Pendiente"
                break
            case "accepted":
                bgColor = "bg-green-100"
                textColor = "text-green-800"
                statusText = "Aceptada"
                break
            case "rejected":
                bgColor = "bg-red-100"
                textColor = "text-red-800"
                statusText = "Rechazada"
                break
            default:
                bgColor = "bg-gray-100"
                textColor = "text-gray-800"
                statusText = "Desconocido"
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {statusText}
            </span>
        )
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
            </div>
        )
    }

    return (
        <div className="supplier-dashboard">
            {/* Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-container">
                            <img src={logo || "/placeholder.svg"} alt="Eventbride Logo" className="dashboard-logo" />
                        </div>
                        <h1 className="header-title">Panel de Proveedor</h1>
                        <div className="user-menu">
                            <span className="user-name">Mi Empresa</span>
                            <div className="user-avatar">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="container">
                    <div className="dashboard-content">
                        {/* Page Title and Actions */}
                        <div className="page-header">
                            <div className="page-title">
                                <h2>Solicitudes de Servicios</h2>
                                <p className="page-description">Gestiona las solicitudes de tus servicios y visualiza tu calendario de eventos</p>
                            </div>
                            <div className="view-toggle">
                                <button
                                    className={`view-button ${currentView === "list" ? "active" : ""}`}
                                    onClick={() => setCurrentView("list")}
                                >
                                    <List size={18} />
                                    <span>Lista</span>
                                </button>
                                <button
                                    className={`view-button ${currentView === "calendar" ? "active" : ""}`}
                                    onClick={() => setCurrentView("calendar")}
                                >
                                    <CalendarDays size={18} />
                                    <span>Calendario</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="stats-summary">
                            <div className="stat-card">
                                <div className="stat-icon pending">
                                    <Clock size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-value">{serviceRequests.filter(r => r.status === "pending").length}</h3>
                                    <p className="stat-label">Pendientes</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon accepted">
                                    <Check size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-value">{serviceRequests.filter(r => r.status === "accepted").length}</h3>
                                    <p className="stat-label">Aceptadas</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon rejected">
                                    <X size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-value">{serviceRequests.filter(r => r.status === "rejected").length}</h3>
                                    <p className="stat-label">Rechazadas</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon total">
                                    <FileText size={24} />
                                </div>
                                <div className="stat-content">
                                    <h3 className="stat-value">{serviceRequests.length}</h3>
                                    <p className="stat-label">Total</p>
                                </div>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <div className="filters-container">
                            <div className="search-box">
                                <Search size={18} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Buscar por cliente, servicio o tipo de evento..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="filter-buttons">
                                <button
                                    className={`filter-button ${filterStatus === "all" ? "active" : ""}`}
                                    onClick={() => setFilterStatus("all")}
                                >
                                    Todas
                                </button>
                                <button
                                    className={`filter-button ${filterStatus === "pending" ? "active" : ""}`}
                                    onClick={() => setFilterStatus("pending")}
                                >
                                    Pendientes
                                </button>
                                <button
                                    className={`filter-button ${filterStatus === "accepted" ? "active" : ""}`}
                                    onClick={() => setFilterStatus("accepted")}
                                >
                                    Aceptadas
                                </button>
                                <button
                                    className={`filter-button ${filterStatus === "rejected" ? "active" : ""}`}
                                    onClick={() => setFilterStatus("rejected")}
                                >
                                    Rechazadas
                                </button>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="content-area">
                            {/* List View */}
                            {currentView === "list" && (
                                <div className="requests-list-container">
                                    <div className="requests-list-header">
                                        <div className="list-header-item" onClick={() => toggleSort("date")}>
                                            <span>Fecha</span>
                                            <ArrowUpDown size={14} className="sort-icon" />
                                        </div>
                                        <div className="list-header-item" onClick={() => toggleSort("client")}>
                                            <span>Cliente</span>
                                            <ArrowUpDown size={14} className="sort-icon" />
                                        </div>
                                        <div className="list-header-item" onClick={() => toggleSort("service")}>
                                            <span>Servicio</span>
                                            <ArrowUpDown size={14} className="sort-icon" />
                                        </div>
                                        <div className="list-header-item">
                                            <span>Evento</span>
                                        </div>
                                        <div className="list-header-item">
                                            <span>Estado</span>
                                        </div>
                                        <div className="list-header-item">
                                            <span>Acciones</span>
                                        </div>
                                    </div>

                                    {sortedRequests.length > 0 ? (
                                        <div className="requests-list">
                                            {sortedRequests.map(request => (
                                                <div
                                                    key={request.id}
                                                    className={`request-item ${selectedRequest && selectedRequest.id === request.id ? 'selected' : ''}`}
                                                    onClick={() => setSelectedRequest(request)}
                                                >
                                                    <div className="request-date">
                                                        <div className="date-badge">
                                                            <span className="date-day">{request.date.getDate()}</span>
                                                            <span className="date-month">{request.date.toLocaleString('es-ES', { month: 'short' })}</span>
                                                        </div>
                                                        <span className="date-time">{request.time}</span>
                                                    </div>
                                                    <div className="request-client">
                                                        <span className="client-name">{request.clientName}</span>
                                                        <span className="client-email">{request.clientEmail}</span>
                                                    </div>
                                                    <div className="request-service">
                                                        <span className="service-name">{request.serviceName}</span>
                                                        <span className="service-guests">{request.guests} invitados</span>
                                                    </div>
                                                    <div className="request-event-type">
                                                        <span className="event-type-badge">{request.eventType}</span>
                                                    </div>
                                                    <div className="request-status">
                                                        <StatusBadge status={request.status} />
                                                    </div>
                                                    <div className="request-actions">
                                                        <button
                                                            className="action-button view"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setSelectedRequest(request)
                                                            }}
                                                        >
                                                            Ver detalles
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <div className="empty-icon">
                                                <Calendar size={48} />
                                            </div>
                                            <h3 className="empty-title">No hay solicitudes</h3>
                                            <p className="empty-description">No se encontraron solicitudes con los filtros actuales.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Calendar View */}
                            {currentView === "calendar" && (
                                <div className="calendar-container">
                                    <div className="calendar-header">
                                        <button className="calendar-nav-button" onClick={goToPreviousMonth}>
                                            <ChevronLeft size={20} />
                                        </button>
                                        <h3 className="calendar-title">{getMonthName(selectedDate)}</h3>
                                        <button className="calendar-nav-button" onClick={goToNextMonth}>
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>

                                    <div className="calendar-grid">
                                        {/* Day names */}
                                        {getDayNames().map((day, index) => (
                                            <div key={index} className="calendar-day-name">{day}</div>
                                        ))}

                                        {/* Calendar days */}
                                        {generateCalendarDays().map((day, index) => (
                                            <div
                                                key={index}
                                                className={`calendar-day ${!day ? 'empty' : ''} ${hasRequests(day) ? 'has-events' : ''}`}
                                            >
                                                {day && (
                                                    <>
                                                        <span className="day-number">{day.getDate()}</span>
                                                        {hasRequests(day) && (
                                                            <div className="day-events">
                                                                {getRequestsForDate(day).map(request => (
                                                                    <div
                                                                        key={request.id}
                                                                        className={`day-event ${request.status}`}
                                                                        onClick={() => setSelectedRequest(request)}
                                                                    >
                                                                        <span className="event-time">{request.time}</span>
                                                                        <span className="event-title">{request.serviceName}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Request Details Panel */}
                            {selectedRequest && (
                                <div className="request-details-panel">
                                    <div className="panel-header">
                                        <h3 className="panel-title">Detalles de la Solicitud</h3>
                                        <button
                                            className="close-button"
                                            onClick={() => setSelectedRequest(null)}
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    <div className="panel-content">
                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Información del Evento</h4>
                                            <div className="detail-row">
                                                <span className="detail-label">Servicio:</span>
                                                <span className="detail-value">{selectedRequest.serviceName}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Tipo de Evento:</span>
                                                <span className="detail-value">{selectedRequest.eventType}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Fecha:</span>
                                                <span className="detail-value">{formatDate(selectedRequest.date)}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Hora:</span>
                                                <span className="detail-value">{selectedRequest.time}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Ubicación:</span>
                                                <span className="detail-value">{selectedRequest.location}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Invitados:</span>
                                                <span className="detail-value">{selectedRequest.guests}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Información del Cliente</h4>
                                            <div className="detail-row">
                                                <span className="detail-label">Nombre:</span>
                                                <span className="detail-value">{selectedRequest.clientName}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Email:</span>
                                                <span className="detail-value">{selectedRequest.clientEmail}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Teléfono:</span>
                                                <span className="detail-value">{selectedRequest.clientPhone}</span>
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Mensaje del Cliente</h4>
                                            <div className="client-message">
                                                {selectedRequest.message}
                                            </div>
                                        </div>

                                        <div className="detail-section">
                                            <h4 className="detail-section-title">Estado de la Solicitud</h4>
                                            <div className="status-container">
                                                <StatusBadge status={selectedRequest.status} />
                                                <span className="status-date">Creada el {selectedRequest.createdAt.toLocaleDateString('es-ES')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="panel-actions">
                                        {selectedRequest.status === "pending" && (
                                            <>
                                                <button
                                                    className="action-button accept"
                                                    onClick={() => handleStatusChange(selectedRequest.id, "accepted")}
                                                >
                                                    <Check size={16} />
                                                    Aceptar Solicitud
                                                </button>
                                                <button
                                                    className="action-button reject"
                                                    onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                                                >
                                                    <X size={16} />
                                                    Rechazar Solicitud
                                                </button>
                                            </>
                                        )}
                                        {selectedRequest.status === "accepted" && (
                                            <button
                                                className="action-button contact"
                                            >
                                                <MessageSquare size={16} />
                                                Contactar Cliente
                                            </button>
                                        )}
                                        {selectedRequest.status === "rejected" && (
                                            <button
                                                className="action-button reconsider"
                                                onClick={() => handleStatusChange(selectedRequest.id, "pending")}
                                            >
                                                <Clock size={16} />
                                                Reconsiderar Solicitud
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
