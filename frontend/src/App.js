import React from 'react'
import "./App.css";
import Login from "./Components/Login/Login" ;
import { useStateValue } from './Components/ContextApi/StateProvider';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Chat from './Components/Chat/Chat';
import Sidebar from './Components/Sidebar/Sidebar';


const App = () => {
const[{user}] = useStateValue();

  return (
    <div className='app'>
      {!user ?
      <Login/>:
      <div className='app__body'>
        <Router>
          <Sidebar/>
          <Routes>
            <Route path = "/" element = {<Chat />}/>
            <Route path = "/rooms/:roomId" element = {<Chat />}/>

          </Routes>
        </Router>
        </div>
}
    </div>
  )
}

export default App