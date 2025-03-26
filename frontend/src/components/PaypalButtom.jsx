/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "../static/resources/css/Paypal.css";
import apiClient from "../apiClient";
import { useNavigate } from 'react-router-dom';

function PaypalButton({ amount, paymentType, eventProp }) {
  const navigate = useNavigate();

  useEffect(() => {

    async function payPrice() {
      if (paymentType === 'DEPOSITO PARA RESERVA') {
        try {
          const currentUser = JSON.parse(localStorage.getItem("user"))
          const response = await apiClient.post(`/api/payment/${eventProp.id}/pay-deposit/${currentUser.id}`);
          console.log(response.data);

        } catch (error) {
          alert('Error al pagar');
          console.error(error);
        }
      } else {
        //INTRODUCIR LÓGICA DE PAGO RESTANTE
        try {
          const currentUser = JSON.parse(localStorage.getItem("user"))
          const response = await apiClient.post(`/api/payment/${eventProp.id}/pay-remaining/${currentUser.id}`);
          console.log(response.data);
        } catch (error) {
          alert('Error al pagar');
          console.error(error);
        }
      }
    }

    async function cancelEventAfterPayment() {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        await apiClient.put(`/api/event-properties/cancel/${eventProp.id}`, currentUser);
        console.log('Evento cancelado correctamente');
      } catch (error) {
        console.error('Error al cancelar evento:', error);
      }
    }

    // Evitar renderizar el botón más de una vez
    if (!document.getElementById("paypal-button-container").hasChildNodes()) {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: amount },
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then(async (details) => {
                await payPrice();
                await cancelEventAfterPayment();
                navigate('/events')
                alert(`Pago completado por ${details.payer.name.given_name}`);
              });
            },
          })
          .render("#paypal-button-container");
      } else {
        console.error("PayPal SDK no se ha cargado correctamente.");
      }
    }
  }, [amount, paymentType, eventProp]);

  return <div style={{ maxWidth: "100%" }} id="paypal-button-container"></div>;
}

export default PaypalButton;
