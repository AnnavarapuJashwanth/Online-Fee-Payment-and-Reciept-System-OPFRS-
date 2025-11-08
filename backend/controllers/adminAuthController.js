import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import ActivityLog from "../models/ActivityLog.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Admin login attempt:", email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      console.log("❌ Admin account is inactive:", email);
      return res.status(401).json({
        success: false,
        message: "Account is inactive. Contact super admin.",
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      console.log("❌ Invalid password for admin:", email);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login and login history
    admin.lastLogin = new Date();
    admin.loginHistory.push({
      timestamp: new Date(),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    // Keep only last 10 login records
    if (admin.loginHistory.length > 10) {
      admin.loginHistory = admin.loginHistory.slice(-10);
    }

    await admin.save();

    // Log activity
    await ActivityLog.create({
      userId: admin._id,
      userType: "admin",
      action: "login",
      description: `Admin ${admin.name} logged in`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"],
    });

    // Generate token
    const token = generateToken(admin._id);

    console.log("✅ Admin login successful:", email);

    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("❌ Get admin profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Create initial admin (run once)
// @route   POST /api/admin/create-initial
// @access  Public (should be protected in production)
export const createInitialAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists. Use login instead.",
      });
    }

    // Create initial admin with credentials from environment
    const adminEmail = process.env.ADMIN_EMAIL || "sravanthivarikuti233@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Sravanthi4651";
    
    const admin = await Admin.create({
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      name: "Sravanthi Varikuti",
      role: "superadmin",
      isActive: true,
    });

    console.log("✅ Initial admin created successfully");

    res.status(201).json({
      success: true,
      message: "Initial admin created successfully",
      credentials: {
        email: adminEmail,
        password: adminPassword,
        note: "Admin account created successfully",
      },
    });
  } catch (error) {
    console.error("❌ Create initial admin error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc    Change admin password
// @route   PUT /api/admin/change-password
// @access  Private (Admin)
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const admin = await Admin.findById(req.admin._id);

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Log activity
    await ActivityLog.create({
      userId: admin._id,
      userType: "admin",
      action: "profile_updated",
      description: `Admin ${admin.name} changed password`,
    });

    console.log("✅ Admin password changed:", admin.email);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
