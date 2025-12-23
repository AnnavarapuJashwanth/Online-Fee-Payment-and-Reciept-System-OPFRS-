import axios from 'axios';

const testStudentAuth = async () => {
  try {
    console.log('🧪 Testing Student Authentication in Production...');
    
    const baseUrl = 'https://online-fee-payment-and-reciept-system.onrender.com';
    
    // Test data - using existing student from database
    const testStudent = {
      name: 'Test Student',
      regno: '231fa04902', // Existing student regno from database
      email: 'jashwanthannavarapu99@gmail.com',
      phone: '9876543210',
      password: 'TestPass123'
    };
    
    // Test 1: Check backend health
    console.log('\n📡 Step 1: Testing backend health...');
    try {
      const healthResponse = await axios.get(`${baseUrl}/api/health`, {
        timeout: 15000
      });
      console.log('✅ Backend is healthy:', healthResponse.data);
    } catch (healthError) {
      console.log('❌ Backend health check failed:', healthError.message);
      return;
    }
    
    // Test 2: Try student signup
    console.log('\n👤 Step 2: Testing student signup...');
    try {
      const signupResponse = await axios.post(`${baseUrl}/api/auth/signup`, testStudent, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (signupResponse.data.message) {
        console.log('✅ Signup response:', signupResponse.data.message);
        console.log('👤 User created:', {
          name: signupResponse.data.user?.name,
          regno: signupResponse.data.user?.regno,
          email: signupResponse.data.user?.email
        });
      }
      
    } catch (signupError) {
      if (signupError.response?.status === 400 && signupError.response?.data?.message?.includes('already exists')) {
        console.log('✅ User already exists (expected for test)');
      } else {
        console.error('❌ Signup failed:');
        console.error('  - Status:', signupError.response?.status);
        console.error('  - Message:', signupError.response?.data?.message);
        console.error('  - Full error:', signupError.response?.data);
      }
    }
    
    // Test 3: Try student login
    console.log('\n🔐 Step 3: Testing student login...');
    try {
      const loginResponse = await axios.post(`${baseUrl}/api/auth/login`, {
        regno: testStudent.regno,
        password: testStudent.password
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (loginResponse.data.token) {
        console.log('✅ Login successful!');
        console.log('👤 User details:', {
          name: loginResponse.data.user.name,
          regno: loginResponse.data.user.regno,
          email: loginResponse.data.user.email
        });
        console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
        
        // Test 4: Try accessing protected route
        console.log('\n📊 Step 4: Testing dashboard access...');
        const dashboardResponse = await axios.get(`${baseUrl}/api/student/profile`, {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (dashboardResponse.data) {
          console.log('✅ Dashboard access successful!');
          console.log('📈 Profile data:', dashboardResponse.data);
        }
        
      } else {
        console.log('❌ Login failed:', loginResponse.data.message);
      }
      
    } catch (loginError) {
      console.error('❌ Student login failed:');
      console.error('  - Status:', loginError.response?.status);
      console.error('  - Message:', loginError.response?.data?.message);
      console.error('  - Full error:', loginError.response?.data);
    }
    
    // Test 5: Try OTP login
    console.log('\n📧 Step 5: Testing OTP login...');
    try {
      const otpResponse = await axios.post(`${baseUrl}/api/auth/send-otp`, {
        email: testStudent.email
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (otpResponse.data.success) {
        console.log('✅ OTP sent successfully!');
        console.log('📧 OTP response:', otpResponse.data.message);
      } else {
        console.log('❌ OTP sending failed:', otpResponse.data.message);
      }
      
    } catch (otpError) {
      console.error('❌ OTP sending failed:');
      console.error('  - Status:', otpError.response?.status);
      console.error('  - Message:', otpError.response?.data?.message);
      console.error('  - Full error:', otpError.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testStudentAuth();
