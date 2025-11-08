import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { sendOtpEmail } from "../utils/mailer.js";
import { generateOtp } from "../utils/generateOtp.js";

const otpStore = {}; // temporary

// 🔹 SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { name, regno, email, phone, password } = req.body;

    if (!name || !regno || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if exists by regno/email
    const existingUser = await User.findOne({ $or: [{ regno }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      regno,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "✅ Signup successful",
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({
      message: "Server error during signup",
      error: err.message,
    });
  }
};

// 🔹 LOGIN
export const loginUser = async (req, res) => {
  try {
    const { regno, password } = req.body;
    if (!regno || !password) {
      return res
        .status(400)
        .json({ message: "Registration number and password required" });
    }

    const user = await User.findOne({ regno });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Log student login activity
    await ActivityLog.create({
      userId: user._id,
      userType: "student",
      action: "login",
      description: `${user.name} (${user.regno}) logged in`,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    console.log(`✅ Student login logged: ${user.name}`);

    res.json({
      message: "✅ Login successful",
      token,
      user: { ...user._doc, password: undefined },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 🔹 SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    console.log(`🔍 Looking for user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found for email: ${email}`);
      return res.status(400).json({ message: "User not found with this email address" });
    }

    console.log(`✅ User found: ${user.name} (${user.regno})`);
    const otp = generateOtp();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };
    
    console.log(`📧 Attempting to send OTP ${otp} to ${email}`);
    
    try {
      await sendOtpEmail(email, otp);
      console.log(`✅ OTP ${otp} sent successfully to ${email}`);
      
      res.json({ 
        success: true,
        message: "OTP sent successfully to your email address",
        email: email
      });
    } catch (emailError) {
      console.error("❌ Email sending failed, but OTP is stored:", emailError.message);
      
      // Still return success since OTP is stored, but with different message
      res.json({ 
        success: true,
        message: `OTP generated (${otp}) - Email service temporarily unavailable. Use this OTP to login.`,
        email: email,
        otp: otp, // Include OTP in response for debugging
        warning: "Email service timeout - OTP displayed for testing"
      });
    }
  } catch (err) {
    console.error("❌ OTP send error:", err.message);
    console.error("❌ Full error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to send OTP. Please check your email address and try again.",
      error: err.message 
    });
  }
};

// 🔹 VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore[email];
    if (!record)
      return res.status(400).json({ message: "No OTP requested for this email" });
    if (Date.now() > record.expires)
      return res.status(400).json({ message: "OTP expired" });
    if (record.otp != otp)
      return res.status(400).json({ message: "Invalid OTP" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    delete otpStore[email];
    res.json({ message: "✅ OTP verified successfully", token, user });
  } catch (err) {
    console.error("❌ OTP verify error:", err);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

// 🔹 GET PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("❌ Profile error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};
