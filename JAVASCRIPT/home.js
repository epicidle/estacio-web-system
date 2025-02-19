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

let lastUnreadCount = 0; // Variable to track the count of unread notifications

async function checkUnreadNotifications() {
    const response = await fetch('https://donadillo-web-system-server.onrender.com/logs');
    const logs = await response.json();
    const logEntries = logs.data || logs;

    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const unreadLogs = logEntries.filter(log => {
        const content = JSON.parse(log.content || '{}');
        return content.email === currentUserEmail && localStorage.getItem(log.uuid) !== "read";
    });

    const currentUnreadCount = unreadLogs.length;

    // Display red dot if there are unread notifications
    document.getElementById('redDot').style.display = currentUnreadCount > 0 ? 'block' : 'none';

    // Show popup only if there are new unread notifications since the last check
    if (currentUnreadCount > lastUnreadCount) {
        showNotificationPopup();
    }

    // Update last unread count
    lastUnreadCount = currentUnreadCount;
}

// Function to show popup with animation and auto-hide after 3 seconds
function showNotificationPopup() {
    const popup = document.getElementById('notificationPopup');
    popup.classList.add('show'); // Add class to slide it in

    // Remove the 'show' class after 3 seconds to hide the popup
    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// Check for unread notifications at intervals
setInterval(checkUnreadNotifications, 500);
checkUnreadNotifications();