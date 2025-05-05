import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCvApu217PQVu5I3ED1_IGXxscPk0zd_q4",
  authDomain: "aiinterview-daad6.firebaseapp.com",
  projectId: "aiinterview-daad6",
  storageBucket: "aiinterview-daad6.firebasestorage.app",
  messagingSenderId: "398993523975",
  appId: "1:398993523975:web:b4649f9ae035e52e5971a2",
  measurementId: "G-5Z28DJ91Z1"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp() ;
export const auth = getAuth(app);
export const db = getFirestore(app);