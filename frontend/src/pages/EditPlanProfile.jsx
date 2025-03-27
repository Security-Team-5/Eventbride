/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/resources/css/EditPlanProfile.css";
import PaypalButtonPlan from "../components/PaypalButtomPlan";

function EditPlanProfile() {
  const [userData, setUserData] = useState({
    plan: "",
    paymentPlanDate: new Date().toISOString().slice(0, 10),
    expirePlanDate: ""
  });

  const [jwtToken] = useState(localStorage.getItem("jwt"));
  const navigate = useNavigate();
  const [durationMonths, setDurationMonths] = useState(1);
  const [amount, setAmount] = useState(50.0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser && storedUser.id) {
      setUserData((prev) => ({
        ...prev,
        ...storedUser,
        paymentPlanDate: new Date().toISOString().slice(0, 10) // asegurar fecha por defecto
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDurationChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setDurationMonths(isNaN(value) ? 0 : value);
  };

  // Calcula fecha de expiración en formato Date y string bonito
  const calculatedFechaFinDate = (() => {
    if (!userData.paymentPlanDate || !durationMonths || durationMonths <= 0) return null;

    const startDate = new Date(userData.paymentPlanDate);
    const day = startDate.getDate();

    const tempDate = new Date(startDate.getFullYear(), startDate.getMonth() + durationMonths, 1);
    tempDate.setDate(day);

    if (tempDate.getDate() !== day) {
      tempDate.setDate(0); // Ajustar a último día del mes anterior
    }

    return tempDate;
  })();

  const fechaFinStringForDisplay = calculatedFechaFinDate
    ? calculatedFechaFinDate.toLocaleDateString("es-ES")
    : "";

  const fechaFinStringForBackend = calculatedFechaFinDate
    ? calculatedFechaFinDate.toISOString().split("T")[0]
    : "";

  useEffect(() => {
    setAmount(50 * durationMonths);
  }, [durationMonths]);

  return (
    <div className="edit-plan-container">
      <form onSubmit={(e) => e.preventDefault()} className="edit-plan-form">
        <h2>Editar Plan</h2>

        <div className="form-group">
          <label>Tipo de plan:</label>
          <select name="plan" value={userData.plan} onChange={handleInputChange}>
            <option value="">Seleccionar...</option>
            <option value="BASIC">Básico</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>

        {userData.plan === "PREMIUM" && (
          <>
            <div className="form-group">
              <label>Duración del plan (meses):</label>
              <input
                type="number"
                min="1"
                value={durationMonths}
                onChange={handleDurationChange}
              />
            </div>

            {durationMonths > 0 && (
              <div className="form-group">
                <label>Fecha de expiración (auto calculada):</label>
                <input type="text" disabled value={fechaFinStringForDisplay} />
              </div>
            )}
          </>
        )}

        {userData.plan === "PREMIUM" && durationMonths > 0 && (
          <>
            <span className="price">Precio: {amount} €</span>
            <div className="btn-group">
              <PaypalButtonPlan amount={amount} fechaFin={fechaFinStringForBackend} />
            </div>
          </>
        )}

        <div className="btn-group">
          <button className="cancel-btn" onClick={() => navigate("/profile")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPlanProfile;
