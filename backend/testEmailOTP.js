import dotenv from "dotenv";
import { sendOtpEmail } from "./utils/mailer.js";

dotenv.config();

const testEmailOTP = async () => {
  try {
    console.log("🧪 Testing Email and OTP functionality...");
    
    // Test email configuration
    console.log("📧 Email Config:");
    console.log("SMTP User:", process.env.SMTP_USER);
    console.log("Email Host User:", process.env.EMAIL_HOST_USER);
    
    // Test sending OTP
    const testEmail = "jashwanthannavarapu991@gmail.com";
    const testOTP = "123456";
    
    console.log(`📱 Sending test OTP to: ${testEmail}`);
    
    await sendOtpEmail(testEmail, testOTP);
    
    console.log("✅ OTP sent successfully!");
    console.log("📱 Check your email and phone for the OTP");
    
  } catch (error) {
    console.error("❌ Email/OTP test failed:", error);
  }
};

testEmailOTP();
