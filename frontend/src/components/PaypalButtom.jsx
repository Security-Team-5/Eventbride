/* eslint-disable react/prop-types */
import { useEffect } from "react";
import "../static/resources/css/Paypal.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PaypalButton({ amount, paymentType, eventProp }) {
  const navigate = useNavigate();

  useEffect(() => {

    async function payPrice() {
      if (paymentType === 'DEPOSITO PARA RESERVA') {
        try {
          const currentUser = JSON.parse(localStorage.getItem("user"))
          const response = await axios.post(`/api/payment/${eventProp.id}/pay-deposit/${currentUser.id}`);
          console.log(response.data);
          navigate("/events")

        } catch (error) {
          alert('Error al crear el evento');
          console.error(error);
        }
      } else {
        //INTRODUCIR LÓGICA DE PAGO RESTANTE
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
              return actions.order.capture().then((details) => {
                payPrice()
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
