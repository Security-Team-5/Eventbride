import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import "../static/resources/css/Footer.css"

function Footer() {
    return (
        <div className="footer-wrapper">
            <footer className="site-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>EventBride</h3>
                        <p>En Eventbride transformamos tus momentos especiales en celebraciones únicas y sin preocupaciones.</p>
                        <div className="social-icons">
                            <Link to="https://www.instagram.com/eventbride_svq/">
                                <Instagram size={18} />
                            </Link>
                            <Link to="#">
                                <Linkedin size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h3>Enlaces Rápidos</h3>
                        <ul>
                            <li>
                                <Link to="/">Inicio</Link>
                            </li>
                            <li>
                                <Link to="/venues">Venues</Link>
                            </li>
                            <li>
                                <Link to="/other-services">Servicios</Link>
                            </li>
                            <li>
                                <Link to="/events">Eventos</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Contacto</h3>
                        <ul className="contact-info">
                            <li>
                                <MapPin size={16} /> Escuela Superior de Ingeniería Informática, Sevilla
                            </li>
                            <li>
                                <Phone size={16} /> +34 123 456 789
                            </li>
                            <li>
                                <Mail size={16} /> eventbride6@gmail.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p style={{ color: "#a0a0a0" }}>© {new Date().getFullYear()} Eventbride. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    )
}

export default Footer

