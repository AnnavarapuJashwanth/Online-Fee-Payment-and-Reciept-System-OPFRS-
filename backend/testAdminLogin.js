import axios from 'axios';

const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing Admin Login...');
    
    const loginData = {
      email: 'sravanthivarikuti233@gmail.com',
      password: 'Admin@Sravanthi4651'
    };
    
    console.log('📧 Login credentials:', loginData.email);
    
    // Test login
    const response = await axios.post('http://localhost:5000/api/admin/login', loginData);
    
    if (response.data.success) {
      console.log('✅ Admin login successful!');
      console.log('🔑 Token:', response.data.token);
      console.log('👤 Admin:', response.data.admin.name);
      
      // Test dashboard stats with the token
      console.log('\n🧪 Testing Dashboard Stats...');
      const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
      
      if (statsResponse.data.success) {
        console.log('✅ Dashboard stats fetched successfully!');
        console.log('📊 Stats:', statsResponse.data.stats);
      } else {
        console.log('❌ Dashboard stats failed:', statsResponse.data.message);
      }
    } else {
      console.log('❌ Admin login failed:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAdminLogin();
