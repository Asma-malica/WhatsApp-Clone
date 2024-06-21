import React from 'react'
import {Button} from "@mui/material"
import { auth,provider } from '../../firebase' ;
import { signInWithPopup } from 'firebase/auth';
import "./Login.css"
import { useStateValue } from '../ContextApi/StateProvider';
import { actionTypes } from '../ContextApi/reducer';

const Login = () => {
const[state,dispatch] = useStateValue();

console.log(state);
 const signIn = ()=> {
    signInWithPopup(auth,provider)
    .then((result)=>{
      dispatch({
        type:actionTypes.SET_USER,
        user:result.user,
      })  
    }).catch((err)=>{
        alert(err.message);
    });
 }



  return (
    <div className = 'login'>
        <div className='login__container'>
            <img 
            src = 'https://www.logo.wine/a/logo/WhatsApp/WhatsApp-Logo.wine.svg'
            alt = "logo" />
            <div className='login__text'>
                <h1>Sign in to WhatsApp</h1>
            </div>
            <Button onClick={signIn}> Sign in with google </Button>

        </div>

    </div>
  )
}

export default Login