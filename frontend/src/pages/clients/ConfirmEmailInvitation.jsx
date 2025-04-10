/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../static/resources/css/ConfirmEmailInvitation.css';

const Register = () => {
  const { invitationId } = useParams();

  useEffect(() => {
    // Aquí podrías realizar alguna lógica adicional relacionada con la invitación, si fuese necesario.
  }, [invitationId]);

  return (
    <div className="confirm-container">
      <div className="confirmation-card">
        <h2 className="confirmation-title" style={{marginBottom: "6vh"}}>
          ¡¡Invitación confirmada correctamente!!
        </h2>
        <p className="confirmation-button">
        Puede cerrar la ventana
        </p>
      </div>
    </div>
  );
};

export default Register;
