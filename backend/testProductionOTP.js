import axios from 'axios';

const testProductionOTP = async () => {
  try {
    console.log('🧪 Testing Production OTP Endpoint...');
    
    // Wait for Render deployment (usually takes 2-3 minutes)
    console.log('⏳ Waiting for Render deployment...');
    
    const baseUrl = 'https://online-fee-payment-and-reciept-system.onrender.com';
    
    // Test health endpoint first
    console.log('📡 Testing health endpoint...');
    const healthResponse = await axios.get(`${baseUrl}/api/health`, {
      timeout: 15000
    });
    
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test OTP endpoint
    console.log('📧 Testing OTP endpoint...');
    const otpResponse = await axios.post(`${baseUrl}/api/auth/send-otp`, {
      email: 'jashwanthannavarapu99@gmail.com'
    }, {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://opfrs9.netlify.app'
      }
    });
    
    if (otpResponse.data.success) {
      console.log('✅ OTP endpoint working in production!');
      console.log('📧 Response:', otpResponse.data);
    } else {
      console.log('❌ OTP failed:', otpResponse.data);
    }
    
  } catch (error) {
    console.error('❌ Production test failed:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Data:', error.response?.data);
    console.error('  - Message:', error.message);
    console.error('  - Code:', error.code);
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏳ Timeout - Render might still be deploying. Try again in 2-3 minutes.');
    }
  }
};

// Run the test
testProductionOTP();
