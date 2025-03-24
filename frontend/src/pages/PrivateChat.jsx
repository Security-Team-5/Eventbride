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
  const [otherUser, setOtherUser] = useState()
  const [connected, setConnected] = useState(false);

  const stompClient = useRef(null); // Referencia persistente

  useEffect(() => {
    fetch(`/api/chat/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los mensajes");
        }
        return response.json();
      })
      .then(data => {
        setMessages(data);
      })
      .catch(error => {
        console.error("Error obteniendo mensajes:", error);
      });

    fetch(`/api/users/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}`
      },
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener al usuario");
        }
        return response.json();
      })
      .then(data => {
        setOtherUser(data);
      })
      .catch(error => {
        console.error("Error obteniendo mensajes:", error);
      });

    const socket = () => new SockJS("http://localhost:8080/ws");

    stompClient.current = new Client({
      webSocketFactory: socket,
      connectHeaders: {
        Authorization: `Bearer ${jwt}`,
      },
      debug: (str) => console.log(str),
      onConnect: () => {
        setConnected(true);
        stompClient.current.subscribe(`/queue/usuario-${currentUser.username}`, (message) => {
          const body = JSON.parse(message.body);
          console.log(body)
          setMessages((prev) => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error", event);
      },
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current && stompClient.current.active) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    if (!connected || !stompClient.current || !stompClient.current.connected) {
      console.error("STOMP client not connected");
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
      sender: {
        username: currentUser.username
      },
      receiver: {
        username:otherUser?.username
      },
      content: input,
    }

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div style={{margin: "200px"}}>
      <div style={{ height: 300, overflow: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages?.map((msg, index) => (
          <div key={index}><b>{msg.sender.username}:</b> {msg.content}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe un mensaje"
      />
      <button onClick={sendMessage} disabled={!connected}>Enviar</button>
    </div>
  );
};

export default PrivateChat;
