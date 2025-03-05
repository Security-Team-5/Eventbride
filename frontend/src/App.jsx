import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import "./App.css";
import NavBar from "./components/AppNavBar";
import { useCurrentUser } from "./hooks/useCurrentUser";

function App() {
  const [user, setUser] = useState(null);
  const {currentUser, loading} = useCurrentUser({user})

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
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
