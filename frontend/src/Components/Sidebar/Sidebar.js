import React from 'react';
import "./Sidebar.css";
import { Avatar, IconButton } from '@mui/material';
import { useStateValue } from '../ContextApi/StateProvider';
import { Chat,MoreVert,DonutLarge, SearchOutlined } from "@mui/icons-material";

const Sidebar = () => {
  const[{user}] = useStateValue();

  return (
    <div className='sidebar'>
        <div className='sidebar__header'>
            <Avatar
            src = {user.photoURL}
            />

            <div className='sidebar__headerRight'>
                <IconButton>
                    <DonutLarge/>
                </IconButton>

                <IconButton>
                    <Chat />
                </IconButton>

                <IconButton>
                    <MoreVert/>
                </IconButton>
            </div>
        </div>
    
    <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
            <SearchOutlined/>
            <input placeholder='Search or start new chat'/>
        </div>
    </div>
    <div className='sidebar__chats'>
        
    </div>
    </div>
  )
}

export default Sidebar