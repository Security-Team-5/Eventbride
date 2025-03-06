/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../static/resources/css/Home.css";
import "../static/resources/css/AppNavBar.css";
import { useCurrentUser } from "../hooks/useCurrentUser";

// eslint-disable-next-line react/prop-types
function Home({ user }) {
  const {currentUser, loading} = useCurrentUser({user})
  const [venues, setVenues] = useState([]); // Estado para almacenar los venues

  // Obtener venues desde la API
  function getVenues() {
    fetch("/api/venues", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then(response => response.json())
      .then(data => {
        console.log("Venues obtenidos:", data); // Depuración en consola
        setVenues(data);
      })
      .catch(error => console.error("Error obteniendo venues:", error));
  }

  useEffect(() => {
    getVenues(); // Llamar a la API de venues al cargar el componente
  }, [user]);


  return (
    <div className="home-container">
      <main className="home-main">
        <h2 className="welcome-text">
          Hola usuario: {currentUser?.username || "Desconocido"}
        </h2>

        {/* Mostrar lista de venues */}
        <h3 className="venue-title">Lista de Venues Disponibles:</h3>
        <ul className="venue-list">
          {venues.length > 0 ? (
            venues.map(venue => (
              <li key={venue.id} className="venue-item">
                <strong>Nombre:</strong> {venue.name} <br />
                <strong>Dirección:</strong> {venue.address} <br />
                <strong>Capacidad:</strong> {venue.maxGuests} personas <br />
                <strong>Superficie:</strong> {venue.surface} m² <br />
                <strong>Ubicación:</strong> {venue.coordinates} <br />
                <strong>Código Postal:</strong> {venue.postalCode}
              </li>
            ))
          ) : (
            <p>No hay venues disponibles</p>
          )}
        </ul>
      </main>
    </div>
  );
}

export default Home;
