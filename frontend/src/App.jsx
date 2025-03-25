import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import OtherServiceScreen from "./pages/OtherServiceScreen";
import Servicios from "./pages/Servicios";
import RegistrarServicio from "./pages/RegistrarServicio";
import RequestService from "./pages/RequestService";
import VenuesScreen from "./pages/VenuesScreen";
import EditarServicio from "./pages/EditarServicio";
import "./App.css";
import NavBar from "./components/AppNavBar";
import Terms from "./pages/Terms";
import { useCurrentUser } from "./hooks/useCurrentUser";
import MyEvents from "./pages/MyEvents";
import CreateEvents from "./pages/CreateEvents"
import EventDetails from "./pages/EventDetails";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminServices from "./pages/admin/AdminServices";
import AdminUsers from "./pages/admin/AdminUsers";
import InformationService from "./pages/InformationService";
import Payment from "./pages/Payment";
import PrivateChat from "./pages/PrivateChat.jsx";
import FloatingChatButton from "./components/FloatingChatButton";
import ChatList from "./pages/ChatList";

function App() {
  const {currentUser, loading, setCurrentUser} = useCurrentUser(null);

  if (loading) {
    return <div>Loading...</div>; // Muestra algo mientras se carga el usuario
  }
  
  return (
    <div className="app-container"> 
      <Router>
        <div className="navbar"><NavBar /></div>
        <div className="content">
          <Routes>
            <Route path="/user"  />
            <Route path="/" element={currentUser ? <Home user={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setCurrentUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/other-services" element={<OtherServiceScreen />} />
            <Route path="/solicitudes" element={<RequestService />} />
            <Route path="/misservicios" element={<Servicios/>} />
            <Route path="/misservicios/registrar" element={<RegistrarServicio/>} />
            <Route path="/misservicios/editar/:serviceType/:id" element={<EditarServicio/>} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/venues" element={<VenuesScreen />} />
            <Route path="/terminos-y-condiciones" element={<Terms />} />
            <Route path="/events" element={<MyEvents />} />
            <Route path="/create-events" element={<CreateEvents />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/payment/:id" element={<Payment/>} />
            <Route path="/other-services/information/:id" element={<InformationService />} />
            <Route path="/chat/:id" element={<PrivateChat />} />
            <Route path="/chats" element={<ChatList />} />
            {currentUser && currentUser.role == "ADMIN" &&
              <>
                <Route path="/admin-events" element={<AdminEvents/>} />
                <Route path="/admin-users" element={<AdminUsers />} />
                <Route path="/admin-services" element={<AdminServices />} />
              </>
            }
          </Routes>
          <FloatingChatButton />
          
        </div>
      </Router>
    </div>
  );
}

export default App;
