import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile
router.put("/", verifyToken, async (req, res) => {
  try {
    const { name, phone, year, semester, branch, section, profilePhoto, category } = req.body;
    
    console.log("📝 Profile update request for user:", req.user._id);
    console.log("📝 Update data:", {
      name,
      phone,
      year,
      semester,
      branch,
      section,
      category,
      hasProfilePhoto: !!profilePhoto
    });
    
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("❌ User not found:", req.user._id);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update fields (allow empty strings to be set)
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (year !== undefined) user.year = year;
    if (semester !== undefined) user.semester = semester;
    if (branch !== undefined) user.branch = branch;
    if (section !== undefined) user.section = section;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    if (category !== undefined) user.category = category;

    await user.save();
    console.log("✅ Profile updated successfully for user:", user.regno);

    const updatedUser = await User.findById(user._id).select("-password");
    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Profile update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
