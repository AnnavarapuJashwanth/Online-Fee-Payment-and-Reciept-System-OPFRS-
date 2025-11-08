import express from "express";
import {
  signupUser,
  loginUser,
  sendOtp,
  verifyOtp,
  getUserProfile,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { sendOtpEmail } from "../utils/mailer.js"; // ✅ import mailer for test route

const router = express.Router();

// ✅ Sign up
router.post("/signup", signupUser);

// ✅ Login using regNo + password
router.post("/login", loginUser);

// ✅ Send OTP (email-based)
router.post("/send-otp", sendOtp);

// ✅ Verify OTP and login
router.post("/verify-otp", verifyOtp);

// ✅ Get profile (protected route)
router.get("/profile", verifyToken, getUserProfile);

// ✅ Test email sending with random OTP
router.post("/test-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    console.log(`🧪 Testing email configuration for: ${email}`);
    
    // Check environment variables
    const emailUser = process.env.EMAIL_HOST_USER || process.env.SMTP_USER;
    const emailPass = process.env.EMAIL_HOST_PASSWORD || process.env.SMTP_PASS;
    
    console.log(`📧 Email config check:`);
    console.log(`- EMAIL_HOST_USER: ${emailUser ? '✅ Set' : '❌ Missing'}`);
    console.log(`- EMAIL_HOST_PASSWORD: ${emailPass ? '✅ Set' : '❌ Missing'}`);

    if (!emailUser || !emailPass) {
      return res.status(500).json({
        success: false,
        message: "❌ Email configuration missing in backend environment variables",
        details: {
          emailUser: !!emailUser,
          emailPass: !!emailPass
        }
      });
    }

    // 🔹 Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔹 Send OTP email
    await sendOtpEmail(email, otp);

    console.log(`📩 Test OTP ${otp} sent successfully to ${email}`);

    res.json({
      success: true,
      message: `✅ Test email sent successfully to ${email}`,
      otp, // (optional: remove this in production for security)
    });
  } catch (err) {
    console.error("❌ Test email error:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Failed to send test email",
      error: err.message,
    });
  }
});

export default router;
