"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  user: string;
  text: string;
}

let socket: Socket;

export default function Chat() {
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<Message[]>([]);
  const [user, setUser] = useState<string>("");

  useEffect(() => {
    // Conectar al servidor Socket.io
    socket = io();

    // Recibir mensajes de otros usuarios
    socket.on("receive-message", (message: Message) => {
      setChat((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message || !user) return;

    const msg: Message = { user, text: message };
    // Enviar el mensaje al servidor
    socket.emit("send-message", msg);
    setChat((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full p-2 border"
          placeholder="Enter your username"
        />
      </div>
      <div className="h-64 border p-4 overflow-y-scroll">
        {chat.map((msg, index) => (
          <div key={index} className="my-2">
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-2 border mt-4"
        placeholder="Type your message..."
      />
      <button
        onClick={sendMessage}
        className="w-full bg-blue-500 text-white p-2 mt-2"
      >
        Send
      </button>
    </div>
  );
}
