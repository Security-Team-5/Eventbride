"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react" // Importa un icono de alerta (puedes usar cualquier librería de iconos que tengas)
import "../../static/resources/css/EditProfile.css"

function EditProfile() {
    const [userData, setUserData] = useState({
        id: "",
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
    })
    const [editing, setEditing] = useState(false)
    const [jwtToken, setJwtToken] = useState("")
    const [originalUsername, setOriginalUsername] = useState("")

    useEffect(() => {
        // Get JWT token from localStorage
        const token = localStorage.getItem("jwt")
        if (token) {
            setJwtToken(token)
        }

        // Get user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
        if (storedUser && storedUser.id) {
            setUserData(storedUser)
            setOriginalUsername(storedUser.username) // Guardar el username original
        }
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const getRoleText = (role) => {
        switch (role) {
            case "ADMIN":
                return "Administrador"
            case "CLIENT":
                return "Cliente"
            case "SUPPLIER":
                return "Proveedor"
            default:
                return role
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        localStorage.removeItem("user")
        window.location.href = "/login"
    }

    const updateUser = async () => {
        // Validate required fields
        if (
            !userData.firstName ||
            !userData.lastName ||
            !userData.username ||
            !userData.email ||
            !userData.telephone ||
            !userData.dni
        ) {
            alert("Por favor, completa todos los campos obligatorios.")
            return
        }

        try {
            // Create a copy of userData to avoid modifying state directly
            const userDataToUpdate = { ...userData, password: "no-password" }

            // Update user profile
            const response = await fetch(`/api/users/${userData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwtToken}`,
                },
                body: JSON.stringify(userDataToUpdate),
            })

            if (!response.ok) {
                throw new Error("Error al actualizar el perfil")
            }

            const updatedUser = await response.json()

            // Update localStorage with new user data
            localStorage.setItem("user", JSON.stringify(updatedUser))

            // Update state with new user data
            setUserData(updatedUser)
            setEditing(false)

            // Check if username was changed - if so, force logout immediately
            if (originalUsername !== userData.username) {
                alert("Has cambiado tu nombre de usuario. Por favor, inicia sesión nuevamente con tu nuevo nombre de usuario.")
                // Ejecutar logout inmediatamente sin continuar con el resto del código
                handleLogout()
                return // Importante: detener la ejecución aquí
            }

            // Solo llegamos aquí si el username NO cambió
            alert("Perfil actualizado con éxito")
            window.location.href = "/profile"
        } catch (error) {
            console.error("Error actualizando perfil:", error)
            alert("Error al actualizar el perfil")
        }
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return "-"
        const date = new Date(dateString)
        return date.toLocaleString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
    }

    return (
        <div className="edit-profile-container">
            <div className="edit-profile-header">
                <h1>Mi Perfil</h1>
                <p>Gestiona tu información personal y configuración de cuenta</p>
            </div>

            <div className="edit-profile-wrapper">
                <div className="sidebar">
                    <div className="profile-pic-container">
                        {userData.profilePicture?.trim() ? (
                            <img src={userData.profilePicture || "/placeholder.svg"} alt="Foto de perfil" className="profile-image" />
                        ) : (
                            <div className="profile-placeholder">
                                {userData.firstName && userData.lastName
                                    ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
                                    : "??"}
                            </div>
                        )}
                    </div>

                    <div className="sidebar-actions">
                        <button className="action-button primary-button" onClick={() => setEditing(true)} disabled={editing}>
                            Editar Perfil
                        </button>

                        {userData.role === "SUPPLIER" && userData.plan === "BASIC" && (
                            <button className="action-button secondary-button" onClick={() => window.location.href = "/profile/plan"} style={{ background: "linear-gradient(45deg, #f0e4a2, #eece6c, #f1ac34)", color: "black" }}>
                                Ver Planes
                            </button>
                        )}

                        <button className="action-button danger-button" onClick={handleLogout}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                <div className="profile-info">
                    {editing && (
                        <div className="warning-banner">
                            <div className="warning-icon">
                                <AlertCircle size={20} />
                            </div>
                            <p>
                                <strong>Atención:</strong> Si cambias tu nombre de usuario, deberás iniciar sesión nuevamente.
                            </p>
                        </div>
                    )}
                    {!editing ? (
                        <div className="info-container">
                            <div className="info-section">
                                <h2>Información Personal</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Nombre</span>
                                        <span className="info-value">{userData.firstName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Apellido</span>
                                        <span className="info-value">{userData.lastName}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Usuario</span>
                                        <span className="info-value">{userData.username}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <span className="info-value">{userData.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Teléfono</span>
                                        <span className="info-value">{userData.telephone}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">DNI</span>
                                        <span className="info-value">{userData.dni}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section">
                                <h2>Detalles de Cuenta</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Rol</span>
                                        <span className="info-value">{getRoleText(userData.role)}</span>
                                    </div>

                                    {userData.role === "SUPPLIER" && (
                                        <div className="info-item">
                                            <span className="info-label">Plan</span>
                                            <span className="info-value">{userData.plan || "Básico"}</span>
                                        </div>
                                    )}

                                    {userData.plan === "PREMIUM" && (
                                        <>
                                            <div className="info-item">
                                                <span className="info-label">Fecha de pago</span>
                                                <span className="info-value">{formatDateTime(userData.paymentPlanDate)}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Vence el</span>
                                                <span className="info-value">{formatDateTime(userData.expirePlanDate)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="edit-form-container">
                            <h2>Editar Perfil</h2>
                            <form onSubmit={(e) => e.preventDefault()} className="form-edit">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="firstName">Nombre</label>
                                        <input id="firstName" name="firstName" value={userData.firstName} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="lastName">Apellido</label>
                                        <input id="lastName" name="lastName" value={userData.lastName} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="username">Usuario</label>
                                        <input id="username" name="username" value={userData.username} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="telephone">Teléfono</label>
                                        <input id="telephone" name="telephone" value={userData.telephone} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dni">DNI</label>
                                        <input id="dni" name="dni" value={userData.dni} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="profilePicture">URL de Foto de Perfil</label>
                                    <input
                                        id="profilePicture"
                                        name="profilePicture"
                                        value={userData.profilePicture}
                                        onChange={handleInputChange}
                                        placeholder="https://ejemplo.com/mi-foto.jpg"
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="cancel-button" onClick={() => setEditing(false)}>
                                        Cancelar
                                    </button>
                                    <button type="button" className="save-button" onClick={updateUser}>
                                        Guardar Cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default EditProfile

