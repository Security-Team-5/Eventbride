/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/resources/css/Admin.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null); // Para saber qué usuario se está editando
    const jwtToken = localStorage.getItem("jwt");
    const [userData, setUserData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        telephone: "",
        dni: "",
        role: "",
        profilePicture: ""
    });

    const navigate = useNavigate();
    const roleMap = {
        CLIENT: "Cliente",
        SUPPLIER: "Proveedor",
        ADMIN: "Admin"
    };

    // Obtener todos los usuarios
    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        fetch("api/users/DTO", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Usuarios obtenidos:", data);
                setUsers(data);
            })
            .catch(error => console.error("Error obteniendo usuarios:", error));
    }

    // Inicia el proceso de edición
    function startEditing(user) {
        setEditUserId(user.id);
        setUserData({
            ...user
        });
    }

    // Actualizar los datos del usuario
    function updateUser() {
        if (!editUserId) {
            console.error("El ID del usuario es nulo");
            return;
        }

        // Validar datos antes de enviar
        if (!validateUserData(userData)) {
            return;
        }
        userData.password = "password";

        fetch(`/api/users/admin/${editUserId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log("Usuario actualizado:", updatedUser);
                setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                setEditUserId(null); // Salir del modo de edición
            })
            .catch(error => console.error("Error actualizando usuario:", error));
    }

    // Validar los datos antes de enviarlos
    function validateUserData(userData) {
        if (!userData.firstName || !userData.lastName || !userData.username || !userData.email) {
            alert("Por favor, complete todos los campos obligatorios.");
            return false;
        }
        return true;
    }

    // Eliminar un usuario
    function deleteUser(userId, e) {
        // Prevenir el envío del formulario (si está dentro de un formulario)
        if (e) e.preventDefault();

        fetch(`/api/users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            method: "DELETE",
        })
            .then(() => {
                console.log("Usuario eliminado:", userId);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            })
            .catch(error => console.error("Error eliminando usuario:", error));
    }

    // Manejar el cambio de un campo de entrada
    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value, // Actualizamos el campo específico
        }));
    }

    return (
        <>
            {users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                        <div>
                            <h2 className="service-title">{user.firstName} {user.lastName}</h2>
                            <div className="service-info">
                                <form onSubmit={e => { e.preventDefault();}}>
                                    <div>
                                        <label>Nombre:</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userData.id === user.id ? userData.firstName : user.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Apellido:</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={userData.id === user.id ? userData.lastName : user.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Usuario:</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={userData.id === user.id ? userData.username : user.username}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Email:</label>
                                        <input
                                            type="text"
                                            name="email"
                                            value={userData.id === user.id ? userData.email : user.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Teléfono:</label>
                                        <input
                                            type="text"
                                            name="telephone"
                                            value={userData.id === user.id ? userData.telephone : user.telephone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>DNI:</label>
                                        <input
                                            type="text"
                                            name="dni"
                                            value={userData.id === user.id ? userData.dni : user.dni}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Rol:</label>
                                        <select
                                            name="role"
                                            value={userData.id === user.id ? userData.role : user.role}
                                            onChange={handleInputChange}
                                        >
                                            {Object.keys(roleMap).map(role => (
                                                <option key={role} value={role}>{roleMap[role]}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Foto de perfil:</label>
                                        <img src={user.profilePicture} alt={user.username} className="service-image" />
                                    </div>

                                    
                                </form>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="no-service">
                    <p>No hay usuarios disponibles.</p>
                </div>
            )}
        </>
    );
}

export default AdminUsers;
