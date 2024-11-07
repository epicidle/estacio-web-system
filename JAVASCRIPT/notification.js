import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Reference to the HTML element where notifications will be displayed
const notificationList = document.getElementById('notificationList');

// Asynchronous function to fetch and display logs from the server
const fetchLogs = async () => {
    try {
        // Send request to the server to retrieve logs
        const response = await fetch('https://donadillo-web-system-server.onrender.com/logs');
        if (!response.ok) throw new Error('Failed to fetch logs'); // Error handling if response fails
        const logs = await response.json(); // Parse logs from JSON format
        const logEntries = logs.data || logs; // Access log entries directly or from the data field

        // Retrieve current user’s email from local storage
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        if (!currentUserEmail) {
            notificationList.innerHTML = '<li>Please log in to view your logs.</li>';
            return;
        }

        // Filter logs specific to the current user based on email
        const userLogs = logEntries.filter(log => {
            try {
                const content = JSON.parse(log.content || '{}');
                return content.email === currentUserEmail;
            } catch (error) {
                console.error('Error parsing log content:', error);
                return false;
            }
        });

        // Sort logs by timestamp in descending order (latest first)
        userLogs.sort((a, b) => new Date(b.content.timestamp) - new Date(a.content.timestamp));

        userLogs.forEach(log => localStorage.setItem(log.uuid, "read"));

        // Clear any existing notifications
        notificationList.innerHTML = '';

        if (userLogs.length === 0) {
            notificationList.innerHTML = '<li>No logs available for this user.</li>';
            return;
        }

        // Loop through each user log and display it in the notification list
        userLogs.forEach(log => {
            const content = JSON.parse(log.content);
            const timestamp = new Date(content.timestamp).toLocaleString('en-US', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true
            });
            const listItem = document.createElement('li'); // Create list item for each log entry
            const icon = document.createElement('i');

            // Check if log entry is a location search or a login, and add respective icon and text
            if (content.locationQuery) {
                icon.className = 'fa fa-search';
                listItem.appendChild(icon);
                listItem.appendChild(document.createTextNode(` SEARCHED LOCATION: ${content.locationQuery}, ${timestamp}`));
            } else {
                icon.className = 'fa fa-sign-in-alt';
                listItem.appendChild(icon);
                listItem.appendChild(document.createTextNode(` LOGGED IN: ${timestamp}`));
            }

            notificationList.prepend(listItem); // Prepend to place the latest notification at the top
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        notificationList.innerHTML = '<li>Error fetching logs. Please try again later.</li>';
    }
};

fetchLogs();

// Logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('currentUserEmail');
        window.location.href = "../index.html";
    }).catch((error) => {
        console.error('Error during sign out:', error);
    });
});