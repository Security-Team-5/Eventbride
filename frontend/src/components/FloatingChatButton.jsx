import {Link, useLocation} from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "../static/resources/css/FloatingChatButton.css"

const FloatingChatButton = () => {
  const location = useLocation();

  // Detectar si la URL es /chat/loquesea
  const hideOnChatPage = /^\/chat\/\d+$/.test(location.pathname);

  if (hideOnChatPage) return null;

  return (
    <Link to="/chats" className="floating-chat-button" title="Ver mis chats">
      <MessageCircle size={24} />
    </Link>
  );
};

export default FloatingChatButton;
