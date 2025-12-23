// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://ofprs-production.eba-jhxevv9p.ap-south-1.elasticbeanstalk.com/api";

// Export the base URL for components that need direct access
export default API_BASE_URL;
