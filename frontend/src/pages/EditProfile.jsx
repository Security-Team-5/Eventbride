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
    const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwt"));

    // Mostrar datos almacenados del usuario en el formulario
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (storedUser && storedUser.id) {
            setUserData(storedUser);
        }
    }, []);

    // Manejar cambios en los inputs
    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    // Actualizar perfil
    function updateUser() {
        // Validar que campos no estén vacíos
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

        userData.password = "no-password"; // No se actualiza la contraseña

        // Petición PUT para actualizar el perfil
        fetch(`/api/users/${userData.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log("Perfil actualizado:", updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser)); // Actualizar localStorage
                alert("Perfil actualizado con éxito");
            })
            .catch(error => console.error("Error actualizando el perfil:", error));

        // Petición POST para generar nuevo token  
        fetch(`/api/users/generate-token`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            method: "POST",
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al generar nuevo token");
                }
                return response.text();
            })
            .then(token => {
                console.log("Token generado");
                window.localStorage.setItem("jwt", token);
                setJwtToken(token);
            })
            .catch(error => 
                console.error("Error actualizando el perfil:", error));

    }

    // Función para traducir el rol
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

    return (
        <div className="edit-profile-container">
            <h2>Editar Perfil</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="telephone"
                        value={userData.telephone}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>DNI:</label>
                    <input
                        type="text"
                        name="dni"
                        value={userData.dni}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Rol:</label>
                    <input
                        type="text"
                        name="role"
                        value={getRoleText(userData.role)}
                        disabled
                    />
                </div>
                <div>
                    <label>Link de foto de perfil:</label>
                    <input
                        type="text"
                        name="profilePicture"
                        value={userData.profilePicture}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label>Foto de perfil:</label>
                    <br />
                    <img
                        src={userData.profilePicture || ""}
                        alt="Perfil"
                        className="profile-image"
                    />
                </div>
                <button className="save-btn" onClick={updateUser}>
                    Guardar
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
