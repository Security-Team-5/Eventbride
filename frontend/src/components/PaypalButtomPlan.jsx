/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import "../static/resources/css/Paypal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaypalButtonPlan({ amount, fechaFin }) {
  const navigate = useNavigate();
  const paypalRef = useRef(null);

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
              const details = await actions.order.capture();

              const currentUser = JSON.parse(localStorage.getItem("user"));
              const userId = currentUser?.id;

              if (!userId) {
                alert("No se pudo obtener el ID del usuario.");
                return;
              }

              if (!fechaFin) {
                alert("No se ha definido la fecha de expiración del plan PREMIUM.");
                return;
              }

              console.log("Enviado al backend:", `"${fechaFin}"`);

              const putResponse = await axios.put(`/api/users/premium/${userId}`, `"${fechaFin}"`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              });

              const updatedUser = putResponse.data; 

              await axios.post(`/api/payment/plan/${userId}`, JSON.stringify(amount), {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
              });

              localStorage.setItem("user", JSON.stringify(updatedUser));

              navigate("/profile");
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
  }, [amount, navigate, fechaFin]);

  return (
    <div style={{ maxWidth: "100%", display: "flex", justifyContent: "center" }}>
      <div ref={paypalRef} />
    </div>
  );
}

export default PaypalButtonPlan;
