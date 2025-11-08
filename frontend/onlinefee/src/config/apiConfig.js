// 🌐 API Configuration based on environment
const getApiConfig = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Get environment variable or use default based on mode
  const envApiUrl = import.meta.env.VITE_API_BASE;
  
  let apiUrl;
  
  if (envApiUrl) {
    // Use environment variable if provided
    apiUrl = envApiUrl;
  } else {
    // Auto-detect based on environment
    apiUrl = isDevelopment 
      ? "http://localhost:5000/api"  // Local development
      : "https://online-fee-payment-and-reciept-system.onrender.com/api"; // Production
  }
  
  console.log("🔍 API Configuration:");
  console.log("Environment Mode:", isDevelopment ? "Development" : "Production");
  console.log("VITE_API_BASE from .env:", envApiUrl);
  console.log("Final API URL:", apiUrl);
  
  return {
    baseURL: apiUrl,
    timeout: 10000, // 10 seconds timeout
  };
};

export default getApiConfig;
