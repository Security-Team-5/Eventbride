import { useEffect } from "react";
import "../static/resources/css/Paypal.css";

function PaypalButton() {
  useEffect(() => {
    // Evitar renderizar el botón más de una vez
    if (!document.getElementById("paypal-button-container").hasChildNodes()) {
      if (window.paypal) {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: "10.00" }, //Esto hay que cambiarlo por el valor correspondiente
                  },
                ],
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                alert(`Pago completado por ${details.payer.name.given_name}`);
              });
            },
          })
          .render("#paypal-button-container");
      } else {
        console.error("PayPal SDK no se ha cargado correctamente.");
      }
    }
  }, []);

  return <div style={{ maxWidth: "100%" }} id="paypal-button-container"></div>;
}

export default PaypalButton;
