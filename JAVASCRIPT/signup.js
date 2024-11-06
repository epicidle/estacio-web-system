import { auth } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.getElementById('signupButton').addEventListener('click', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    if (password !== confirmPassword) {
        messageElement.textContent = "Passwords do not match.";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            messageElement.style.color = "green";
            messageElement.textContent = "Sign-up successful! Redirecting...";

            setTimeout(() => window.location.href = "../index.html", 1000);
        })
        .catch((error) => {
            messageElement.textContent = error.message;
        });
});