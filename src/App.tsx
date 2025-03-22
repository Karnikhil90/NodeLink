import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Main from './pages/Main';
import DisplayControl from './pages/DisplayControl';
import Terminal from './pages/Terminal';
import Settings from './pages/Settings';
import { getSettings } from './utils/settings';

const App: React.FC = () => {
  const settings = getSettings();
  
  const theme = createTheme({
    palette: {
      mode: settings.theme,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: settings.theme === 'dark' ? '#121212' : '#f5f5f5',
        paper: settings.theme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/display" element={<DisplayControl />} />
        <Route path="/terminal" element={<Terminal />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App; 