import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { getSettings } from '../utils/settings';

interface CommandHistory {
  command: string;
  response: string;
  timestamp: Date;
}

const Terminal: React.FC = () => {
  const navigate = useNavigate();
  const [ipAddress, setIpAddress] = useState('');
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const settings = getSettings();
    if (settings?.defaultIP) {
      setIpAddress(settings.defaultIP);
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSendCommand = async () => {
    if (!ipAddress) {
      setError('Please enter an IP address');
      return;
    }

    if (!command) {
      setError('Please enter a command');
      return;
    }

    try {
      setError(null);
      const response = await fetch(`http://${ipAddress}${command}`);
      const responseText = await response.text();
      
      setHistory(prev => [...prev, {
        command,
        response: responseText,
        timestamp: new Date()
      }]);
      
      setCommand('');
    } catch (err) {
      setError('Failed to send command');
      console.error('Command error:', err);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSendCommand();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          Back
        </Button>
        <Typography variant="h4">Terminal</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 2 }}>
        <TextField
          fullWidth
          label="IP Address"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          margin="normal"
          placeholder="192.168.1.1"
        />
      </Paper>

      <Paper 
        ref={terminalRef}
        sx={{ 
          p: 3, 
          mb: 2, 
          height: '400px', 
          overflow: 'auto',
          bgcolor: '#1e1e1e',
          color: '#fff',
          fontFamily: 'monospace',
        }}
      >
        {history.map((entry, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography sx={{ color: '#0f0' }}>
              $ {entry.command}
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {entry.response}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              {entry.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter command (e.g., /text?msg=Hello)"
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'monospace',
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendCommand}
            startIcon={<SendIcon />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Terminal; 