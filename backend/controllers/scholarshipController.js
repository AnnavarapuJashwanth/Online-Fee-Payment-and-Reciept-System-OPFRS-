import Scholarship from "../models/Scholarship.js";

// Get all scholarships for a user
export const getUserScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      scholarships,
      count: scholarships.length,
    });
  } catch (error) {
    console.error("❌ Error fetching scholarships:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all scholarships (admin)
export const getAllScholarships = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const scholarships = await Scholarship.find(filter)
      .populate("userId", "name email regno")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      scholarships,
      count: scholarships.length,
    });
  } catch (error) {
    console.error("❌ Error fetching scholarships:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create scholarship application
export const createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Scholarship application submitted successfully",
      scholarship,
    });
  } catch (error) {
    console.error("❌ Error creating scholarship:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update scholarship status (admin)
export const updateScholarshipStatus = async (req, res) => {
  try {
    const { status, comments, amount } = req.body;

    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      {
        status,
        comments,
        amount,
        reviewedBy: req.user._id,
        reviewedDate: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    res.json({
      success: true,
      message: "Scholarship status updated successfully",
      scholarship,
    });
  } catch (error) {
    console.error("❌ Error updating scholarship:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get scholarship by ID
export const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id)
      .populate("userId", "name email regno");

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Scholarship not found" });
    }

    res.json({ success: true, scholarship });
  } catch (error) {
    console.error("❌ Error fetching scholarship:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
