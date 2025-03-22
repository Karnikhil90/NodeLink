export interface Settings {
  defaultIP: string;
  autoConnect: boolean;
  scanInterval: number;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  defaultIP: '192.168.1.10',
  autoConnect: false,
  scanInterval: 30,
  theme: 'dark',
};

export const getSettings = (): Settings => {
  try {
    const savedSettings = localStorage.getItem('nodelink_settings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Settings): void => {
  try {
    localStorage.setItem('nodelink_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}; 