/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "../static/resources/css/Paypal.css";
import apiClient from "../apiClient";

function PaypalButtonTotal({ amount, paymentType, eventPropsIds }) {
  const paypalRef = useRef(null);
  const commissionRate = 1.05;

  useEffect(() => {
    if (!paypalRef.current) return;

    const renderPayPalButton = async () => {
      try {
        // Evitar múltiples renders o errores si el DOM ya no contiene el contenedor
        if (paypalRef.current.hasChildNodes()) return;
        if (!document.body.contains(paypalRef.current)) return;

        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: parseFloat(amount * commissionRate).toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              const details = await actions.order.capture();
              const currentUser = JSON.parse(localStorage.getItem("user"));

              const paymentsRequests = eventPropsIds.map((id) =>
                apiClient.post(
                  `/api/payment/${id}/${paymentType === "DEPOSITO PARA RESERVA"
                    ? "pay-deposit"
                    : "pay-remaining"}/${currentUser.id}`
                )
              );

              await Promise.all(paymentsRequests);

              const cancelRequests = eventPropsIds.map((id) =>
                apiClient.put(`/api/event-properties/cancel/${id}`, currentUser)
              );

              await Promise.all(cancelRequests);
              alert(`Pago completado por ${details.payer.name.given_name}`);
              window.location.href = "/events";
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
      // Limpieza segura del contenedor
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
    };
  }, [amount, paymentType, JSON.stringify(eventPropsIds)]);

  return (
    <div style={{ maxWidth: "100%", display: "flex", justifyContent: "center" }}>
      <div ref={paypalRef} />
    </div>
  );
}

export default PaypalButtonTotal;
