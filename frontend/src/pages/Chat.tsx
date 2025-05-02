import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
const ENDPOINT = "http://localhost:3000";
export const Chat: React.FC = () => {
  const { access_token: token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io(ENDPOINT, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on("connect_error", (error: Error) => {
      console.error("Connection error:", error.message);
    });

    newSocket.on("userIdentified", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Sunucuya kullanıcıyı tanımla
    newSocket.emit("identifyUser", "1"); //
    // Clean up on component unmount
    return () => {
      newSocket.disconnect();
      newSocket.off("userIdentified");
    };
  }, [token]);

  return (
    <div className="text-red-400">
      Helo
      {messages?.map((message, index) => (
        <li key={index}>{message.first_name}</li>
      ))}
    </div>
  );
};
