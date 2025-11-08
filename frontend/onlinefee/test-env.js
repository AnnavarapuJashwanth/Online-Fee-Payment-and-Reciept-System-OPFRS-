// Test environment variable loading
console.log('🔍 Environment Variable Test:');
console.log('VITE_API_BASE:', import.meta.env.VITE_API_BASE);
console.log('All env vars:', import.meta.env);

// This should show localhost:5000, not the production URL
