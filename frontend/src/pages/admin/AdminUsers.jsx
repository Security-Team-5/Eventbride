/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react"
import "../../static/resources/css/AdminUsers.css";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({
        id: "",
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        telephone: "",
        dni: "",
        role: "",
        profilePicture: "",
        plan: "",
        paymentPlanDate: "",
        expirePlanDate: "",
    });

    const jwtToken = localStorage.getItem("jwt");
    const navigate = useNavigate();

    const roleMap = {
        CLIENT: "Cliente",
        SUPPLIER: "Proveedor",
        ADMIN: "Admin"
    };
    const planMap = {
        BASIC: "Básico",
        PREMIUM: "Premium"
    };

    useEffect(() => {
        getUsers();
    }, []);

    function getUsers() {
        fetch("api/users/DTO", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "GET",
        })
            .then(response => {
                if (!response.ok) throw new Error("Error en la solicitud de usuarios");
                return response.json();
            })
            .then(data => {
                const rolePriority = { CLIENT: 1, SUPPLIER: 2, ADMIN: 3 };
                const sortedUsers = data.sort((a, b) => rolePriority[a.role] - rolePriority[b.role]);
                setUsers(sortedUsers);
            })
            .catch(error => console.error("Error obteniendo usuarios:", error));
    }

    function searchUserById() {
        if (!searchId.trim()) {
            setFilteredUsers([]);
            return;
        }
        const found = users.find((u) => String(u.id) === searchId.trim());
        if (found) {
            setFilteredUsers([found]);
            setError("");
        } else {
            setFilteredUsers([]);
            setError("No se encontró ningún usuario con ese ID.");
        }
    }

    function startEditing(user) {
        setEditUserId(user.id);
        setUserData({ ...user });
    }

    function updateUser() {
        if (!editUserId || !validateUserData(userData)) return;
        userData.password = "password";

        fetch(`/api/users/admin/${editUserId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) throw new Error("Error al actualizar usuario");
                return response.json();
            })
            .then(updatedUser => {
                setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                setEditUserId(null);
                setError("");
            })
            .catch(error => setError(error.message || "Error al actualizar el usuario"));
    }

    function validateUserData(userData) {
        setError("");

        if (!userData.firstName || !userData.lastName || !userData.username || !userData.email || !userData.dni) {
            setError("Por favor, complete todos los campos obligatorios.");
            return false;
        }

        if (userData.firstName.length > 40 || userData.lastName.length > 40 || userData.username.length > 50) {
            setError("Uno de los campos excede la longitud máxima permitida.");
            return false;
        }

        const dniPattern = /^[0-9]{8}[A-Za-z]$/;
        if (!dniPattern.test(userData.dni)) {
            setError("El DNI es incorrecto. Debe tener 8 números seguidos de una letra.");
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            setError("El correo electrónico no es válido.");
            return false;
        }

        const telephonePattern = /^[0-9]{9}$/;
        if (!telephonePattern.test(userData.telephone)) {
            setError("El teléfono debe tener 9 números.");
            return false;
        }

        return true;
    }

    function handleInputChange(e) {
        const { name, value } = e.target;

        if (name === "dni") {
            const digits = value.replace(/\D/g, '');
            const letters = value.replace(/[^A-Za-z]/g, '');
            let newDni = digits.substring(0, 8);
            if (digits.length >= 8 && letters.length > 0) {
                newDni += letters.charAt(letters.length - 1).toUpperCase();
            }
            setUserData(prev => ({ ...prev, [name]: newDni }));
        } else if (name === "telephone") {
            const digits = value.replace(/\D/g, '').substring(0, 9);
            setUserData(prev => ({ ...prev, [name]: digits }));
        } else {
            setUserData(prev => ({ ...prev, [name]: value }));
        }
    }

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "6%", marginBottom: "20px", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "40%", width: "100%" }}>
                    <input
                        type="text"
                        placeholder="Buscar por ID de usuario..."
                        value={searchId}
                        onChange={(e) => {
                            setSearchId(e.target.value);
                            if (!e.target.value.trim()) {
                                setFilteredUsers([]);
                                setError("");
                            }
                        }}
                        style={{
                            padding: "10px",
                            maxWidth: "40%",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            backgroundColor: "white",
                            color: "black"
                        }}
                    />
                    <button
                        onClick={searchUserById}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            backgroundColor: "#007BFF",
                            color: "white",
                            maxWidth: "20%",
                            border: "none"
                        }}
                    >
                        Buscar
                    </button>
                    <button
                        onClick={() => {
                            setSearchId("");
                            setFilteredUsers([]);
                            setError("");
                        }}
                        style={{
                            padding: "10px 16px",
                            borderRadius: "8px",
                            maxWidth: "20%",
                            backgroundColor: "#ccc",
                            border: "none"
                        }}
                    >
                        Limpiar
                    </button>
                </div>
            </div>


            {error && (
                <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <div className="user-grid">
                {(filteredUsers.length > 0 ? filteredUsers : users).map((user, index) => (
                    <div key={index} className="service-container">
                        <h2 className="service-title">Usuario ID: {user.id}</h2>
                        <h2 className="service-title">{user.firstName} {user.lastName}</h2>
                        <div className="service-info">
                            <form style={{ width: "100%" }} onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input type="text" name="firstName" value={userData.id === user.id ? userData.firstName : user.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Apellido:</label>
                                    <input type="text" name="lastName" value={userData.id === user.id ? userData.lastName : user.lastName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Usuario:</label>
                                    <input type="text" name="username" value={userData.id === user.id ? userData.username : user.username} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input type="email" name="email" value={userData.id === user.id ? userData.email : user.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Teléfono:</label>
                                    <input type="tel" name="telephone" value={userData.id === user.id ? userData.telephone : user.telephone} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>DNI:</label>
                                    <input type="text" name="dni" value={userData.id === user.id ? userData.dni : user.dni} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Rol:</label>
                                    <select name="role" value={userData.id === user.id ? userData.role : user.role} onChange={handleInputChange}>
                                        {Object.keys(roleMap).map(role => (
                                            <option key={role} value={role}>{roleMap[role]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Foto de perfil:</label>
                                    <img src={user.profilePicture} alt="Foto" className="service-image" />
                                </div>
                                <div className="button-container">
                                    {editUserId === user.id ? (
                                        <button className="save-btn" style={{ backgroundColor: "#4CAF50" }} onClick={updateUser}>Guardar</button>
                                    ) : (
                                        <button className="edit-btn" onClick={() => startEditing(user)}>Editar</button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default AdminUsers;