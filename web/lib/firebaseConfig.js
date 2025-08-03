import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add your own Firebase configuration from your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyBL8Ow_JfdpBg6jBv_1GqzjQrrofRdQmes",
  authDomain: "cinegum-com.firebaseapp.com",
  projectId: "cinegum-com",
  storageBucket: "cinegum-com.appspot.com",
  messagingSenderId: "137389099636",
  appId: "1:137389099636:web:eeeed95885e01802a9df21",
  measurementId: "G-YBQETG45RQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
