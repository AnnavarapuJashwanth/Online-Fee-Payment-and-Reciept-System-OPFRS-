import axios from 'axios';

const testOtpEndpoint = async () => {
  try {
    console.log('🧪 Testing OTP Endpoint...');
    
    // Test with a known user email (you'll need to have a user in the database)
    const testEmail = 'jashwanthannavarapu99@gmail.com'; // Change this to a real user email
    
    console.log('📧 Testing OTP send for:', testEmail);
    
    // Test OTP sending
    const response = await axios.post('http://localhost:5000/api/auth/send-otp', {
      email: testEmail
    });
    
    if (response.data.success) {
      console.log('✅ OTP endpoint working!');
      console.log('📧 Response:', response.data);
    } else {
      console.log('❌ OTP endpoint failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    console.error('  - Status:', error.response?.status);
    console.error('  - Data:', error.response?.data);
    console.error('  - Message:', error.message);
  }
};

testOtpEndpoint();
