import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../static/resources/css/Admin.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

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
            body: JSON.stringify(userId),
        })
            .then(response => response.json())
            .then(updatedService => {
                console.log("Usuario actualizado:", updatedService);
                setUsers(prevServices => prevServices.map(s => s.id === updatedService.id ? updatedService : s));
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

    return (
        <>
            {users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                        <div>
                            <h2 className="service-title">{user.firstname} {user.lastname}</h2>
                            <div className="service-info">
                                <p><strong>Usuario:</strong> {user.username}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Teléfono:</strong> {user.telephone}</p>
                                <p><strong>DNI:</strong> {user.dni}</p>
                                <p><strong>Rol:</strong> {user.role}</p>
                                <p><strong>Eventos:</strong> {user.events.length > 0 ? user.events.map(event => event.id).join(", ") : "Ninguno"}</p>
                            </div>
                        </div>
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="service-image"
                            onClick={() => navigate(`/user/${user.id}`)}
                            style={{ cursor: "pointer", alignItems: "center" }}
                        />
                        <div className="button-container">
                            <button className="save-btn" onClick={() => updateUser(user.id)}>Editar</button>
                            <button className="delete-btn" onClick={() => deleteUser(user.id)}>Borrar</button>
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