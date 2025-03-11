import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../static/resources/css/OtherService.css';

const OtherServiceScreen = () => {
    const [otherServices, setOtherServices] = useState([]);
    const [category, setCategory] = useState(null);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [type, setType] = useState(null);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const navigate = useNavigate();

    const getFilteredOtherServices = async () => {
        try {
            console.log("Filter Params - Name:", name, "City:", city, "Type:", type);
            const params = { name, city, type };
            const response = await axios.get("http://localhost:8080/api/other-services/filter", { params });
            setOtherServices(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCategoryClick = (category) => {
        if (category !== type) {
            setCategory(category);
            setType(category);
        }
    };

    const handleServiceClick = (serviceId) => {
        navigate(`/other-services/information/${serviceId}`);
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
        <div className="other-service-container">
            <h1 className="title">Categorías de servicios</h1>
            <div className="category-buttons">
                <button onClick={() => handleCategoryClick('CATERING')}>Catering</button>
                <button onClick={() => handleCategoryClick('ENTERTAINMENT')}>Entretenimiento</button>
                <button onClick={() => handleCategoryClick('DECORATION')}>Decoración</button>
            </div>

            <div className="filters-toggle">
                <button onClick={toggleFilters}>
                    {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>
            </div>

            {filtersVisible && (
                <div className="filters-container">
                    <h2>Filtros disponibles</h2>
                    <input
                        type="text"
                        placeholder="Nombre del servicio"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Ciudad en la que buscas"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button onClick={getFilteredOtherServices}>Aplicar filtros</button>
                </div>
            )}

            <h2 className="category-title">Servicios disponibles en la categoría: {category}</h2>
            <div className="services-grid">
                {otherServices.map((service) => (
                    <div key={service.id} className="service-card" onClick={() => handleServiceClick(service.id)}>
                        <h3 className="service-title">{service.name}</h3>
                        <p><strong>Ciudad:</strong> {service.cityAvailable}</p>
                        <p><strong>Precio:</strong> {service.limitedByPricePerGuest ? `${service.servicePricePerGuest} € por invitado` : 
                            service.limitedByPricePerHour ? `${service.servicePricePerHour} € por hora` : 
                            `${service.fixedPrice} €`}</p>
                        <p><strong>Información extra:</strong> {service.extraInformation}</p>
                        <button className="confirm-button" onClick={(e) => { e.stopPropagation(); alert('Servicio confirmado'); }}>
                            Confirmar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OtherServiceScreen;
