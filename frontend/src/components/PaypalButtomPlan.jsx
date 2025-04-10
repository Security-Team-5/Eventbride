/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "../static/resources/css/Paypal.css";
import apiClient from "../apiClient";
import { useAlert } from "../context/AlertContext";

function PaypalButtonPlan({ amount, fechaFin }) {
  const paypalRef = useRef(null);

  const { showAlert } = useAlert();

  useEffect(() => {
    if (!paypalRef.current || !window.paypal) return;

    const renderPayPalButton = async () => {
      try {
        if (paypalRef.current.hasChildNodes()) return;

        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: parseFloat(amount).toFixed(2),
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              // eslint-disable-next-line no-unused-vars
              const details = await actions.order.capture();

              const currentUser = JSON.parse(localStorage.getItem("user"));
              const userId = currentUser?.id;

              if (!userId) {
                showAlert("No se pudo obtener el ID del usuario.");
                return;
              }

              if (!fechaFin) {
                showAlert("No se ha definido la fecha de expiración del plan PREMIUM.");
                return;
              }

              console.log("Enviado al backend:", `"${fechaFin}"`);

              const putResponse = await apiClient.put(`/api/users/premium/${userId}`, `"${fechaFin}"`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              });

              const updatedUser = putResponse.data;

              await apiClient.post(`/api/payment/plan/${userId}`, JSON.stringify(amount), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              });

              localStorage.setItem("user", JSON.stringify(updatedUser));

              window.location.href = "/profile";
            } catch (err) {
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
  }, [amount, fechaFin]);

  return (
      <div style={{ maxWidth: "100%", display: "flex", justifyContent: "center" }}>
        <div ref={paypalRef} />
      </div>
  );
}

export default PaypalButtonPlan;
