import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import "../static/resources/css/FloatingChatButton.css"

const FloatingChatButton = () => {
  return (
    <Link to="/chats" className="floating-chat-button" title="Ver mis chats">
      <MessageCircle size={24} />
    </Link>
  );
};

export default FloatingChatButton;
