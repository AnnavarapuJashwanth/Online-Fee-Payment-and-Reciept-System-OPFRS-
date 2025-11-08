import FeeStructure from "../models/FeeStructure.js";
import ActivityLog from "../models/ActivityLog.js";
import Announcement from "../models/Announcement.js";

// @desc    Get all fees
// @route   GET /api/admin/fees
// @access  Private (Admin)
export const getAllFees = async (req, res) => {
  try {
    const fees = await FeeStructure.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      fees,
    });
  } catch (error) {
    console.error("❌ Error fetching fees:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching fees",
      error: error.message,
    });
  }
};

// @desc    Create new fee
// @route   POST /api/admin/fees
// @access  Private (Admin)
export const createFee = async (req, res) => {
  try {
    const {
      feeName,
      category,
      amount,
      lateFee,
      dueDate,
      status,
      description,
      applicableClasses,
    } = req.body;

    // Validation
    if (!feeName || !category || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const fee = await FeeStructure.create({
      feeName,
      category,
      amount,
      lateFee: lateFee || 0,
      dueDate,
      status: status || "Active",
      description,
      applicableClasses: applicableClasses || ["All Classes"],
      createdBy: req.admin._id,
    });

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "fee_created",
      description: `Created fee: ${feeName} - ₹${amount}`,
      metadata: { feeId: fee._id, feeName, amount },
    });

    // Create announcement for students
    await Announcement.create({
      title: `New Fee: ${feeName}`,
      content: `A new fee has been added: ${feeName} - ₹${amount}. ${description || ''}\n\nDue Date: ${new Date(dueDate).toLocaleDateString('en-IN')}\n\nPlease pay before the due date to avoid late fees.`,
      category: "Fee Payment",
      priority: "high",
      targetAudience: "students",
      postedBy: req.admin._id,
      expiryDate: dueDate,
    });

    console.log("✅ Fee created:", feeName);
    console.log("✅ Announcement created for new fee");

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee,
    });
  } catch (error) {
    console.error("❌ Error creating fee:", error);
    res.status(500).json({
      success: false,
      message: "Error creating fee",
      error: error.message,
    });
  }
};

// @desc    Update fee
// @route   PUT /api/admin/fees/:id
// @access  Private (Admin)
export const updateFee = async (req, res) => {
  try {
    const fee = await FeeStructure.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    const updatedFee = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "fee_updated",
      description: `Updated fee: ${updatedFee.feeName}`,
      metadata: { feeId: updatedFee._id },
    });

    console.log("✅ Fee updated:", updatedFee.feeName);

    res.json({
      success: true,
      message: "Fee updated successfully",
      fee: updatedFee,
    });
  } catch (error) {
    console.error("❌ Error updating fee:", error);
    res.status(500).json({
      success: false,
      message: "Error updating fee",
      error: error.message,
    });
  }
};

// @desc    Delete fee
// @route   DELETE /api/admin/fees/:id
// @access  Private (Admin)
export const deleteFee = async (req, res) => {
  try {
    const fee = await FeeStructure.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee not found",
      });
    }

    await FeeStructure.findByIdAndDelete(req.params.id);

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "fee_deleted",
      description: `Deleted fee: ${fee.feeName}`,
      metadata: { feeId: fee._id, feeName: fee.feeName },
    });

    console.log("✅ Fee deleted:", fee.feeName);

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting fee:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting fee",
      error: error.message,
    });
  }
};
