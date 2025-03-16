import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; 
import apiClient from '../apiClient';

const VenuesScreen = () => {
    const [venues, setVenues] = useState([]);
    const [city, setCity] = useState('');
    const [maxGuests, setMaxGuests] = useState('');
    const [surface, setSurface] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(false);

    const getFilteredVenues = async () => {
        try {
            console.log("Filter Params - City:", city, "Max Guests:", maxGuests, "Surface:", surface);

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

    return (
        <div>
            <h1>Filtrar Venues</h1>

            <div>
                <button
                    style={{ backgroundColor: '#555', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={toggleFilters} >
                    {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
            </div>

            {filtersVisible && (
                <div style={{ marginTop: '20px', display: filtersVisible ? 'block' : 'none' }} >
                    <h2 style={{ fontSize: '1.8em' }} >Filtros disponibles</h2>
                    <input
                        type="text"
                        placeholder="Ciudad"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ padding: '10px', fontSize: '1em', margin: '10px 0', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="number"
                        placeholder="Máximo de invitados"
                        value={maxGuests}
                        onChange={(e) => setMaxGuests(e.target.value)}
                        style={{ padding: '10px', fontSize: '1em', margin: '10px 0', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="number"
                        placeholder="Superficie (m²)"
                        value={surface}
                        onChange={(e) => setSurface(e.target.value)}
                        style={{ padding: '10px', fontSize: '1em', margin: '10px 0', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <button
                        onClick={applyFilters}
                        style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Aplicar filtros
                    </button>
                    <button
                        onClick={clearFilters}
                        style={{ padding: '10px 15px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
                        Borrar filtros
                    </button>
                </div>
            )}

            <div>
                <h2>Venues disponibles</h2>
                <ul>
                    {venues.map((venue) => (
                        <li key={venue.id}>
                            <h3>{venue.name}</h3>
                            <p>Dirección: {venue.address}</p>
                            <p>Capacidad máxima: {venue.maxGuests} personas</p>
                            <p>Superficie: {venue.surface} m²</p>
                            <p>Ciudad: {venue.cityAvailable}</p>
                            <p>Ubicación: {venue.coordinates}</p>
                            <p>Código Postal: {venue.postalCode}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default VenuesScreen;