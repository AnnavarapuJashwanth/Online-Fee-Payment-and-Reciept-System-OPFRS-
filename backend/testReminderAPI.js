import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:5000/api';

// Test admin login and get token
const testAdminLogin = async () => {
  try {
    console.log('🔐 Testing admin login...');
    const response = await axios.post(`${API_BASE}/admin/login`, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD
    });
    
    if (response.data.success) {
      console.log('✅ Admin login successful');
      return response.data.token;
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    console.error('❌ Admin login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Test reminder sending
const testSendReminder = async (token) => {
  try {
    console.log('\n📧 Testing send reminder API...');
    
    const reminderData = {
      reminderType: 'email',
      targetGroup: 'all_pending',
      subject: 'Test Fee Payment Reminder',
      message: 'Dear {student_name},\n\nThis is a test reminder for your fee payment of {amount}.\n\nPlease pay by {due_date}.\n\nThank you,\nVignan University'
    };
    
    const response = await axios.post(`${API_BASE}/admin/send-reminder`, reminderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Reminder API Response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Send reminder failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test send email to all
const testSendEmailAll = async (token) => {
  try {
    console.log('\n📧 Testing send email to all API...');
    
    const emailData = {
      reminderType: 'email',
      targetGroup: 'all_users',
      subject: 'Test Mass Email',
      message: 'Dear {student_name},\n\nThis is a test mass email.\n\nThank you,\nVignan University'
    };
    
    const response = await axios.post(`${API_BASE}/admin/send-email-all`, emailData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Mass email API Response:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ Send mass email failed:', error.response?.data || error.message);
    throw error;
  }
};

// Test dashboard stats
const testDashboardStats = async (token) => {
  try {
    console.log('\n📊 Testing dashboard stats...');
    
    const response = await axios.get(`${API_BASE}/admin/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Dashboard stats:', response.data.stats);
    return response.data.stats;
    
  } catch (error) {
    console.error('❌ Dashboard stats failed:', error.response?.data || error.message);
    throw error;
  }
};

// Main test function
const runTests = async () => {
  try {
    console.log('🧪 Starting Email Reminder API Tests...\n');
    
    // Test 1: Admin login
    const token = await testAdminLogin();
    
    // Test 2: Dashboard stats
    const stats = await testDashboardStats(token);
    
    // Test 3: Send reminder (only if there are pending students)
    if (stats.pendingStudentsCount > 0) {
      await testSendReminder(token);
    } else {
      console.log('⚠️ No pending students found, skipping reminder test');
    }
    
    // Test 4: Send email to all (commented out to avoid spam)
    // await testSendEmailAll(token);
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
    process.exit(1);
  }
};

// Run the tests
runTests();
