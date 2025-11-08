// 🌐 API Configuration based on environment
const getApiConfig = () => {
  // Multiple ways to detect environment
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;
  const mode = import.meta.env.MODE;
  
  // Get environment variable
  const envApiUrl = import.meta.env.VITE_API_BASE;
  
  // Detect if we're running on localhost (development)
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('localhost');
  
  // Detect if we're on Netlify (production)
  const isNetlify = window.location.hostname.includes('netlify.app') ||
                   window.location.hostname.includes('opfrs9.netlify.app');
  
  let apiUrl;
  
  // Check for manual environment override
  const forceEnv = localStorage.getItem('force_api_env');
  
  // Priority order: Manual override > Environment variable > Domain detection > Vite mode
  if (forceEnv === 'local') {
    apiUrl = "http://localhost:5000/api";
    console.log("🔧 Manual override - using local API");
  } else if (forceEnv === 'production') {
    apiUrl = "https://online-fee-payment-and-reciept-system.onrender.com/api";
    console.log("🔧 Manual override - using production API");
  } else if (envApiUrl) {
    apiUrl = envApiUrl;
    console.log("🔧 Using environment variable API URL");
  } else if (isLocalhost) {
    apiUrl = "http://localhost:5000/api";
    console.log("🏠 Detected localhost - using local API");
  } else if (isNetlify || isProduction) {
    apiUrl = "https://online-fee-payment-and-reciept-system.onrender.com/api";
    console.log("🌐 Detected production - using Render API");
  } else {
    // Fallback
    apiUrl = isDevelopment 
      ? "http://localhost:5000/api"
      : "https://online-fee-payment-and-reciept-system.onrender.com/api";
    console.log("🔄 Using fallback detection");
  }
  
  const config = {
    baseURL: apiUrl,
    timeout: 15000, // 15 seconds timeout for production
  };
  
  // Store config for debugging
  localStorage.setItem('api_config', JSON.stringify(config));
  
  console.log("🔍 API Configuration Debug:");
  console.log("  - Hostname:", window.location.hostname);
  console.log("  - Vite Mode:", mode);
  console.log("  - Is Development:", isDevelopment);
  console.log("  - Is Production:", isProduction);
  console.log("  - Is Localhost:", isLocalhost);
  console.log("  - Is Netlify:", isNetlify);
  console.log("  - Force Environment:", forceEnv);
  console.log("  - VITE_API_BASE:", envApiUrl);
  console.log("  - Final API URL:", apiUrl);
  
  return config;
};

export default getApiConfig;
