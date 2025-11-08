import axios from 'axios';

const testAdminProduction = async () => {
  try {
    console.log('🧪 Testing Admin Login in Production...');
    
    const baseUrl = 'https://online-fee-payment-and-reciept-system.onrender.com';
    
    // Test 1: Check if admin exists by trying to create initial admin
    console.log('📋 Step 1: Checking if admin exists...');
    try {
      const createResponse = await axios.post(`${baseUrl}/api/admin/create-initial`, {}, {
        timeout: 15000
      });
      console.log('📝 Create admin response:', createResponse.data);
    } catch (createError) {
      if (createError.response?.status === 400) {
        console.log('✅ Admin already exists (expected)');
      } else {
        console.log('❌ Create admin error:', createError.response?.data || createError.message);
      }
    }
    
    // Test 2: Try admin login
    console.log('\n🔐 Step 2: Testing admin login...');
    const loginData = {
      email: 'sravanthivarikuti233@gmail.com',
      password: 'Admin@Sravanthi4651'
    };
    
    try {
      const loginResponse = await axios.post(`${baseUrl}/api/admin/login`, loginData, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (loginResponse.data.success) {
        console.log('✅ Admin login successful!');
        console.log('👤 Admin details:', {
          name: loginResponse.data.admin.name,
          email: loginResponse.data.admin.email,
          role: loginResponse.data.admin.role
        });
        console.log('🔑 Token received:', loginResponse.data.token ? 'Yes' : 'No');
        
        // Test 3: Try accessing dashboard with token
        console.log('\n📊 Step 3: Testing dashboard access...');
        const dashboardResponse = await axios.get(`${baseUrl}/api/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${loginResponse.data.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });
        
        if (dashboardResponse.data.success) {
          console.log('✅ Dashboard access successful!');
          console.log('📈 Dashboard data:', dashboardResponse.data);
        }
        
      } else {
        console.log('❌ Login failed:', loginResponse.data.message);
      }
      
    } catch (loginError) {
      console.error('❌ Admin login failed:');
      console.error('  - Status:', loginError.response?.status);
      console.error('  - Message:', loginError.response?.data?.message);
      console.error('  - Full error:', loginError.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run the test
testAdminProduction();
