/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, FileText, Image, UserCircle, AlertCircle, UserPlus } from "lucide-react"
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
        profilePicture: "",
        plan: "",
        paymentPlanDate: "",
        expirePlanDate: "",
    });

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

    // Obtener todos los usuarios
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

        console.log("Payload enviado:", userData);

        fetch(`/api/users/admin/${editUserId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            method: "PUT",
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    // Error específico para cuando el usuario ya existe
                    if (response.status === 409) {
                        throw new Error("El nombre de usuario ya está en uso. Por favor, elija otro.");
                    }
                    
                    // For other errors, try to parse the response body
                    return response.text().then(text => {
                        // Try to parse as JSON, but handle case where it's not valid JSON
                        try {
                            const data = JSON.parse(text);
                            throw new Error(data.message || "Error en los datos enviados. Verifique la información.");
                        } catch (e) {
                            // Si el parseo falla o el mensaje de error contiene informacion especifica con una entrada duplicada  If parsing fails or the error message contains specific text about duplicate entry
                            if (text.includes("Duplicate entry") && text.includes("username")) {
                                throw new Error("El nombre de usuario ya está en uso. Por favor, elija otro.");
                            } else {
                                throw new Error(text || "Error al actualizar el usuario. Inténtelo de nuevo más tarde.");
                            }
                        }
                    });
                }
                return response.json();
            })
            .then(updatedUser => {
                console.log("Usuario actualizado:", updatedUser);
                setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
                setEditUserId(null); // Salir del modo de edición
                setError(""); // Clear any previous errors
            })
            .catch(error => {
                console.error("Error actualizando usuario:", error);
                setError(error.message || "Error al actualizar el usuario");
            });
    }

    // Validar los datos antes de enviarlos
    function validateUserData(userData) {
        setError("");
        
        // Comprobar campos obligatorios
        if (!userData.firstName || !userData.lastName || !userData.username || !userData.email || !userData.dni) {
            setError("Por favor, complete todos los campos obligatorios.");
            return false;
        }
        
        // Validar longitud del nombre
        if (userData.firstName.length > 40) {
            setError("El nombre no puede tener más de 40 caracteres.");
            return false;
        }
        
        if (userData.lastName.length > 40) {
            setError("El apellido no puede tener más de 40 caracteres.");
            return false;
        }
        
        if (userData.username.length > 50) {
            setError("El nombre de usuario no puede tener más de 50 caracteres.");
            return false;
        }
        
        // Validar formato del DNI
        const dniPattern = /^[0-9]{8}[A-Za-z]$/;
        if (!dniPattern.test(userData.dni)) {
            setError("El DNI es incorrecto. Debe tener 8 números seguidos de una letra.");
            return false;
        }
        
        // Validar formato del correo electrónico
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userData.email)) {
            setError("El correo electrónico no es válido.");
            return false;
        }
        
        // Validar número de teléfono
        const telephonePattern = /^[0-9]{9}$/;
        if (!telephonePattern.test(userData.telephone)) {
            setError("El teléfono debe tener 9 números.");
            return false;
        }
        
        // Validar fechas para plan premium
        if (userData.role === "SUPPLIER" && userData.plan === "PREMIUM") {
            if (!userData.paymentPlanDate) {
                setError("La fecha de pago del plan es obligatoria para planes Premium.");
                return false;
            }
            
            if (!userData.expirePlanDate) {
                setError("La fecha de expiración del plan es obligatoria para planes Premium.");
                return false;
            }
            
            const paymentDate = new Date(userData.paymentPlanDate);
            const expireDate = new Date(userData.expirePlanDate);
            
            if (isNaN(paymentDate.getTime()) || isNaN(expireDate.getTime())) {
                setError("Las fechas del plan no son válidas.");
                return false;
            }
            
            if (expireDate <= paymentDate) {
                setError("La fecha de expiración debe ser posterior a la fecha de pago.");
                return false;
            }
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
        
        // Manejo especial para el DNI
        if (name === "dni") {
            // Extraer los dígitos y letras del valor actual
            const digits = value.replace(/\D/g, '');
            const letters = value.replace(/[^A-Za-z]/g, '');
            
            // Construir el nuevo valor del DNI
            let newDni = digits.substring(0, 8); // Primero los 8 dígitos
            
            // Solo añadir la letra si ya tenemos 8 dígitos
            if (digits.length >= 8 && letters.length > 0) {
                newDni += letters.charAt(letters.length - 1).toUpperCase();
            }
            
            setUserData(prevData => ({
                ...prevData,
                [name]: newDni,
            }));
        } 
        // Manejo especial para el teléfono (solo dígitos)
        else if (name === "telephone") {
            // Extraer solo los dígitos
            const digits = value.replace(/\D/g, '');
            
            // Limitar a 9 dígitos
            const newTelephone = digits.substring(0, 9);
            
            setUserData(prevData => ({
                ...prevData,
                [name]: newTelephone,
            }));
        }
        else {
            setUserData(prevData => ({
                ...prevData,
                [name]: value, // Para cualquier otro campo, se queda igual
            }));
        }
    }

    // Estado para manejar errores
    const [error, setError] = useState("");

    return (
        <>
            {/* Los errores se muestran en cada usuario */}
            
            {users.length > 0 ? (
                users.map((user, index) => (
                    <div key={index} className="service-container" style={{ display: "flex", flexDirection: "column", marginTop: "6%" }}>
                        <div>
                            <h2 className="service-title">{user.firstName} {user.lastName}</h2>
                            {editUserId === user.id && error && (
                                <div className="error-message" style={{ margin: "10px 0", padding: "8px", backgroundColor: "#ffebee", color: "#d32f2f", borderRadius: "4px", display: "flex", alignItems: "center" }}>
                                    <AlertCircle size={18} style={{ marginRight: "8px" }} />
                                    <span>{error}</span>
                                </div>
                            )}
                            <div className="service-info">
                                <form onSubmit={e => { e.preventDefault(); }}>
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
                                        <label htmlFor="email">Correo electrónico</label>
                                        <div>
                                            <Mail size={18} className="input-icon" />
                                            <input
                                            type="email"
                                            name="email"
                                            placeholder="Introduzca el correo electrónico"
                                            value={userData.id === user.id ? userData.email : user.email}
                                            onChange={handleInputChange}
                                            required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Phone size={18}/>
                                        <input
                                            type="tel"
                                            id="telephone"
                                            name="telephone"
                                            placeholder="Introduzca el número de teléfono"
                                            pattern="[0-9]{9}"
                                            maxLength={9}
                                            value={userData.id === user.id ? userData.telephone : user.telephone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dni">DNI</label>
                                        <div>
                                        <FileText size={18} className="input-icon" />
                                        <input
                                            type="text"
                                            id="dni"
                                            name="dni"
                                            placeholder="Tu DNI"
                                            pattern="[0-9]{8}[A-Z]"
                                            value={userData.id === user.id ? userData.dni : user.dni}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        </div>
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
                                    {user.role === "SUPPLIER" && (
                                        <>
                                            <div>
                                                <label>Plan:</label>

                                                <select
                                                    name="plan"
                                                    value={userData.id === user.id ? userData.plan : user.plan}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setUserData((prevData) => ({
                                                            ...prevData,
                                                            plan: value,
                                                            ...(value === "BASIC" && {
                                                                paymentPlanDate: null,
                                                                expirePlanDate: null,
                                                            })
                                                        }));
                                                    }}
                                                >
                                                    {Object.keys(planMap).map(plan => (
                                                        <option key={plan} value={plan}>{planMap[plan]}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {userData.id === user.id && userData.plan === "PREMIUM" && (

                                                <>
                                                    <div>
                                                        <label>Fecha de pago del plan:</label>
                                                        <input
                                                            type="datetime-local"
                                                            name="paymentPlanDate"
                                                            value={userData.id === user.id ? userData.paymentPlanDate : user.paymentPlanDate || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Fecha de expiración del plan:</label>
                                                        <input
                                                            type="datetime-local"
                                                            name="expirePlanDate"
                                                            value={userData.id === user.id ? userData.expirePlanDate : user.expirePlanDate || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                    <div>
                                        <label>Foto de perfil:</label>
                                        <img src={user.profilePicture} alt={user.username} className="service-image" />
                                    </div>

                                    {editUserId === user.id ? (
                                        <div className="button-container">
                                            <button className="save-btn" onClick={updateUser}>Guardar</button>
                                            <button className="delete-btn" onClick={(e) => deleteUser(user.id, e)}>Borrar</button>
                                        </div>
                                    ) : (
                                        <div className="button-container">
                                            <button onClick={() => startEditing(user)} className="edit-btn">Editar</button>
                                            <button className="delete-btn" onClick={(e) => deleteUser(user.id, e)}>Borrar</button>
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
