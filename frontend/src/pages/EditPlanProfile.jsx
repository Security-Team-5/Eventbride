import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../static/resources/css/EditPlanProfile.css";

function EditPlanProfile() {
    const [userData, setUserData] = useState({
        plan: "",
        paymentPlanDate: "",
        expirePlanDate: ""
    });
    const [jwtToken] = useState(localStorage.getItem("jwt"));
    const navigate = useNavigate();
    const [durationMonths, setDurationMonths] = useState(1);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.id) {
            setUserData(storedUser);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDurationChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setDurationMonths(isNaN(value) ? 1 : value);
    };

    const updatePlan = async () => {
        if (userData.plan === "PREMIUM") {
            if (!userData.paymentPlanDate) {
                alert("Debes seleccionar una fecha de inicio para el plan PREMIUM.");
                return;
            }

            const paymentDate = new Date(userData.paymentPlanDate);
            const expireDate = new Date(paymentDate);
            expireDate.setMonth(expireDate.getMonth() + durationMonths);

            userData.paymentPlanDate = paymentDate.toISOString();
            userData.expirePlanDate = expireDate.toISOString();
        } else {
            userData.paymentPlanDate = null;
            userData.expirePlanDate = null;
        }

        const updatedUser = {
            ...userData,
            password: "no-password"
        };

        try {
            const response = await fetch(`/api/users/${userData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || "Error actualizando el plan");
            }

            const updated = await response.json();
            setUserData(updated);
            localStorage.setItem("user", JSON.stringify(updated));
            alert(`¡Plan actualizado a ${updated.plan} con éxito!`);
            navigate("/profile");
        } catch (err) {
            console.error("Error al cambiar de plan:", err);
            alert("Hubo un error al actualizar el plan.");
        }
    };

    const calculatedExpireDate = () => {
        if (!userData.paymentPlanDate) return "";
        const date = new Date(userData.paymentPlanDate);
        date.setMonth(date.getMonth() + durationMonths);
        return date.toLocaleString("es-ES");
    };

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
                            <label>Fecha de inicio:</label>
                            <input
                                type="datetime-local"
                                name="paymentPlanDate"
                                value={userData.paymentPlanDate?.slice(0, 16) || ""}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Duración del plan (meses):</label>
                            <input
                                type="number"
                                min="1"
                                value={durationMonths}
                                onChange={handleDurationChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Fecha de expiración (auto calculada):</label>
                            <input
                                type="text"
                                disabled
                                value={calculatedExpireDate()}
                            />
                        </div>
                    </>
                )}

                <div className="btn-group">
                    <button className="save-btn" onClick={updatePlan}>Guardar</button>
                    <button className="cancel-btn" onClick={() => navigate("/profile")}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}

export default EditPlanProfile;
