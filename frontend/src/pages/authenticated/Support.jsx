"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import {
  HelpCircle,
  DollarSign,
  MapPin,
  Calendar,
  CreditCard,
  Star,
  AlertTriangle,
  Shield,
} from "lucide-react"
import "../../static/resources/css/support.css"
import FloatingSupportButton from "../../components/FloatingSupportButton"

const getFAQDataByRole = (role) => {
  switch (role) {
    case "CLIENT":
      return [
        {
          category: "Pagos y facturación",
          icon: <CreditCard />,
          topics: [
            { question: "Pago rechazado / no procesado", 
              answer: "Tu pedido no está completo. Intenta el pago nuevamente desde 'Mis Eventos' o prueba otro método." 
            },
            { question: "He recibido un cargo desconocido", 
              answer: "Revisa tus eventos recientes. Si el cargo no coincide, contacta con soporte." 
            },
            { question: "¿Cómo solicito un reembolso?", 
              answer: "Accede a tu historial de reservas y selecciona 'Solicitar reembolso' si aplica." 
            },
            { question: "¿Qué métodos de pago aceptáis?", 
              answer: "Tarjeta y PayPal." 
            },
          ],
        },
        {
          category: "Reservas y eventos",
          icon: <Calendar />,
          topics: [
            { question: "¿Puedo cancelar mi reserva?", 
              answer: "Sí, dependiendo del evento y la antelación. Revisa nuestros Términos y Condiciones." 
            },
            { question: "No he recibido confirmación", 
              answer: "Comprueba tu correo o inicia sesión para verificar el estado del evento." 
            },
            { question: "El proveedor ha cancelado", 
              answer: "Recibirás un reembolso completo o podrás elegir otro proveedor." 
            },
            { question: "¿Puedo modificar mi reserva?", 
              answer: "Sí, desde el panel 'Mis eventos', si el proveedor aún no ha confirmado." 
            },
          ],
        },
        {
          category: "Cuenta y privacidad",
          icon: <Shield />,
          topics: [
            { question: "¿Cómo cambio mi contraseña?", 
              answer: "Desde tu perfil → Configuración → Cambiar contraseña." 
            },
            { question: "¿Cómo elimino mi cuenta?", 
              answer: "Ve a tu perfil y selecciona 'Deshabilitar cuenta'" 
            },
            { question: "¿Cómo actualizo mis datos?", 
              answer: "En la sección de configuración de perfil." 
            },
            { question: "¿Están seguros mis datos?", 
              answer: "Sí. Cumplimos con el GDPR y tus datos solo se comparten con proveedores si haces una solicitud." 
            },
          ],
        },
      ]

    case "SUPPLIER":
      return [
        {
          category: "Servicios y visibilidad",
          icon: <MapPin />,
          topics: [
            { question: "¿Cómo publico un servicio?", 
              answer: "Desde tu panel → Mis servicios → Crear nuevo."
            },
            { question: "¿Cómo edito un servicio ya publicado?", 
              answer: "Haz clic en el icono de edición junto al servicio en tu lista."
            },
            { question: "¿Cómo destaco mi servicio?",
              answer: "Puedes contratar un plan Premium desde la configuración de cuenta."
            },
            { question: "¿Dónde veo mis solicitudes?",
              answer: "En el menú lateral, sección 'Solicitudes'." 
            },
            { question: "¿Puedo deshabilitar un servicio?",
               answer: "Sí, haz clic en el icono de deshabilitar junto al servicio de tu lista."
            },
            {
              question: "¿Puedo cancelar un servicio que ya ha sido reservado por un cliente?",
              answer: "En casos excepcionales, si no puedes realizar un servicio previamente reservado por un cliente, deberás ponerte en contacto con el soporte técnico para gestionar la cancelación. Ten en cuenta que esta acción puede conllevar penalizaciones económicas."
            },
            
          ],
        },
        {
          category: "Planes de pago",
          icon: <DollarSign />,
          topics: [
            { question: "¿Se me cobra automáticamente el plan Premium?", 
              answer: "No, tu pagas por adelantado los meses que quieres contratar." 
            },
            { question: "¿Se me ha terminado el plan Premium que pasa con mis servicios promocionados?", 
              answer: "Una vez expirado tu plan Premium, tus servicios promocionados dejarán de estarlo." 
            },
            { question: "¿Qué pasa cuando se acaba el plan Premium y tengo más de 3 servicios?", 
              answer: "Cuando se acabe tu suscripción Premium, tendrás que deshabilitar tanto servicios hasta que llegues a los 3 permitidos por el plan Básico." 
            },
          ],
        },
        {
          category: "Cobros y comisiones",
          icon: <DollarSign />,
          topics: [
            { question: "¿Cuándo me pagan?", 
              answer: "Tras finalizar el evento, el pago se libera en un máximo de 7 días hábiles." 
            },
            { question: "¿Qué comisión cobra la plataforma?", 
              answer: "Cobramos un 2.5% sobre el importe total gestionado a través de la app." 
            },
            { question: "¿Cómo recibiré el cobro?", 
              answer: "EventBride gestionará el pago a los proveedores de manera externa a la aplicación." 
            },
          ],
        },
        {
          category: "Cuenta y reputación",
          icon: <Shield />,
          topics: [
            { question: "¿Cómo editar mis datos de proveedor?", 
              answer: "Desde tu perfil → Editar datos." 
            },
            { question: "¿Me pueden suspender la cuenta?", 
              answer: "Sí, si incumples repetidamente los términos." 
            },
          ],
        },
        {
          category: "Problemas técnicos",
          icon: <AlertTriangle />,
          topics: [
            { question: "No puedo subir imágenes", 
              answer: "Asegúrate de que no superen 5MB y estén en formato .jpg o .png." 
            },
            { question: "No puedo acceder al panel", 
              answer: "Prueba cerrando sesión y volviendo a entrar. Si el error continúa, contacta soporte." 
            },
          ],
        },
      ]

    default:
      return [
        {
          category: "General",
          icon: <HelpCircle />,
          topics: [
            { question: "¿Qué es EventBride?", 
              answer: "Una plataforma para conectar usuarios con proveedores de eventos." 
            },
          ],
        },
      ]
  }
}

function Support() {
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Error al parsear user:", e)
      }
    }
  }, [])

  const normalizedRole = user?.role?.trim()?.toUpperCase()
  const data = getFAQDataByRole(normalizedRole)

  const goToStep = (stepNumber) => setStep(stepNumber)
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setStep(2)
  }
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setStep(3)
  }

  if (!user) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando contenido de ayuda...</p>
  }

  return (
    <div className="faq-wizard-container">
      <FloatingSupportButton/>
      <h1 className="faq-title">Atención al cliente</h1>

      <div className="wizard-steps">
        <span className={step >= 1 ? "active" : ""}>Problema</span>
        <span className={step >= 2 ? "active" : ""}>Detalles</span>
        <span className={step === 3 ? "active" : ""}>Respuesta</span>
      </div>

      {step === 1 && (
        <div className="step step-categories">
          {data.map((cat, index) => (
            <button key={index} onClick={() => handleCategorySelect(cat)} className="faq-btn">
              <span className="faq-icon">{cat.icon}</span>
              {cat.category}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="step step-topics">
          <button onClick={() => goToStep(1)} className="back-btn">← Volver</button>
          {selectedCategory.topics.map((topic, index) => (
            <button key={index} onClick={() => handleTopicSelect(topic)} className="faq-btn topic-btn">
              {topic.question}
            </button>
          ))}
        </div>
      )}

      {step === 3 && (
        <div className="step step-answer">
          <button onClick={() => goToStep(2)} className="back-btn">← Volver</button>
          <h2>{selectedTopic.question}</h2>
          <p>{selectedTopic.answer}</p>
          {selectedTopic.details && (
            <ul>
              {selectedTopic.details.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          )}
          {selectedTopic.conclusion && <p>{selectedTopic.conclusion}</p>}
        </div>
      )}
    </div>
  )
}

Support.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
    profilePicture: PropTypes.string,
    username: PropTypes.string,
    plan: PropTypes.string,
  }),
}

export default Support
