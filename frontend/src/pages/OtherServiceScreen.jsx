import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../App.css"; 

// Componente para filtrar y mostrar los OtherServices por categoría
const OtherServiceScreen = () => {
    // Estados para los servicios, tipo de servicio y filtros
    const [otherServices, setOtherServices] = useState([]);
    const [category, setCategory] = useState(null);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [type, setType] = useState(null);
    const [filtersVisible, setFiltersVisible] = useState(false); 

    const getFilteredOtherServices = async () => {
        try {
            console.log("Filter Params - Name:", name, "City:", city, "Type:", type);

            // Construimos los parámetros de la URL
            const params = {
                name,
                city,
                type
            };

            //USAR EL AXIOS PERMITE REDUCIR BASTANTE EL MANJEO DE ERRORES DE LA PETICIÓN QUW QUEREMOS EXTRAER
            const response = await axios.get("http://localhost:8080/api/other-services/filter", { params });

            setOtherServices(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCategoryClick = (category) => {
        if (category !== type) { // con esto se quita el que al clickar en otra categoria, se mantenga el filtro de la anterior
            setCategory(category);
            setType(category); 
        }
    };
    useEffect(() => {
        if (type) {
            getFilteredOtherServices();
        }
    }, [type, name, city]);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    return (
        <div>
            <h1>Categorías de servicios</h1>
            
            <div>
                <button onClick={() => handleCategoryClick('CATERING')}>Catering</button>
                <button onClick={() => handleCategoryClick('ENTERTAINMENT')}>Entretenimiento</button>
                <button onClick={() => handleCategoryClick('DECORATION')}>Decoración</button>
            </div>

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
                        placeholder="Nombre del servicio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ padding: '10px', fontSize: '1em', margin: '10px 0', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <input
                        type="text"
                        placeholder="Ciudad en la que buscas"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ padding: '10px', fontSize: '1em', margin: '10px 0', width: '100%', maxWidth: '300px', borderRadius: '5px', border: '1px solid #ddd' }}
                    />
                    <button 
                        onClick={getFilteredOtherServices}
                        style={{ padding: '10px 15px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Aplicar filtros
                    </button>
                </div>
            )}

            <div>
                <h2>Servicios disponibles en la categoría: {category}</h2>
                <ul>
                    {otherServices.map((service) => (
                        <li key={service.id}>
                            <h3>{service.name}</h3>
                            <p>Ciudad disponible: {service.cityAvailable}</p>
                            <p>Precio: {service.servicePrice} €</p>
                            <p>Información extra: {service.extraInformation}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OtherServiceScreen;
