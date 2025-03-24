import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";
import "../static/resources/css/PrivateChat.css"

const PrivateChat = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const jwt = localStorage.getItem("jwt");
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUser, setOtherUser] = useState();
  const [connected, setConnected] = useState(false);

  const stompClient = useRef(null);
  const chatBoxRef = useRef(null);

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
      .catch((err) => console.error("Error cargando mensajes:", err));

    fetch(`/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setOtherUser(data))
      .catch((err) => console.error("Error obteniendo usuario:", err));

    const socket = () => new SockJS("http://localhost:8080/ws");
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
    if (!connected || !stompClient.current || !stompClient.current.connected) {
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

  return (
    <div className="chat-container">
      <div ref={chatBoxRef} className="chat-box">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender.username === currentUser.username;
          return (
            <div
              key={index}
              className={`message-row ${isCurrentUser ? "user" : "other"}`}
            >
              <div className={`message-bubble ${isCurrentUser ? "user" : "other"}`}>
                <span className="sender-name">
                  {msg.sender.username || otherUser.username}:
                </span>
                <span className="message-text">{msg.content}</span>
              </div>
            </div>
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
  );
};


export default PrivateChat;
