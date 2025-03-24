import { useEffect, useState } from "react";
import "../static/resources/css/EditProfile.css";

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
    });
    const [editing, setEditing] = useState(false);
    const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt"));

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

    return (
        <div className="edit-profile-container">
            <h2>Perfil de Usuario</h2>

            {!editing ? (
                <div className="profile-view">
                    <img src={userData.profilePicture} alt="Perfil" className="profile-image" />
                    <p><strong>Nombre:</strong> {userData.firstName}</p>
                    <p><strong>Apellido:</strong> {userData.lastName}</p>
                    <p><strong>Usuario:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Teléfono:</strong> {userData.telephone}</p>
                    <p><strong>DNI:</strong> {userData.dni}</p>
                    <p><strong>Rol:</strong> {getRoleText(userData.role)}</p>
                    <button onClick={() => setEditing(true)}>Editar Perfil</button>
                </div>
            ) : (
                <form onSubmit={(e) => e.preventDefault()}>
                    <div><label>Nombre:</label><input name="firstName" value={userData.firstName} onChange={handleInputChange} /></div>
                    <div><label>Apellido:</label><input name="lastName" value={userData.lastName} onChange={handleInputChange} /></div>
                    <div><label>Usuario:</label><input name="username" value={userData.username} onChange={handleInputChange} /></div>
                    <div><label>Email:</label><input name="email" value={userData.email} onChange={handleInputChange} /></div>
                    <div><label>Teléfono:</label><input name="telephone" value={userData.telephone} onChange={handleInputChange} /></div>
                    <div><label>DNI:</label><input name="dni" value={userData.dni} onChange={handleInputChange} /></div>
                    <div><label>Foto de perfil (URL):</label><input name="profilePicture" value={userData.profilePicture} onChange={handleInputChange} /></div>
                    <img src={userData.profilePicture} alt="Preview" className="profile-image" />
                    <div className="btn-group">
                        <button className="save-btn" onClick={updateUser}>Guardar</button>
                        <button className="cancel-btn" onClick={() => setEditing(false)}>Cancelar</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default EditProfile;
