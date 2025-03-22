const WifiAPI = require('./wifi-api');

async function main() {
    const wifi = new WifiAPI("192.168.1.8");
    
    try {
        const networks = await wifi.scanNetworks();
        console.log("Available WiFi Networks:");
        console.log(wifi.formatNetworkData(networks));
    } catch (error) {
        console.error(error.message);
    }
}

// Run the test
main(); 