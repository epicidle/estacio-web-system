import { auth } from './firebase.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Initialize the map
const map = L.map('map').setView([11.7753, 124.8861], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let userLat, userLng;

//get user location
const getUserLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                map.setView([userLat, userLng], 15);
                L.marker([userLat, userLng]).addTo(map).bindPopup('You are currently here!').openPopup();
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please ensure that your GPS is enabled. The nearest detected location will be shown instead.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
};

// Set up the geocoder for map searches
const geocoder = L.Control.geocoder({ defaultMarkGeocode: false, collapsed: false })
    .on('markgeocode', function (e) {
        const latlng = e.geocode.center;
        L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
        map.setView(latlng, 13);
    }).addTo(map);

// Hide the geocoder control initially
geocoder._container.style.display = 'none';

// Create and hide a loading indicator
const loadingIndicator = document.createElement('div');
loadingIndicator.id = 'loading';
loadingIndicator.style.display = 'none';
loadingIndicator.innerText = 'Loading...';
document.body.appendChild(loadingIndicator);

document.getElementById('my-location').addEventListener('click', getUserLocation);

// Set up search button event
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();

    if (query) {
        loadingIndicator.style.display = 'block';

        geocoder.options.geocoder.geocode(query, function (results) {
            loadingIndicator.style.display = 'none';
            if (results && results.length > 0) {
                const result = results[0];
                map.setView(result.center, 13);
                L.marker(result.center).addTo(map).bindPopup(result.name).openPopup();

                // Log the search to the server for webhook logging
                const currentUserEmail = localStorage.getItem('currentUserEmail');
                fetch('https://donadillo-web-system-server.onrender.com/location-search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: currentUserEmail,
                        locationQuery: query,
                        timestamp: new Date().toISOString()
                    })
                })
                .then(response => response.text())
                .catch((error) => {
                console.error('Error logging location search:', error);
                });
            } else {
                alert('Location not found. Please try another query.');
            }
        });
    } else {
        alert('Please enter a location to search.');
    }
});

getUserLocation();

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