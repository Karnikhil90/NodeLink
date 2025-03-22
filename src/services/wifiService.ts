import axios from 'axios';

export interface WifiNetwork {
    ssid: string;
    signal: number;
    requiresPassword: boolean;
}

export class WifiService {
    private baseUrl: string;

    constructor(ipAddress: string) {
        this.baseUrl = `http://${ipAddress}`;
    }

    async scanNetworks(): Promise<WifiNetwork[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/wifi/scan`);
            return this.formatNetworkData(response.data);
        } catch (error) {
            throw new Error(`Failed to scan networks: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private formatNetworkData(networks: any[]): WifiNetwork[] {
        return networks.map(network => ({
            ssid: network.SSID,
            signal: network.Signal,
            requiresPassword: network.PasswordRequired
        }));
    }
} 