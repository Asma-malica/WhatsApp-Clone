import React, { useEffect, useState } from 'react';
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from "@mui/icons-material";
import axios from "axios";
import { useStateValue } from "../ContextApi/StateProvider";
import { useParams } from "react-router-dom";


const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    if (roomId) {
      axios.get(`http://localhost:5000/room/${roomId}`).then((response) => {
        setRoomName(response.data.name);
        setUpdatedAt(response.data.updatedAt);
      });
      axios.get(`http://localhost:5000/messages/${roomId}`).then((response) => {
        setMessages(response.data);
      });
    }
  }, [roomId]);
  
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(input);
    if (!input) {
      return;
    }

    await axios.post("http://localhost:5000/messages/new", {
      message: input,
      name: user.displayName,
      timestamp: new Date(),
      uid: user.uid,
      roomId: roomId,
    });

    setInput("");
  };

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`} />
        <div className='chat__headerInfo'>
          <h3>{roomName ? roomName : "Welcome to Whatsapp"}</h3>
          <p>{updatedAt ? `Last updated at ${new Date(updatedAt).toString().slice(0, 25)}` : "Click on any group"}</p>
        </div>

        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <IconButton>
            <AttachFile />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            className={`chat__message ${message.uid === user.uid && "chat__receiver"}`}
            key={message?.id ? message?.id : index}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp).toString().slice(0, 25)}
            </span>
          </p>
        ))}
      </div>

      <div className='chat__footer'>
        <InsertEmoticon />
        <form onSubmit={sendMessage}>
          <input
            placeholder='Type a message'
            onChange={e => setInput(e.target.value)}
            value={input}
          />
          <button type="submit">Send a message</button>
        </form>
      </div>
    </div>
  );
};

export default Chat
