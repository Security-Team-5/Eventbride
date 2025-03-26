/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import apiClient from "../apiClient";
import "../static/resources/css/ConfirmEmailInvitation.css";

const Register = () => {

  const { invitationId } = useParams();

    useEffect(() => {
    }, []);

  return (
    <div className="confirm-container">
        {
                <h2 style={{color:"black"}}>
                    ¡¡Invitación confirmada correctamente!!
                </h2>
            
        }
    </div>
  );
};

export default Register;
