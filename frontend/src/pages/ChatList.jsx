import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../static/resources/css/ChatList.css";

const ChatList = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetch("/api/chat/conversations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setChats(data))
      .catch((err) => console.error("Error al cargar conversaciones:", err));
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { day: "2-digit", month: "short" };
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${date.toLocaleDateString("es-ES", options)}, ${hour}:${minute}`;
  };

  return (
    <div className="chatlist-container">
      <h2>Mis chats</h2>
      {chats.length === 0 ? (
        <p>No tienes chats activos.</p>
      ) : (
        <ul className="chatlist">
          {chats.map((chat, index) => {
            const otherUser =
              chat.sender.username === currentUser.username
                ? chat.receiver
                : chat.sender;
            const isMine = chat.sender.username === currentUser.username;
            const senderDisplay = isMine ? "Yo" : chat.sender.username;

            return (
              <li key={index} className="chatlist-item">
                <Link to={`/chat/${otherUser.id}`} className="chat-link">
                  <img
                    src={otherUser.profilePicture}
                    alt={otherUser.username}
                    className="chat-avatar"
                  />
                  <div className="chat-info">
                    <div className="chat-header">
                      <strong className="chat-username">{otherUser.username}</strong>
                      <span className="chat-time">{formatDate(chat.timestamp)}</span>
                    </div>
                    <p className="chat-snippet">
                      <strong>{senderDisplay}:</strong> {chat.content.slice(0, 40)}...
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
