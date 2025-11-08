import axios from 'axios';

const testRenderBackend = async () => {
  try {
    console.log('🧪 Testing Render Backend Connectivity...');
    
    // Test basic connectivity
    console.log('📡 Testing base URL...');
    const baseResponse = await axios.get('https://online-fee-payment-and-reciept-system.onrender.com/', {
      timeout: 10000
    });
    
    console.log('✅ Base URL accessible:', baseResponse.status);
    
    // Test API endpoint
    console.log('📡 Testing API endpoint...');
    const apiResponse = await axios.get('https://online-fee-payment-and-reciept-system.onrender.com/api/health', {
      timeout: 10000
    });
    
    console.log('✅ API endpoint accessible:', apiResponse.status);
    
  } catch (error) {
    console.error('❌ Backend test failed:');
    console.error('  - Error Code:', error.code);
    console.error('  - Status:', error.response?.status);
    console.error('  - Message:', error.message);
    console.error('  - URL:', error.config?.url);
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('🚨 Backend is not running or not deployed to Render!');
      console.log('💡 Solution: Deploy backend to Render or check Render dashboard');
    }
  }
};

testRenderBackend();
