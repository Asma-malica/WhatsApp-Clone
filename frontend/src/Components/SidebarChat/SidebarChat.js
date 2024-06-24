import React, { useEffect, useState } from 'react'
import "./SidebarChat.css"
import {Avatar} from "@mui/material"

const SidebarChat = ({addNewChat}) => {
    const [seed,setSeed] = useState("");

    useEffect(()=>{
        setSeed(Math.floor(Math.random()*5000))
    },[])

  return !addNewChat ? (
    <div className = "sidebarChat">
        <Avatar src = {"https://api.dicebear.com/9.x/adventurer/svg?${seed}"}/>
        <div className='sidebarChat__info'>
            <h2>Asma</h2>
        </div>
    </div>
  ):(
    <div className='sidebarChat'>
        <h2>Add New Chat</h2>
    </div>
  )
}

export default SidebarChat