/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "../static/resources/css/Paypal.css";
import apiClient from "../apiClient"

function PaypalButtonTotal({ amount, paymentType, eventPropsIds }) {
  const paypalRef = useRef(null); // Referencia segura al div
  const commissionRate = 1.05; // Comisión del 5%, con cambiar esta constante cambia toda la lógica de la comisión

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
              window.location.href = "/events";
              alert(`Pago completado por ${details.payer.name.given_name}`);
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
  }, [amount, paymentType, eventPropsIds]);

  return (
    <div style={{ maxWidth: "100%", display: "flex", justifyContent: "center" }}>
      <div ref={paypalRef} />
    </div>
  );
}

export default PaypalButtonTotal;
