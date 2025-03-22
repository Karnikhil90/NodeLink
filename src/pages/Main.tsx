import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import TerminalIcon from '@mui/icons-material/Terminal';
import MonitorIcon from '@mui/icons-material/Monitor';
import InstallIcon from '@mui/icons-material/InstallMobile';
import { apiEndpoints, getEndpointUrl } from '../config/apiEndpoints';
import { getSettings, saveSettings } from '../utils/settings';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface WiFiNetwork {
  SSID: string;
  Signal: number;
  PasswordRequired: boolean;
}

interface WiFiStatus {
  ssid: string;
  ip: string;
  rssi: number;
  status: string;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const { isInstallable, install } = usePWAInstall();
  const [ipAddress, setIpAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [wifiStatus, setWifiStatus] = useState<WiFiStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const settings = getSettings();
    if (settings?.defaultIP) {
      setIpAddress(settings.defaultIP);
      checkConnection(settings.defaultIP);
    }
  }, []);

  const handleIpChange = (newIp: string) => {
    setIpAddress(newIp);
    const settings = getSettings();
    if (settings) {
      saveSettings({
        ...settings,
        defaultIP: newIp
      });
    }
  };

  const checkConnection = async (ip: string) => {
    try {
      const response = await fetch('/wifi/status');
      if (response.ok) {
        const text = await response.text();
        try {
          const status = JSON.parse(text);
          setWifiStatus(status);
        } catch (error) {
          console.error('Error parsing status:', error);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };
  
  const scanNetworks = async () => {
    console.log("Starting network scan...");
    if (!ipAddress) {
      console.log("Error: No IP address provided");
      setError('Please enter an IP address');
      return;
    }
    
    console.log(`Scanning networks at IP: ${ipAddress}`);
    setIsScanning(true);
    setError(null);
    
    try {
      console.log("Making request to ESP32...");
      const response = await fetch('/wifi/scan');
      console.log("Response received:", response);
      
      if (response.ok) {
        console.log("Response is OK, reading text...");
        const text = await response.text();
        console.log("Raw response text:", text);
        
        try {
          const data = JSON.parse(text);
          console.log("Parsed network data:", data);
          setNetworks(data);
        } catch (parseError) {
          console.error('Error parsing response:', parseError);
          setError('Failed to parse network data. Please check the ESP32 connection.');
        }
      } else {
        console.log("Response not OK, reading error text...");
        const errorText = await response.text();
        console.log("Error response text:", errorText);
        setError(`Failed to scan networks: ${errorText}`);
      }
    } catch (error) {
      console.error('Scan error:', error);
      setError('Failed to scan networks. Make sure the ESP32 is accessible.');
    } finally {
      console.log("Scan complete");
      setIsScanning(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedNetwork || !password) return;

    try {
      const response = await fetch(
        getEndpointUrl(apiEndpoints[5], {
          ssid: selectedNetwork.SSID,
          pass: password
        })
      );

      if (response.ok) {
        setConnectDialogOpen(false);
        setPassword('');
        checkConnection(ipAddress);
      } else {
        setError('Failed to connect to network');
      }
    } catch (error) {
      setError('Failed to connect to network');
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/wifi/disconnect');
      if (response.ok) {
        checkConnection(ipAddress);
      } else {
        setError('Failed to disconnect');
      }
    } catch (error) {
      setError('Failed to disconnect');
    }
  };

  const handleReconnect = async () => {
    try {
      const response = await fetch('/wifi/reconnect');
      if (response.ok) {
        checkConnection(ipAddress);
      } else {
        setError('Failed to reconnect');
      }
    } catch (error) {
      setError('Failed to reconnect');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4">NodeLink</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {isInstallable && (
          <Button
            startIcon={<InstallIcon />}
            onClick={install}
            variant="outlined"
            color="primary"
          >
            Install App
          </Button>
        )}
        <Button
          startIcon={<SettingsIcon />}
          onClick={() => navigate('/settings')}
        >
          Settings
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Connection
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="IP Address"
                value={ipAddress}
                onChange={(e) => handleIpChange(e.target.value)}
                placeholder="192.168.1.1"
              />
            </Box>

            {wifiStatus && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  WiFi Status
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>SSID:</strong> {wifiStatus.ssid}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>IP:</strong> {wifiStatus.ip}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Signal Strength:</strong> {wifiStatus.rssi} dBm
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography>
                      <strong>Status:</strong> {wifiStatus.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDisconnect}
                        startIcon={<WifiOffIcon />}
                      >
                        Disconnect
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleReconnect}
                        startIcon={<WifiIcon />}
                      >
                        Reconnect
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                WiFi Networks
              </Typography>
              <Button
                startIcon={<RefreshIcon />}
                onClick={scanNetworks}
                disabled={isScanning || !ipAddress}
              >
                {isScanning ? 'Scanning...' : 'Scan'}
              </Button>
            </Box>

            {isScanning ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {networks.map((network, index) => (
                  <React.Fragment key={network.SSID}>
                    <ListItem>
                      <ListItemText
                        primary={network.SSID}
                        secondary={`Signal: ${network.Signal} dBm${network.PasswordRequired ? ' • Password Required' : ''}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setSelectedNetwork(network);
                            setConnectDialogOpen(true);
                          }}
                        >
                          <WifiIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < networks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Device Controls
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MonitorIcon />}
                  onClick={() => navigate('/display')}
                >
                  Display Control
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<TerminalIcon />}
                  onClick={() => navigate('/terminal')}
                >
                  Terminal
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)}>
        <DialogTitle>Connect to Network</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConnect} variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Main; 