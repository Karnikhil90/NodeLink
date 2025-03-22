import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

interface Settings {
  defaultIP: string;
  autoConnect: boolean;
  scanInterval: number;
  theme: 'light' | 'dark';
}

const defaultSettings: Settings = {
  defaultIP: '192.168.1.1',
  autoConnect: false,
  scanInterval: 30,
  theme: 'dark',
};

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem('nodelink_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        setError('Failed to load settings');
      }
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('nodelink_settings', JSON.stringify(settings));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  const handleChange = (field: keyof Settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
    
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
        <Typography variant="h4">Settings</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings saved successfully
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connection Settings
        </Typography>
        <TextField
          fullWidth
          label="Default IP Address"
          value={settings.defaultIP}
          onChange={handleChange('defaultIP')}
          margin="normal"
          helperText="Default IP address for ESP devices"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.autoConnect}
              onChange={handleChange('autoConnect')}
            />
          }
          label="Auto-connect to last device"
        />
        <TextField
          fullWidth
          label="Network Scan Interval (seconds)"
          type="number"
          value={settings.scanInterval}
          onChange={handleChange('scanInterval')}
          margin="normal"
          helperText="How often to scan for devices"
        />
      </Paper>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          App Settings
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.theme === 'dark'}
              onChange={(e) => handleChange('theme')(e as any)}
            />
          }
          label="Dark Mode"
        />
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Settings
        </Button>
      </Box>
    </Container>
  );
};

export default Settings; 