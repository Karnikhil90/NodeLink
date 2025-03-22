export interface ApiEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST';
  description: string;
  params?: Record<string, string>;
}

export const apiEndpoints: ApiEndpoint[] = [
  {
    name: 'Display Message',
    path: '/text',
    method: 'GET',
    description: 'Display text on the OLED screen',
    params: {
      msg: 'Message to display'
    }
  },
  {
    name: 'Set Text Size',
    path: '/text/size',
    method: 'GET',
    description: 'Set text size (1-5)',
    params: {
      size: 'Text size (1-5)'
    }
  },
  {
    name: 'Clear Display',
    path: '/clear',
    method: 'GET',
    description: 'Clear the OLED screen'
  },
  {
    name: 'Reboot Device',
    path: '/reboot',
    method: 'GET',
    description: 'Reboot the ESP32'
  },
  {
    name: 'Scan WiFi',
    path: '/wifi/scan',
    method: 'GET',
    description: 'Scan for available WiFi networks'
  },
  {
    name: 'Connect WiFi',
    path: '/wifi/connect',
    method: 'GET',
    description: 'Connect to a WiFi network',
    params: {
      ssid: 'Network SSID',
      pass: 'Network password'
    }
  },
  {
    name: 'WiFi Status',
    path: '/wifi/status',
    method: 'GET',
    description: 'Get current WiFi status'
  },
  {
    name: 'Disconnect WiFi',
    path: '/wifi/disconnect',
    method: 'GET',
    description: 'Disconnect from current WiFi network'
  },
  {
    name: 'Reconnect WiFi',
    path: '/wifi/reconnect',
    method: 'GET',
    description: 'Reconnect to last known WiFi network'
  }
];

export function getEndpointUrl(endpoint: ApiEndpoint, params?: Record<string, string>): string {
  if (!params) return endpoint.path;
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  return `${endpoint.path}?${queryParams.toString()}`;
} 