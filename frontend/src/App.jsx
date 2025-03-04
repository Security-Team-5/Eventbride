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
        const response = await fetch("http://localhost:8080/api/auth/current-user", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          setCurrentUser(null);
          localStorage.removeItem("user");
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
