import React from "react";
import { useState } from "react";
import "./styles/App.css";
import MessageBox from "./components/MessageBox";
import MessageInput from "./components/Input";
import randomName from "./components/RandomName";
import randomColor from "./components/RandomColor";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState({
    username: randomName(),
    color: randomColor(),
  });
  const [connection, setConnection] = useState(null);

  const initializeConnection = () => {
    const newConnection = new window.Scaledrone("UyBgR0bjJplXTzhw", {
      data: sender,
    });
    newConnection.on("open", (error) => {
      if (error) {
        console.error(error);
      } else {
        const updatedSender = { ...sender };
        updatedSender.id = newConnection.clientId;
        setSender(updatedSender);
      }
    });
    const room = newConnection.subscribe("observable-filipmesaric");
    room.on("data", (data, sender) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender, messageText: data },
      ]);
    });
    setConnection(newConnection);
  };

  useState(() => {
    initializeConnection();
  }, []);

  const onSendMessage = (message) => {
    connection.publish({
      room: "observable-filipmesaric",
      message,
    });
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Welcome to FM Chat!</h1>
      </div>
      <MessageBox messages={messages} currentSender={sender} />
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default Chat;
