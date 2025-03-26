import {Link, useLocation} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../static/resources/css/FloatingChatButton.css"

const FloatingBackButton = () => {
  const location = useLocation();

  return (
    <Link to="/chats" className="floating-back-button" title="Volver a chats">
      <ArrowLeft size={24} />
    </Link>
  );
};

export default FloatingBackButton;
