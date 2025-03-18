/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import apiClient from "../apiClient";

const Register = () => {

  const { invitationId } = useParams();

  const [form, setForm] = useState({
    id: invitationId,
    firstName: "",
    lastName: "",
    numberOfGuests: 1,
    email: "",
    telephone: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", form);
    try {
      const response = await apiClient.post("/api/invitation", {
          id: invitationId,
          firstName: form.firstName,
          lastName: form.lastName,
          numberOfGuests: form.numberOfGuests,
          email: form.email,
          telephone: form.telephone,
      });

      if (response.data.error) {
        setError("Error: " + response.data.error);
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error.response?.data || error.message);
      setError("Error al registrarse. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Registro</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="firstName" placeholder="Nombre" value={form.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Apellido" value={form.lastName} onChange={handleChange} required />
          <input type="number" min="0" max="100" step="1" name="numberOfGuests" placeholder="1" value={form.username} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
          <input type="tel" name="telephone" placeholder="Teléfono" value={form.telephone} onChange={handleChange} required />
          <button type="submit">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
