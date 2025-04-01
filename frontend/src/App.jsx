import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Login from "./pages/no-authentified/Login"
import Register from "./pages/no-authentified/Register"
import Home from "./pages/no-authentified/Home.jsx"
import OtherServiceScreen from "./pages/clients/OtherServiceScreen.jsx"
import Servicios from "./pages/provider/Servicios"
import RegistrarServicio from "./pages/provider/RegistrarServicio.jsx"
import RequestService from "./pages/provider/RequestService"
import VenuesScreen from "./pages/clients/VenuesScreen"
import EditarServicio from "./pages/provider/EditarServicio.jsx"
import "./App.css"
import NavBar from "./components/AppNavBar"
import Terms from "./pages/no-authentified/Terms.jsx"
import { useCurrentUser } from "./hooks/useCurrentUser"
import MyEvents from "./pages/clients/MyEvents.jsx"
import CreateEvents from "./pages/clients/CreateEvents"
import EventDetails from "./pages/clients/EventDetails";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminServices from "./pages/admin/AdminServices";
import AdminUsers from "./pages/admin/AdminUsers";
import Invitations from "./pages/clients/Invitations.jsx";
import EventInvitations from "./pages/clients/EventInvitations";
import RegisterInvitation from "./pages/no-authentified/RegisterInvitation";
import ConfirmEmailInvitation from "./pages/clients/ConfirmEmailInvitation.jsx";
import Payment from "./pages/clients/Payment.jsx";
import PrivateChat from "./pages/authentified/PrivateChat.jsx";
import FloatingChatButton from "./components/FloatingChatButton";
import ChatList from "./pages/authentified/ChatList.jsx";
import Footer from "./components/Footer"
import FAQ from "./pages/no-authentified/faqs.jsx"
import EditProfile from "./pages/authentified/EditProfile.jsx"
import EditPlanProfile from "./pages/provider/EditPlanProfile"

function App() {
  const { currentUser, loading, setCurrentUser } = useCurrentUser(null)

  if (loading) {
    return <div>Loading...</div> // Muestra algo mientras se carga el usuario
  }

  return (
    <Router>
      <div className="app-container">
        <NavBar user={currentUser} />
        <div className="content">
          <Routes>
            {/*Rutas de Client*/}
            {currentUser && currentUser.role === "CLIENT" && (
              <>
                <Route path="/other-services" element={<OtherServiceScreen />} />
                <Route path="/venues" element={<VenuesScreen />} />
                <Route path="/events" element={<MyEvents />} />
                <Route path="/create-events" element={<CreateEvents />} />
                <Route path="/event/:id" element={<EventDetails />} />
                <Route path="/payment/:id" element={<Payment />} />
                <Route path="/invitaciones" element={<Invitations />} />
                <Route path="/invitaciones/:currentEventId" element={<EventInvitations />} />
                <Route path="/invitaciones/confirmar/:invitationId" element={<ConfirmEmailInvitation />} />
              </>
            )}
            {/*Rutas de Supplier*/}
            {currentUser && currentUser.role === "SUPPLIER" && (
              <>
                <Route path="/solicitudes" element={<RequestService />} />
                <Route path="/misservicios" element={<Servicios />} />
                <Route path="/misservicios/registrar" element={<RegistrarServicio />} />
                <Route path="/misservicios/editar/:serviceType/:id" element={<EditarServicio />} />
                <Route path="/profile/plan" element={<EditPlanProfile />} />
              </>
            )}
            {/*Rutas de Admin*/}
            {currentUser && currentUser.role === "ADMIN" && (
              <>
                <Route path="/admin-events" element={<AdminEvents />} />
                <Route path="/admin-users" element={<AdminUsers />} />
                <Route path="/admin-services" element={<AdminServices />} />
              </>
            )}
            {/*Rutas de cualquier usuario autenticado*/}
            {currentUser && (
              <>
                <Route path="/chat/:id" element={<PrivateChat />} />
                <Route path="/chats" element={<ChatList />} />
                <Route path="/profile" element={<EditProfile />} />
              </>
            )}
            {/*Rutas públicas*/}
            <Route path="/" element={currentUser ? <Home user={currentUser} /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setUser={setCurrentUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terminos-y-condiciones" element={<Terms />} />
            <Route path="/faqs" element={<FAQ />} />
            <Route path="/invitaciones/registro/:invitationId" element={<RegisterInvitation />} />
          </Routes>
          <FloatingChatButton />
        </div>
        <Footer user={currentUser} />
      </div>
    </Router>
  )
}

export default App

