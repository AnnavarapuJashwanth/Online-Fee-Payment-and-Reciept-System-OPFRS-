// ✅ Brevo Email Service for Production Deployment
// Gmail SMTP for localhost, Brevo API for production

import fetch from 'node-fetch';

// ✅ Check if running in production
const isProduction = () => {
  return process.env.NODE_ENV === 'production' || 
         process.env.RENDER || 
         !process.env.EMAIL_HOST_USER; // If no Gmail config, use Brevo
};

// ✅ Send OTP via Brevo API (Production)
export const sendOtpViaBrevo = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP via Brevo API to ${email}...`);
    
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY not found in environment variables');
    }

    const emailData = {
      sender: { 
        email: 'noreply@ofprs.com', 
        name: 'OFPRS Portal' 
      },
      to: [{ email: email }],
      subject: '🔐 Your OTP Code - OFPRS Login',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1976d2; margin: 0; font-size: 28px;">🔐 OFPRS</h1>
              <p style="color: #666; margin: 5px 0;">Online Fee Payment & Receipt System</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Login Verification</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Your one-time password (OTP) for OFPRS login is:
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; border-radius: 8px; margin: 25px 0;">
              <h1 style="color: white; font-size: 42px; margin: 0; letter-spacing: 3px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">${otp}</h1>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-weight: bold;">
                ⏰ This OTP is valid for 5 minutes only
              </p>
            </div>
            
            <p style="color: #555; font-size: 14px; line-height: 1.5;">
              If you didn't request this OTP, please ignore this email. For security reasons, never share this OTP with anyone.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <div style="text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                OFPRS - Online Fee Payment and Receipt System<br>
                Secure • Fast • Reliable
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log(`📡 Making API request to Brevo...`);
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoApiKey
      },
      body: JSON.stringify(emailData)
    });

    const responseData = await response.json();

    if (response.ok) {
      console.log(`✅ OTP sent successfully via Brevo to ${email}`);
      console.log(`📧 Brevo Response:`, responseData);
      return { success: true, service: 'Brevo', messageId: responseData.messageId };
    } else {
      console.error(`❌ Brevo API Error:`, responseData);
      throw new Error(`Brevo API failed: ${response.status} - ${responseData.message || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ Brevo service failed:', error.message);
    throw error;
  }
};

// ✅ Environment-based email service selector
export const shouldUseBrevo = () => {
  const useBrevo = isProduction();
  console.log(`🔍 Environment check: ${useBrevo ? 'PRODUCTION (using Brevo)' : 'LOCALHOST (using Gmail)'}`);
  return useBrevo;
};

// ✅ Get environment info for debugging
export const getEmailEnvironmentInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    isRender: !!process.env.RENDER,
    hasGmailConfig: !!process.env.EMAIL_HOST_USER,
    hasBrevoConfig: !!process.env.BREVO_API_KEY,
    willUseBrevo: shouldUseBrevo()
  };
};
