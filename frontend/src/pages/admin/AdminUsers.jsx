/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/resources/css/Admin.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null); // Para saber qué usuario se está editando
    const [userData, setUserData] = useState({
        id: "",
        firstname: "",
        lastname: "",
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

    function updateUser(userId) {
        fetch(`/api/users/admin/update/${userId.id}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log("Usuario actualizado:", updatedUser);
                setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                setEditUserId(null)
            })
            .catch(error => console.error("Error actualizando usuario:", error));
    }

    function deleteUser(userId) {
        fetch(`/api/users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "DELETE",
        })
            .then(() => {
                console.log("Usuario eliminado:", userId);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            })
            .catch(error => console.error("Error eliminando usuario:", error));
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    }

    function startEditing(user) {
        setEditUserId(user.id);
        setUserData({
            ...user
        });
    }

    return (
        <>
            {users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                        <div>
                            <h2 className="service-title">{user.firstname} {user.lastname}</h2>
                            <div className="service-info">
                                <form onSubmit={e => { e.preventDefault(); updateUser(user) }}>
                                    <div>
                                        <label>Nombre:</label>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={userData.id === user.id ? userData.firstname : user.firstname}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label>Apellido:</label>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={userData.id === user.id ? userData.lastname : user.lastname}
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

                                    {editUserId === user.id ? (
                                        <div className="button-container">
                                            <button className="save-btn" type="submit">Guardar</button>
                                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Borrar</button>
                                        </div>
                                    ) : (
                                        <div className="button-container">
                                            <button onClick={() => startEditing(user)} className="edit-btn">Editar</button>
                                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Borrar</button>
                                        </div>
                                    )}
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