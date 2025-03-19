/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import apiClient from "../apiClient";
import "../static/resources/css/ConfirmEmailInvitation.css";

const Register = () => {

  const { invitationId } = useParams();
  const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/invitation/confirm/${invitationId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error("Error confirmando el evento:", error);
                setError(error);
            });
    }, []);

  return (
    <div className="confirm-container">
        {
            error ? (
                <h2>
                    Ha ocurrido un error confirmando la invitación.
                </h2>
            ) : (
                <h2>
                    ¡¡Invitación confirmada correctamente!!
                </h2>
            )
        }
    </div>
  );
};

export default Register;
