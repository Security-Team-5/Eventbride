"use client"

import { useState } from "react"
import PropTypes from "prop-types"
// Añadir los nuevos imports para los iconos
import {
  Scroll,
  HelpCircle,
  DollarSign,
  MapPin,
  Calendar,
  CreditCard,
  PartyPopper,
  MessageSquare,
  Star,
  AlertTriangle,
  Shield,
  FileEdit,
} from "lucide-react"
import "../../static/resources/css/faqs.css"

const faqs = [
  {
    question: "¿Sois un Wedding Planner?",
    answer:
      "No, no somos un Wedding Planner. Somos una plataforma que te conecta con un extenso catálogo de proveedores especializados en eventos. Desde el lugar de la celebración hasta el catering y la música, nosotros te facilitamos el contacto, pero la organización del evento queda en tus manos.",
    icon: <HelpCircle className="section-icon" />,
  },
  {
    question: "¿Es gratuito el uso de la plataforma?",
    answer:
      "Registrarse y explorar nuestra plataforma es completamente gratuito. Sin embargo, cobramos una pequeña comisión del 2% sobre el precio final del evento por facilitar la conexión con proveedores y optimizar el tiempo de búsqueda y organización.",
    icon: <DollarSign className="section-icon" />,
  },
  {
    question: "¿En qué zonas operáis?",
    answer:
      "Actualmente, trabajamos con proveedores exclusivamente en la provincia de Sevilla. No obstante, estamos trabajando para expandirnos a otras zonas de España en el futuro.",
    icon: <MapPin className="section-icon" />,
  },
  {
    question: "¿Puedo cancelar mi reserva?",
    answer: "Sí, ofrecemos la posibilidad de cancelación gratuita si se realiza con la suficiente antelación:",
    details: [
      "Bodas: Cancelación gratuita hasta 5 meses antes del evento.",
      "Bautizos: Cancelación gratuita hasta 2 meses antes del evento.",
      "Comuniones: Cancelación gratuita hasta 3 meses antes del evento.",
    ],
    conclusion:
      "Si el proveedor cancela el servicio, recibirás el reembolso completo del pago realizado. Sin embargo, los gastos de gestión de la aplicación no serán reembolsados en ningún caso.",
    icon: <Calendar className="section-icon" />,
  },
  {
    question: "¿Cuál es el sistema de pago?",
    answer:
      "Las transacciones se realizan a través de pasarelas de pago seguras, como PayPal, garantizando un proceso confiable entre usuarios y proveedores. Eventbride solo actúa como intermediario en la gestión del pago, sin intervenir en la prestación del servicio.",
    icon: <CreditCard className="section-icon" />,
  },
  {
    question: "¿Qué tipo de eventos puedo organizar en la plataforma?",
    answer:
      "Actualmente, nos especializamos en bodas, bautizos y comuniones. Sin embargo, estamos evaluando la posibilidad de incluir otros tipos de eventos en el futuro.",
    icon: <PartyPopper className="section-icon" />,
  },
  {
    question: "¿Cómo puedo contactar con un proveedor?",
    answer:
      "Puedes ponerte en contacto con los proveedores directamente a través de nuestra plataforma, donde encontrarás información detallada sobre sus servicios, disponibilidad y tarifas. Además, puedes leer valoraciones de otros usuarios para tomar una mejor decisión.",
    icon: <MessageSquare className="section-icon" />,
  },
  {
    question: "¿Cómo funcionan las valoraciones de proveedores?",
    answer:
      "Después de cada evento, los usuarios pueden dejar una valoración y reseña sobre el servicio recibido. Estas opiniones ayudan a otros usuarios a elegir los mejores proveedores y permiten mantener un alto nivel de calidad en la plataforma. Nos reservamos el derecho de moderar o eliminar comentarios que incumplan nuestras políticas.",
    icon: <Star className="section-icon" />,
  },
  {
    question: "¿Qué sucede si un proveedor no cumple con el servicio contratado?",
    answer:
      "Eventbride no interviene en la resolución de disputas entre usuarios y proveedores. En caso de incumplimiento, los usuarios deberán gestionar las reclamaciones directamente con el proveedor. Como medida de protección, eliminaremos de la plataforma a los proveedores que incumplan reiteradamente sus compromisos.",
    icon: <AlertTriangle className="section-icon" />,
  },
  {
    question: "¿Mis datos personales están protegidos?",
    answer:
      "Sí, nos comprometemos a cumplir con la legislación vigente en materia de protección de datos. Tu información personal será tratada con confidencialidad y seguridad, y solo será compartida con los proveedores cuando sea necesario para la organización del evento.",
    icon: <Shield className="section-icon" />,
  },
  {
    question: "¿Se pueden modificar los términos y condiciones?",
    answer:
      "Nos reservamos el derecho de actualizar nuestros términos y condiciones cuando sea necesario. Cualquier modificación será publicada en la plataforma y entrará en vigor de manera inmediata. Te recomendamos revisar periódicamente nuestras políticas para estar informado de cualquier cambio.",
    icon: <FileEdit className="section-icon" />,
  },
]

function AccordionItem({ question, answer, details, conclusion, icon, isOpen, toggleOpen }) {
  return (
    <section className="terms-section faq-section">
      <div className={`section-header faq-header ${isOpen ? "open" : ""}`} onClick={toggleOpen}>
        {icon}
        <h2>{question}</h2>
        <span className="toggle-icon">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="section-content">
          <p>{answer}</p>
          {details && (
            <ul className="terms-list">
              {details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          )}
          {conclusion && <p>{conclusion}</p>}
        </div>
      )}
    </section>
  )
}

AccordionItem.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string),
  conclusion: PropTypes.string,
  icon: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="terms-container">
      <div className="terms-header">
        <Scroll className="terms-icon" size={36} />
        <h1>Preguntas Frecuentes</h1>
      </div>

      <div className="terms-content">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            details={faq.details}
            conclusion={faq.conclusion}
            icon={faq.icon}
            isOpen={openIndex === index}
            toggleOpen={() => toggleFaq(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default FAQ

