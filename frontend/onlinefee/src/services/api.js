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
  }
  
  return config;
});

export default api;
