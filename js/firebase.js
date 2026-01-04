// js/firebase.js
// Firebase client-side configuration (safe for frontend use)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 Firebase configuration (public client config)
const firebaseConfig = {
  apiKey: "AIzaSyDotbygs1hMi0YsyaT0FpIWhkQk41_9q98",
  authDomain: "quizapplication-203a9.firebaseapp.com",
  projectId: "quizapplication-203a9",
  storageBucket: "quizapplication-203a9.appspot.com",
  messagingSenderId: "795332073862",
  appId: "1:795332073862:web:cb67cf62ba07ba784f3407"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Export required auth functions
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
};
