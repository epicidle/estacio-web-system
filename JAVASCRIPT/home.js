import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('currentUserEmail');
        window.location.href = "../index.html";
    }).catch((error) => {
        console.error('Error during sign out:', error);
    });
});

// Check notifications
async function checkUnreadNotifications() {
    const response = await fetch('https://donadillo-web-system-server.onrender.com/logs');
    const logs = await response.json();
    const logEntries = logs.data || logs;

    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const hasUnread = logEntries.some(log => {
        const content = JSON.parse(log.content || '{}');
        return content.email === currentUserEmail && localStorage.getItem(log.uuid) !== "read";
    });

    // Display red dot if there are unread notifications
    document.getElementById('redDot').style.display = hasUnread ? 'block' : 'none';
}

checkUnreadNotifications();