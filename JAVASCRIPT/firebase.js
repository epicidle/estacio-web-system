import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyA_k8-qZF5CxQRjljXWdDVghUfzIhy_KJM",
    authDomain: "sia101-midtermoutput-galaroza.firebaseapp.com",
    projectId: "sia101-midtermoutput-galaroza",
    storageBucket: "sia101-midtermoutput-galaroza.appspot.com",
    messagingSenderId: "834703849262",
    appId: "1:834703849262:web:4eee6c4e9f9a74ad876cbf",
    measurementId: "G-6W3PTRCY9V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };