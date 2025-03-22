const axios = require('axios');

class WifiAPI {
    constructor(ipAddress) {
        this.baseUrl = `http://${ipAddress}`;
    }

    async scanNetworks() {
        try {
            const response = await axios.get(`${this.baseUrl}/wifi/scan`);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to scan networks: ${error.message}`);
        }
    }

    // Helper method to format network data
    formatNetworkData(networks) {
        return networks.map(network => ({
            ssid: network.SSID,
            signal: network.Signal,
            requiresPassword: network.PasswordRequired
        }));
    }
}

module.exports = WifiAPI; 