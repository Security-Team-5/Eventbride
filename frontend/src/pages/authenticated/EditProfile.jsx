import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/resources/css/EditProfile.css";

function EditProfile() {
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        telephone: "",
        dni: "",
        profilePicture: "",
        role: "",
        plan: "",
        paymentPlanDate: "",
        expirePlanDate: "",
        receivesEmails: false,
    });
    const [editing, setEditing] = useState(false);
    const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt"));
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.id) {
            setUserData(storedUser);
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const getRoleText = (role) => {
        switch (role) {
            case "ADMIN":
                return "Administrador";
            case "CLIENT":
                return "Cliente";
            case "SUPPLIER":
                return "Proveedor";
            default:
                return role;
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const updateUser = () => {
        if (
            !userData.firstName ||
            !userData.lastName ||
            !userData.username ||
            !userData.email ||
            !userData.telephone ||
            !userData.dni
        ) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        userData.password = "no-password";

        fetch(`/api/users/${userData.id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then((res) => res.json())
            .then((updatedUser) => {
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setUserData(updatedUser);
                setEditing(false);
                alert("Perfil actualizado con éxito");
            })
            .catch((err) => console.error("Error actualizando perfil:", err));

        fetch(`/api/users/generate-token`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "POST",
            body: JSON.stringify(userData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al generar nuevo token");
                return res.text();
            })
            .then((token) => {
                localStorage.setItem("jwt", token);
                setJwtToken(token);
            })
            .catch((err) => console.error("Token error:", err));
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    };
    

    return (
        <div className="edit-profile-wrapper">
            <div className="sidebar">
                <div style={{ maxHeight: "300px", overflow: "hidden", backgroundColor: "#f8f8f8" }} className="profile-pic-wrapper">
                {userData.profilePicture?.trim() ? (
                    <img style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "cover", borderRadius: "50%" }} src={userData.profilePicture} alt="Foto de perfil" />
                    ) : null
                    }
                </div>
                <button className="editar-profile" onClick={() => setEditing(true)}>EDITAR</button>
                {userData.role === "SUPPLIER" && userData.plan === "BASIC" && (
                    <button className="plan-button" onClick={() => navigate("/profile/plan")}>PLANES</button>
                )}
                <button className="hover-button" style={{ backgroundColor: "#dc3545", color: "white" }} onClick={handleLogout}>
                    Cerrar sesión
                </button>
            </div>

            <div className="profile-info">
                {!editing ? (
                    <>
                        <p><strong>Nombre:</strong> {userData.firstName}</p>
                        <p><strong>Apellido:</strong> {userData.lastName}</p>
                        <p><strong>Usuario:</strong> {userData.username}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Teléfono:</strong> {userData.telephone}</p>
                        <p><strong>DNI:</strong> {userData.dni}</p>
                        <p><strong>Rol:</strong> {getRoleText(userData.role)}</p>
                        <p><strong>Recibe emails:</strong> {userData.receivesEmails ? "Sí" : "No"}</p>

                        {userData.role === "SUPPLIER" && (
                            <p><strong>Plan:</strong> {userData.plan || "Básico"}</p>
                        )}

                        {userData.plan === "PREMIUM" && (
                            <>
                                <p><strong>Fecha de pago:</strong> {formatDateTime(userData.paymentPlanDate)}</p>
                                <p><strong>Vence el:</strong> {formatDateTime(userData.expirePlanDate)}</p>
                            </>
                        )}

                    </>
                ) : (
                    <form onSubmit={(e) => e.preventDefault()} className="form-edit">
                        <div><label>Nombre:</label><input name="firstName" value={userData.firstName} onChange={handleInputChange} /></div>
                        <div><label>Apellido:</label><input name="lastName" value={userData.lastName} onChange={handleInputChange} /></div>
                        <div><label>Usuario:</label><input name="username" value={userData.username} onChange={handleInputChange} /></div>
                        <div><label>Email:</label><input name="email" value={userData.email} onChange={handleInputChange} /></div>
                        <div><label>Teléfono:</label><input name="telephone" value={userData.telephone} onChange={handleInputChange} /></div>
                        <div><label>DNI:</label><input name="dni" value={userData.dni} onChange={handleInputChange} /></div>
                        <div><label>Foto perfil (URL):</label><input name="profilePicture" value={userData.profilePicture} onChange={handleInputChange} /></div>
                        <div>
                            <input type="checkbox" name="receivesEmails" checked={userData.receivesEmails} onChange={handleInputChange} />
                            <label>Quiero recibir notificaciones por email</label>
                        </div>
                        <div className="btn-group">
                            <button className="save-btn" onClick={updateUser}>Guardar</button>
                            <button className="cancel-btn" onClick={() => setEditing(false)}>Cancelar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default EditProfile;
