/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "../static/resources/css/Paypal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaypalButtonTotal({ amount, paymentType, eventPropsIds }) {
  const navigate = useNavigate();
  const paypalRef = useRef(null); // Referencia segura al div
  const comision = 1.02; // Comisión del 2%, con cambiar esta constante cambia toda la lógica de la comisión

  useEffect(() => {
    if (!paypalRef.current) return;

    const renderPayPalButton = async () => {
      try {
        if (paypalRef.current.hasChildNodes()) return; 
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: parseFloat(amount * comision).toFixed(2),  
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              alert(`Pago completado por ${details.payer.name.given_name}`);

              const currentUser = JSON.parse(localStorage.getItem("user"));

              const paymentsRequests = eventPropsIds.map((id) =>
                axios.post(
                  `/api/payment/${id}/${paymentType === "DEPOSITO PARA RESERVA"
                    ? "pay-deposit"
                    : "pay-remaining"}/${currentUser.id}`
                )
              );

              await Promise.all(paymentsRequests);

              const cancelRequests = eventPropsIds.map((id) =>
                axios.put(`/api/event-properties/cancel/${id}`, currentUser)
              );
          
              await Promise.all(cancelRequests);

              navigate("/events");
            } catch (err) {
              alert("Error al procesar el pago");
              console.error(err);
            }
          },
        }).render(paypalRef.current);
      } catch (err) {
        console.error("Error al renderizar PayPal:", err);
      }
    };

    renderPayPalButton();

    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = ""; 
      }
    };
  }, [amount, paymentType, eventPropsIds, navigate]);

  return (
    <div style={{ maxWidth: "100%", display: "flex", justifyContent: "center"}}>
      <div ref={paypalRef} />
    </div>
  );
}

export default PaypalButtonTotal;
