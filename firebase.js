import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "glitch-21eeb.firebaseapp.com",
    projectId: "glitch-21eeb",
    storageBucket: "glitch-21eeb.firebasestorage.app",
    messagingSenderId: "822100011853",
    appId: "1:822100011853:web:d2d2aac29534fd37fea504"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
