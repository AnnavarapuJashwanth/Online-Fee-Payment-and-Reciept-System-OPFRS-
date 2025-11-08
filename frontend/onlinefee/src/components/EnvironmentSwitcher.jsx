import { useState, useEffect } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';

const EnvironmentSwitcher = () => {
  const [currentEnv, setCurrentEnv] = useState('auto');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Get current API URL from config
    const savedEnv = localStorage.getItem('force_api_env');
    if (savedEnv) {
      setCurrentEnv(savedEnv);
    }
    
    // Display current API URL
    const config = JSON.parse(localStorage.getItem('api_config') || '{}');
    setApiUrl(config.baseURL || 'Not set');
  }, []);

  const switchEnvironment = (env) => {
    if (env === 'auto') {
      localStorage.removeItem('force_api_env');
    } else {
      localStorage.setItem('force_api_env', env);
    }
    
    setCurrentEnv(env);
    
    // Force page reload to apply new config
    window.location.reload();
  };

  // Only show in development or if manually enabled
  const isDev = import.meta.env.DEV;
  const showSwitcher = isDev || localStorage.getItem('show_env_switcher');

  if (!showSwitcher) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        <Typography variant="caption">
          <strong>API Environment:</strong> {currentEnv}<br/>
          <strong>Current URL:</strong> {apiUrl}
        </Typography>
      </Alert>
      
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        <Button 
          size="small" 
          variant={currentEnv === 'local' ? 'contained' : 'outlined'}
          onClick={() => switchEnvironment('local')}
        >
          Local (localhost:5000)
        </Button>
        
        <Button 
          size="small" 
          variant={currentEnv === 'production' ? 'contained' : 'outlined'}
          onClick={() => switchEnvironment('production')}
        >
          Production (Render)
        </Button>
        
        <Button 
          size="small" 
          variant={currentEnv === 'auto' ? 'contained' : 'outlined'}
          onClick={() => switchEnvironment('auto')}
        >
          Auto Detect
        </Button>
      </Box>
    </Box>
  );
};

export default EnvironmentSwitcher;
