/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "../../static/resources/css/EditPlanProfile.css";
import PaypalButtonPlan from "../../components/PaypalButtomPlan";

function EditPlanProfile() {
  const [userData, setUserData] = useState({
    plan: "",
    paymentPlanDate: new Date().toISOString().slice(0, 10),
    expirePlanDate: ""
  });

  const [jwtToken] = useState(localStorage.getItem("jwt"));
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
      <div className="plans-section-container">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Planes</h2>
        <div className="plans-comparison">
          <div className="plan-box basic-plan">
            <h3>Plan Básico</h3>
            <ul className="plan-features basic-features">
              <li>Creación y edición de servicios</li>
              <li>Ofertar hasta tres servicios</li>
              <li> Gestión de solicitudes</li>
              <li>Chat con clientes</li>
              <li>Soporte técnico</li>

            </ul>
          </div>

          <div className="plan-box premium-plan">
            <h3>Plan Premium</h3>
            <ul className="plan-features premium-features">
              <li>Todo el contenido del Plan Básico</li>
              <li>Ofertar hasta diez servicios</li>
              <li>Prioridad en resultados de búsqueda</li>
              <li><span className="price-tag">50€/mes</span></li>
            </ul>
          </div>
        </div>
      </div>
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
          <button className="cancel-btn" onClick={() => window.location.href = "/profile"}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPlanProfile;
