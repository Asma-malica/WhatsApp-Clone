import React, { useEffect, useState } from 'react';
import "./Chat.css";
import { Avatar, IconButton } from "@mui/material";
import { AttachFile, InsertEmoticon, Mic, SearchOutlined } from "@mui/icons-material"; // Removed MoreVert
import axios from "axios";
import { useStateValue } from "../ContextApi/StateProvider";
import { useParams } from "react-router-dom";
import Pusher from "pusher-js";
// import 'emoji-mart/dist/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [{ user }] = useStateValue();
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [updatedAt, setUpdatedAt] = useState(new Date());
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    // Function to fetch room details and messages
    const fetchRoomDetails = async () => {
      try {
        const roomResponse = await axios.get(`http://localhost:5000/room/${roomId}`);
        setRoomName(roomResponse.data.name);
        setUpdatedAt(roomResponse.data.updatedAt);

        const messagesResponse = await axios.get(`http://localhost:5000/messages/${roomId}`);
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error("Error fetching room details and messages:", error);
      }
    };

    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher("9221b5c9e1102198e67b", {
      cluster: "ap2",
    });

    // Subscribe to the channel
    const channel = pusher.subscribe("messages");
    
    // Bind to 'inserted' event to receive new messages
    channel.bind("inserted", function (newMessage) {
      setMessages(prevMessages => {
        if (!prevMessages.some(message => message._id === newMessage._id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });

    // Clean up function
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }

    try {
      // Send message to server
      const response = await axios.post("http://localhost:5000/messages/new", {
        message: input,
        name: user.displayName,
        timestamp: new Date(),
        uid: user.uid,
        roomId: roomId,
      });

      setInput(""); // Clear input field
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setInput(input + emoji.native); // Append selected emoji to input field
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

          <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            <InsertEmoticon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message, index) => (
          <p
            className={`chat__message ${message.uid === user.uid ? "chat__receiver" : ""}`}
            key={message._id ? message._id : index}>
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp).toString().slice(0, 25)}
            </span>
          </p>
        ))}
      </div>

      {showEmojiPicker && (
        <div className="emojiPicker">
          <Picker onSelect={handleEmojiSelect} />
        </div>
      )}

      {roomName && (
        <div className='chat__footer'>
          <form onSubmit={sendMessage}>
            <input
              placeholder='Type a message'
              onChange={e => setInput(e.target.value)}
              value={input}
            />
            <button type="submit">Send</button>
          </form>
          <Mic />
        </div>
      )}
    </div>
  );
};

export default Chat;
