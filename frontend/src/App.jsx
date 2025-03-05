import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";
import NavBar from "./components/AppNavBar";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para saber si está cargando

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = window.localStorage.getItem("jwt");
        console.log("Token JWT:", token);
        
        if (token) {
          const response = await fetch("http://localhost:8080/api/users/auth/current-user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
          const data = await response.json();
          setCurrentUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user)); 
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false); // Después de cargar los datos, setea el estado de loading a false
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Muestra algo mientras se carga el usuario
  }

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
