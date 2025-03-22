const axios = require('axios');

const ESP32_IP = "192.168.1.8"; // Replace with your ESP32's IP address
const url = `http://${ESP32_IP}/wifi/scan`;

axios.get(url)
  .then(response => {
    console.log("Available WiFi Networks:");
    console.log(response.data); // Print the JSON response
  })
  .catch(error => {
    console.error("Error scanning WiFi networks:", error.message);
  });


/*
Available WiFi Networks:
[
  { SSID: 'Airtel_Zeus', Signal: -58, PasswordRequired: true },
  { SSID: 'Airtel_tris_0845', Signal: -91, PasswordRequired: true },
  { SSID: 'JioPrivateNet', Signal: -92, PasswordRequired: true },
  { SSID: 'Airtel_bira_9003', Signal: -92, PasswordRequired: true }
]
*/