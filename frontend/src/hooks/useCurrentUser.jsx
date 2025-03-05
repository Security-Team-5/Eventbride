import { useEffect, useState } from "react"

export const useCurrentUser = () => {

    const [loading, setLoading] = useState(true);  
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        //if (!user) {
        const fetchCurrentUser = async () => {
        try {
            // Obtener el token almacenado en localStorage
            const token = window.localStorage.getItem("jwt");
            
            // Verificar si el token existe antes de hacer la solicitud
            if (token) {
            const response = await fetch("http://localhost:8080/api/users/auth/current-user", {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`,  // Incluir el token JWT en el encabezado
                "Content-Type": "application/json",
                },
                credentials: "include", // Si usas cookies, de lo contrario puedes eliminar esto
            });

                const data = await response.json();
                setCurrentUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));  // Almacenar datos del usuario
                
            } else {
            setCurrentUser(null); // Si no hay token, no hay usuario autenticado
            }
        } catch (error) {
            console.error("Error fetching current user:", error);
            setCurrentUser(null);
            localStorage.removeItem("user");
        }
        finally{
            setLoading(false);
        }
        };

        const user = JSON.parse(localStorage.getItem("user"));
        if(user){
            setCurrentUser(user);
            setLoading(false);
        }
        else{
            fetchCurrentUser();
        }
        //}
      }, []);
    
    return {currentUser, loading}
    
}