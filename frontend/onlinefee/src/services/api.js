import axios from "axios";
import getApiConfig from "../config/apiConfig.js";

// 🌐 Create API instance with dynamic configuration
const api = axios.create({
  timeout: 15000, // Default timeout
});

// Set baseURL dynamically on each request
api.interceptors.request.use((config) => {
  // Get fresh API configuration for each request
  const apiConfig = getApiConfig();
  config.baseURL = apiConfig.baseURL;
  config.timeout = apiConfig.timeout;
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.request.use((config) => {
  // Check for student token first, then admin token
  const studentToken = localStorage.getItem("ofprs_token");
  const adminToken = localStorage.getItem("admin_token");
  
  const token = studentToken || adminToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Enhanced debugging
  console.log("🔑 API Request - Token attached:", token ? "Present" : "Missing");
  console.log("🌐 API Request - Full URL:", `${config.baseURL}${config.url}`);
  console.log("🌐 API Request - Base URL:", config.baseURL);
  console.log("🌐 API Request - Endpoint:", config.url);
  console.log("🌐 API Request - Method:", config.method?.toUpperCase());
  
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log("❌ API Error Details:");
    console.log("  - Status:", error.response?.status || "No response");
    console.log("  - Status Text:", error.response?.statusText || "No status text");
    console.log("  - Data:", error.response?.data || "No data");
    console.log("  - URL:", error.config?.url || "No URL");
    console.log("  - Base URL:", error.config?.baseURL || "No base URL");
    console.log("  - Full URL:", error.config ? `${error.config.baseURL}${error.config.url}` : "Cannot construct URL");
    console.log("  - Method:", error.config?.method?.toUpperCase() || "No method");
    console.log("  - Error Message:", error.message || "No error message");
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("🔓 Authentication error - clearing tokens");
      localStorage.removeItem("ofprs_token");
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      
      // Redirect to appropriate login page
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
