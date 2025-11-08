import axios from "axios";
import getApiConfig from "../config/apiConfig.js";

// 🌐 Get API configuration based on environment
const config = getApiConfig();

const api = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
});

api.interceptors.request.use((config) => {
  // Check for student token first, then admin token
  const studentToken = localStorage.getItem("ofprs_token");
  const adminToken = localStorage.getItem("admin_token");
  
  const token = studentToken || adminToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 API Request - Token attached:", token ? "Present" : "Missing");
    console.log("🌐 API Request - URL:", config.url);
  }
  
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("❌ API Error:", error.response?.status, error.response?.data);
    
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
