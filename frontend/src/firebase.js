import {initializeApp} from "firebase/app"
import {getAuth,GoogleAuthProvider} from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAkMCvPZk22JNxkrCAhzj7zzexTVgPR5Do",
    authDomain: "mern-whatsapp-2b780.firebaseapp.com",
    projectId: "mern-whatsapp-2b780",
    storageBucket: "mern-whatsapp-2b780.appspot.com",
    messagingSenderId: "118456110749",
    appId: "1:118456110749:web:dd16fe182428cd1ec58e74",
    measurementId: "G-R0CWE2GPPW"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
export {app,auth,provider};

