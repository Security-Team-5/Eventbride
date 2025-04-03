/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import '../../static/resources/css/HistorialVentas.css';

const HistorialVentas = ({ userId }) => {
    const [ventas, setVentas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [jwtToken] = useState(localStorage.getItem("jwt"));

    function getPaymentsForProvider() {
        setIsLoading(true);
        setError(null);

        if (!currentUser || !currentUser.id) {
            setError("No se ha encontrado información del usuario");
            setIsLoading(false);
            return;
        }

        fetch(`/api/payment/provider/${currentUser.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener los pagos");
                }
                return response.json();
            })
            .then(async data => {
                const pagosConDetalles = await Promise.all(
                    data.map(async (pago) => {
                        console.log("pago", pago);
                        let serviceName = "Sin nombre";
                        let eventProp = null;

                        try {
                            // 1. Obtener eventPropertiesDTO
                            const epRes = await fetch(`/api/event-properties/provider/${pago.eventPropertiesId}`, {
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${jwtToken}`,
                                }
                            });

                            eventProp = await epRes.json();
                            console.log("eventProp", eventProp);

                            // 2. Obtener nombre del servicio
                            if (eventProp.venueDTO) {
                                serviceName = eventProp.venueDTO.name || "Venue";
                            } else if (eventProp.otherServiceDTO) {
                                serviceName = eventProp.otherServiceDTO.name || "Otro servicio";
                            }

                        } catch (err) {
                            console.warn(`Error obteniendo detalles para pago ID ${pago.id}:`, err);
                        }

                        return {
                            ...pago,
                            eventPropertiesDTO: eventProp,
                            serviceName
                        };
                    })
                );

                setVentas(pagosConDetalles);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error obteniendo pagos:", error);
                setError("No se pudieron cargar los pagos. Por favor, inténtalo de nuevo más tarde.");
                setIsLoading(false);
            });
    }


    useEffect(() => {
        getPaymentsForProvider();
    }, [userId]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando ventas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">!</div>
                <p>{error}</p>
                <button className="retry-button" onClick={getPaymentsForProvider}>
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="ventas-container">
            <h2 className="ventas-title"><span className="resaltado">Mis</span> Ventas</h2>
            <div className="tabla-scroll">
                <table className="ventas-tabla">
                    <thead>
                        <tr>
                            <th>Servicio</th>
                            <th>Cantidad</th>
                            <th>Cantidad final</th>
                            <th>Fecha del pago</th>
                            <th>Tipo de pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta, index) => (
                            <tr key={index}>
                                <td>
                                    {venta.eventPropertiesDTO?.venueDTO
                                        ? venta.eventPropertiesDTO.venueDTO.name
                                        : venta.eventPropertiesDTO?.otherServiceDTO
                                            ? venta.eventPropertiesDTO.otherServiceDTO.name
                                            : 'Sin nombre'}
                                </td>
                                <td>{(venta.amount / 1.05).toFixed(2)}€</td>
                                <td>{((venta.amount / 1.05) * 0.975).toFixed(2)}€</td>
                                <td>{new Date(venta.dateTime).toLocaleDateString()}</td>
                                <td>{venta.paymentType}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p style={{ marginTop: "1.1%" }}>
                    A todos los pagos se le aplicará una comisión del 2.5% tal y como indican los términos y condiciones.
                </p>
            </div>
        </div>
    );
};

export default HistorialVentas;
