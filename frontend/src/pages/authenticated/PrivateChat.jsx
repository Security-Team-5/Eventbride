import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import {useNavigate, useParams} from "react-router-dom";
import "../../static/resources/css/PrivateChat.css"
import FloatingBackButton from "../../components/FloatingBackButton.jsx";

const PrivateChat = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState();
  const [connected, setConnected] = useState(false);

  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    fetch(`/api/chat/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => {
        console.error("Error cargando mensajes:", err)
        navigate("/chats")
      })

    fetch(`/api/users/chat/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setOtherUser(data))
      .catch((err) => console.error("Error obteniendo usuario:", err));

    const socket = () => new SockJS(`${API_BASE_URL}/ws`);
    stompClient.current = new Client({
      webSocketFactory: socket,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);
        stompClient.current.subscribe(
          `/queue/usuario-${currentUser.username}`,
          (message) => {
            const body = JSON.parse(message.body);
            setMessages((prev) => [...prev, body]);
          }
        );
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    // Auto scroll
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!connected || !stompClient.current || !stompClient.current.connected || input.length === 0) {
      return;
    }

    const message = {
      sender: currentUser.username,
      receiver: otherUser?.username,
      content: input,
    };

    stompClient.current.publish({
      destination: "/app/chat.private",
      body: JSON.stringify(message),
    });

    const newMessage = {
      sender: { username: currentUser.username },
      receiver: { username: otherUser?.username },
      content: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };


  if(!messages){
    return <div className="chat-container">
      <h1>Cargando...</h1>
    </div>
  }

  return (
    <>
      <FloatingBackButton />
      <div className="chat-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={otherUser?.profilePicture || "/placeholder.svg"}
            alt="Foto de perfil"
            className="chat-avatar"
          />
          <b style={{ marginLeft: "1%", fontSize: 18 }}>Chat con {otherUser?.username}</b>
        </div>
        <div ref={chatBoxRef} className="chat-box">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.sender.username === currentUser.username;
            const msgDate = new Date(msg.timestamp || Date.now());
            const prevMsg = messages[index - 1];
            const prevDate = prevMsg ? new Date(prevMsg.timestamp || Date.now()) : null;

            const showDateSeparator =
              !prevMsg ||
              msgDate.toDateString() !== prevDate.toDateString();

            const formatDateHeader = (date) => {
              const today = new Date();
              const yesterday = new Date();
              yesterday.setDate(today.getDate() - 1);

              if (date.toDateString() === today.toDateString()) return "Hoy";
              if (date.toDateString() === yesterday.toDateString()) return "Ayer";

              return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
              });
            };

            const formatTime = (date) =>
              date.toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              });

            return (
              <React.Fragment key={index}>
                {showDateSeparator && (
                  <div className="date-separator">
                    <span>{formatDateHeader(msgDate)}</span>
                  </div>
                )}
                <div className={`message-row ${isCurrentUser ? "user" : "other"}`}>
                  <div className={`message-bubble ${isCurrentUser ? "user" : "other"}`}>
                    <span className="sender-name">
                      {msg.sender.username || otherUser.username}:
                    </span>
                    <span className="message-text">{msg.content}</span>
                    <span className="message-time">{formatTime(msgDate)}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        <div className="input-container">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Escribe un mensaje..."
            className="message-input"
          />
          <button
            onClick={sendMessage}
            disabled={!connected}
            className="send-button"
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
};


export default PrivateChat;
