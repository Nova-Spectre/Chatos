import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001/");

    socket.on("connect", () => {
      console.log("Connected to Server");
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    setSocket(socket);

    socket.emit("statusUpdate", "online");

    socket.on("userStatus", (data) => {
      console.log("User Status Update:", data);
    });

    window.addEventListener("beforeunload", () => {
      socket.emit("statusUpdate", "offline");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    socket.emit("sendMessage", inputValue);
    setInputValue("");
  };

  return (
    <div>
      <h1>Chat App</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
