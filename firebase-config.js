/**
 * firebase-config.js
 * Konfigurasi Utama Firebase SDK untuk PINTAR@Sphere
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Gantikan dengan kunci API Firebase Projek anda
const firebaseConfig = {
  apiKey: "AIzaSyBHuWIV-V65gyxxnWuP_qAIGljvoO5sJcs",
  authDomain: "pintar-sphere.firebaseapp.com",
  projectId: "pintar-sphere",
  storageBucket: "pintar-sphere.firebasestorage.app",
  messagingSenderId: "829082367809",
  appId: "1:829082367809:web:50defae0288fee399cd3c0",
  measurementId: "G-WLE5FH87LE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
};
