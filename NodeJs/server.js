const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express(); // Initialize the app
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Webhook Url
const webhookUrl = "https://webhook.site/2645f68b-839e-412a-b19c-9d2cf13a0efa"; // Change URL Here hehe
const uniqueNum = webhookUrl.slice(21);
const webhookToken = `https://webhook.site/token/${uniqueNum}/requests`

// Login route to log login details
app.post('/login', (req, res) => {
    const { email, timestamp, message } = req.body;

    console.log(`Login data received: ${email}, ${timestamp}, ${message}`);

    // Send login data to the webhook
    axios.post(webhookUrl, {
        email: email,
        timestamp: timestamp,
        message: message
    })
    .then(() => {
        console.log('Login data sent to webhook successfully.');
        res.status(200).send('Login data received and sent to webhook successfully.');
    })
    .catch((error) => {
        console.error('Error sending login data to webhook:', error);
        res.status(500).send('Error sending login data to webhook');
    });
});

// Location search route to log location searches
app.post('/location-search', (req, res) => {
    console.log('Incoming request body:', req.body); // Log the entire request body
    const { email, timestamp, locationQuery } = req.body;

    console.log(`Location search data received: ${email}, ${timestamp}, ${locationQuery}`);

    // Send location search data to the webhook
    axios.post(webhookUrl, {
        email: email,
        timestamp: timestamp,
        locationQuery: locationQuery // Ensure this matches the request body key
    })
    .then(() => {
        console.log('Location search data sent to webhook successfully.');
        res.status(200).send('Location search data received and sent to webhook successfully.');
    })
    .catch((error) => {
        console.error('Error sending location search data to webhook:', error);
        res.status(500).send('Error sending location search data to webhook');
    });
});

// Route to retrieve logs from webhook.site
app.get('/logs', async (req, res) => {
    try {
        const response = await axios.get(webhookToken);
        res.json(response.data); // Send the logs data as JSON to the client
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
