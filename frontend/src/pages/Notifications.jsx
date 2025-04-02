import React, { useEffect, useState } from 'react';

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const jwt = window.localStorage.getItem("jwt");

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible"; // Manejo de valores nulos o vacíos
    const date = new Date(dateString);
    if (isNaN(date)) return "Fecha inválida"; // Manejo de fechas inválidas
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  useEffect(() => {
    // Realiza el fetch de las notificaciones
    fetch("/api/notifications",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`
        }
      })
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error('Error fetching notifications:', error));
  }, []);

  return (
    <div style={{ marginTop: 70, padding: '20px' }}>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h4>{notification.subject}</h4>
            <p>{notification.message}</p>
            <small style={{ color: '#555' }}>
              {formatDate(notification.createdAt)} {/* Cambiado a createdAt */}
            </small>
          </div>
        ))
      ) : (
        <p>No hay notificaciones disponibles.</p>
      )}
    </div>
  );
}

export default Notifications;