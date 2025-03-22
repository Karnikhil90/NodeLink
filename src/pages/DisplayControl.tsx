import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { apiEndpoints, getEndpointUrl } from '../config/apiEndpoints';
import { getSettings } from '../utils/settings';

const DisplayControl: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [size, setSize] = useState('1');
  const [ipAddress, setIpAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const settings = getSettings();
    if (settings?.defaultIP) {
      setIpAddress(settings.defaultIP);
    }
  }, []);

  const sendCommand = async (endpoint: string, params?: Record<string, string>) => {
    if (!ipAddress) {
      setError('Please enter an IP address');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const baseUrl = `http://${ipAddress}`;
      const url = params 
        ? `${baseUrl}${endpoint}?${new URLSearchParams(params).toString()}`
        : `${baseUrl}${endpoint}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess('Command sent successfully');
    } catch (err) {
      setError('Failed to send command');
      console.error('Command error:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    // First set the text size if it's not the default
    if (size !== '1') {
      await sendCommand(getEndpointUrl(apiEndpoints[1], { size }));
    }

    // Then send the message
    await sendCommand(getEndpointUrl(apiEndpoints[0], { msg: message }));
  };

  const handleClear = async () => {
    await sendCommand(getEndpointUrl(apiEndpoints[2]));
  };

  const handleReboot = async () => {
    await sendCommand(getEndpointUrl(apiEndpoints[3]));
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
        <Typography variant="h4">Display Control</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Device Connection
        </Typography>
        <TextField
          fullWidth
          label="IP Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          margin="normal"
          placeholder="192.168.1.1"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Send Message
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={3}
              placeholder="Enter your message here..."
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Text Size</InputLabel>
              <Select
                value={size}
                label="Text Size"
                onChange={(e) => setSize(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num.toString()}>
                    Size {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendMessage}
              fullWidth
              disabled={!message.trim()}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Device Controls
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Tooltip title="Clear Display">
              <IconButton
                color="error"
                onClick={handleClear}
                sx={{ width: '100%', height: '48px' }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Tooltip title="Reboot Device">
              <IconButton
                color="warning"
                onClick={handleReboot}
                sx={{ width: '100%', height: '48px' }}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DisplayControl; 