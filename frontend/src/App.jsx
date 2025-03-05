import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";
import NavBar from "./components/AppNavBar";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = window.localStorage.getItem("jwt");
          console.log("Token JWT:", token);
          
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
            console.log("Data:", data);
            setCurrentUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));  // Almacenar datos del usuario
          }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
    };

     fetchCurrentUser();
  }, []);

  return (
    <div className="app-container"> 
      <Router>
        <NavBar />
        <div className="content">
          <Routes>
            <Route path="/user"  />
            <Route path="/" element={currentUser ? <Home user={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setCurrentUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
