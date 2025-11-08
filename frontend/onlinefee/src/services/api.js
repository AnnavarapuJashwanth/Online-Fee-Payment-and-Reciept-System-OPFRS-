import axios from "axios";

// Temporarily hardcoded for testing - remove after fixing
const BASE_URL = "http://localhost:5000/api";

// 🔍 Debug environment variable loading
console.log("🔍 API Service Debug:");
console.log("VITE_API_BASE from env:", import.meta.env.VITE_API_BASE);
console.log("Final BASE_URL being used:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
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
