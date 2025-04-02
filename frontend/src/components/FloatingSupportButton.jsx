import { Link } from "react-router-dom"
import { Headset } from "lucide-react"
import "../static/resources/css/FloatingSupportButton.css"
import { useEffect, useState } from "react"

const FloatingSupportButton = () => {

  const jwt = localStorage.getItem("jwt")

  const [adminId, setadminId] = useState(null)

  useEffect(() => {
    fetch("/api/users/getAdmin", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setadminId(data))
      .catch((err) => console.error("Error al cargar conversaciones:", err));
  }, [])

  if(!jwt) return null;
  

  return (
     adminId && (<Link
      to={"/chat/"+adminId}
      className="floating-support-button"
      title="Contactar con soporte"
      aria-label="Botón para contactar con el soporte"
    >
      <Headset size={24} />
    </Link>)
  )
}

export default FloatingSupportButton
