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
            return (
              <li key={index} className="chatlist-item">
                <Link to={`/chat/${otherUser.id}`}>
                  <div className="chatlist-info">
                    <strong>{otherUser.username}</strong>
                    <p>{chat.content.slice(0, 40)}...</p>
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
