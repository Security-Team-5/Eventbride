import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useParams } from "react-router-dom";

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
    <div style={styles.container}>
      <div ref={chatBoxRef} style={styles.chatBox}>
              {messages.map((msg, index) => {
          const isCurrentUser = msg.sender.username === currentUser.username;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  backgroundColor: isCurrentUser ? "#d4f8c6" : "#f0f0f0",
                  borderRadius: "16px",
                  padding: "10px 14px",
                  maxWidth: "60%",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.85em",
                    color: "#444",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {msg.sender.username || otherUser.username}:
                </span>
                <span style={{ fontSize: "1em", color: "#333" }}>{msg.content}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={styles.inputContainer}>
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
          style={styles.input}
        />
        <button onClick={sendMessage} disabled={!connected} style={styles.button}>
          Enviar
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "100px auto",
    border: "1px solid #ccc",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "80vh",
    backgroundColor: "#fff",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    backgroundColor: "#fafafa",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "12px",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    fontSize: "1em",
    borderRadius: "24px",
    border: "none",
    backgroundColor: "#111",
    color: "white",
    marginRight: "10px",
    outline: "none",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "24px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default PrivateChat;
