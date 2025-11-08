import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import { sendEmail } from "./utils/mailer.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const testEmailSending = async () => {
  try {
    await connectDB();

    console.log("🧪 Testing email sending functionality...");
    
    // Check environment variables
    console.log("\n📧 Email Configuration:");
    console.log("EMAIL_HOST_USER:", process.env.EMAIL_HOST_USER);
    console.log("EMAIL_HOST_PASSWORD exists:", !!process.env.EMAIL_HOST_PASSWORD);
    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);
    
    // Get users from database
    console.log("\n👥 Checking users in database...");
    const users = await User.find({}).select("name email regno").limit(5);
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log("❌ No users found in database");
      process.exit(0);
    }
    
    // Show first few users
    console.log("\n📋 Sample users:");
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.regno}) - ${user.email}`);
    });
    
    // Test sending email to first user
    console.log("\n📤 Testing email send to first user...");
    const testUser = users[0];
    
    try {
      await sendEmail({
        to: testUser.email,
        subject: "Test Email from OFPRS",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #667eea;">Test Email</h2>
            <p>Dear ${testUser.name},</p>
            <p>This is a test email to verify the email sending functionality.</p>
            <p>Your registration number: ${testUser.regno}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated test message from Vignan University Fee Management System.
            </p>
          </div>
        `,
      });
      
      console.log("✅ Test email sent successfully!");
      
    } catch (emailError) {
      console.error("❌ Email sending failed:");
      console.error("Error name:", emailError.name);
      console.error("Error message:", emailError.message);
      console.error("Error code:", emailError.code);
      console.error("Error response:", emailError.response);
      console.error("Full error:", emailError);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
};

testEmailSending();
