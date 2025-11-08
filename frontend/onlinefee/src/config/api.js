// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Export the base URL for components that need direct access
export default API_BASE_URL;
