import { getSettings } from './settings';

export interface NetworkDevice {
  ip: string;
  hostname: string;
  mac?: string;
  type: 'esp' | 'unknown';
}

export class NetworkScanner {
  private static readonly ESP_SIGNATURES = [
    'ESP_',
    'ESP32_',
    'ESP8266_',
    'NodeMCU_'
  ];

  private static async fetchWithTimeout(url: string, timeout: number = 1000): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  static async scanNetwork(): Promise<NetworkDevice[]> {
    const devices: NetworkDevice[] = [];
    const settings = getSettings();
    const range = settings.defaultIP;

    // Scan the local network
    for (let i = 1; i < 255; i++) {
      const ip = `${range.split('.')[0]}.${range.split('.')[1]}.${range.split('.')[2]}.${i}`;
      try {
        const response = await this.fetchWithTimeout(`http://${ip}/`);
        if (response.ok) {
          const hostname = await this.getHostname(ip);
          devices.push({
            ip,
            hostname,
            type: this.isESPDevice(hostname) ? 'esp' : 'unknown'
          });
        }
      } catch (error) {
        // Ignore timeout errors and continue scanning
        continue;
      }
    }

    return this.deduplicateDevices(devices);
  }

  private static async getHostname(ip: string): Promise<string> {
    try {
      const response = await this.fetchWithTimeout(`http://${ip}/hostname`);
      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      // Ignore errors
    }
    return `Device_${ip.split('.').pop()}`;
  }

  private static isESPDevice(hostname: string): boolean {
    return this.ESP_SIGNATURES.some(sig => hostname.startsWith(sig));
  }

  private static deduplicateDevices(devices: NetworkDevice[]): NetworkDevice[] {
    const uniqueDevices = new Map<string, NetworkDevice>();
    devices.forEach(device => {
      if (!uniqueDevices.has(device.ip)) {
        uniqueDevices.set(device.ip, device);
      }
    });
    return Array.from(uniqueDevices.values());
  }
} 