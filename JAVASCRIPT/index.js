import { auth } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading icon
            statusIcon.className = 'fa fa-spinner fa-spin';

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    const timestamp = new Date().toISOString();
                    console.log('Login successful, sending data to Node.js server and webhook');

                    localStorage.setItem('currentUserEmail', email);

                    return fetch("https://donadillo-web-system-server.onrender.com/login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: email,
                            timestamp: timestamp,
                            message: "User logged in successfully."
                        })
                    });
                })
                .then(response => {
                    if (!response.ok) throw new Error('Network response was not ok');

                    console.log('Data sent successfully to Node.js server');
                    statusIcon.className = 'fa fa-check';

                    setTimeout(() => window.location.href = "HTML/home.html", 500);
                })
                .catch((error) => {
                    loginStatus.textContent = 'Login failed. Please check your Email and Password or Sign Up. REFRESHING THE PAGE';
                    loginStatus.style.color = 'red';
                    console.error('Error sending data:', error);

                    //setTimeout(() => location.reload(), 4000);
                });
        });
    }    
});