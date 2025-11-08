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

    // 🔹 Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔹 Send OTP email
    await sendOtpEmail(email, otp);

    console.log(`📩 Test OTP ${otp} sent to ${email}`);

    res.json({
      success: true,
      message: `✅ Test email sent successfully to ${email}`,
      otp, // (optional: remove this in production for security)
    });
  } catch (err) {
    console.error("❌ Test email error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Failed to send test email",
      error: err.message,
    });
  }
});

export default router;
