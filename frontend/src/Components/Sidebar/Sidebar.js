import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Avatar, IconButton } from '@mui/material';
import { useStateValue } from '../ContextApi/StateProvider';
import { Chat, MoreVert, DonutLarge, SearchOutlined } from "@mui/icons-material";
import SidebarChat from '../SidebarChat/SidebarChat';
import axios from "axios";

const Sidebar = () => {
  const [{ user }] = useStateValue();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/all/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user.photoURL} />
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" />
        </div>
      </div>
      
      <div className="sidebar__chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => (
          <SidebarChat key={room._id} id={room._id} name={room.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
