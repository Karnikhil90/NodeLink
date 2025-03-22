import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { NetworkScanner, NetworkDevice } from '../utils/networkScanner';

const WifiConnect: React.FC = () => {
  const navigate = useNavigate();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleConnect = async () => {
    try {
      // TODO: Implement ESP connection logic
      console.log('Connecting to:', ssid);
    } catch (err) {
      setError('Failed to connect to device');
    }
  };

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    try {
      const foundDevices = await NetworkScanner.scanNetwork();
      setDevices(foundDevices);
    } catch (err) {
      setError('Failed to scan network');
      console.error('Scan error:', err);
    } finally {
      setScanning(false);
    }
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
        <Typography variant="h4">WiFi Connect</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {deferredPrompt && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleInstall}
          >
            Install App
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Connect to ESP Device
        </Typography>
        <TextField
          fullWidth
          label="SSID"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleConnect}
            fullWidth
          >
            Connect
          </Button>
          <Button
            variant="outlined"
            onClick={handleScan}
            fullWidth
            disabled={scanning}
            startIcon={scanning ? <CircularProgress size={20} /> : <RefreshIcon />}
          >
            {scanning ? 'Scanning...' : 'Scan Network'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {devices.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Devices
          </Typography>
          <List>
            {devices.map((device) => (
              <ListItem key={device.ip} disablePadding>
                <ListItemButton onClick={() => setSsid(device.hostname)}>
                  <ListItemText 
                    primary={device.hostname}
                    secondary={`IP: ${device.ip} | Type: ${device.type}`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default WifiConnect; 