import Refund from "../models/Refund.js";
import Payment from "../models/Payment.js";

// Get user refunds
export const getUserRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({ userId: req.user._id })
      .populate("transactionId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      refunds,
      count: refunds.length,
    });
  } catch (error) {
    console.error("❌ Error fetching refunds:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all refunds (admin)
export const getAllRefunds = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const refunds = await Refund.find(filter)
      .populate("userId", "name email regno")
      .populate("transactionId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      refunds,
      count: refunds.length,
    });
  } catch (error) {
    console.error("❌ Error fetching refunds:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create refund request
export const createRefund = async (req, res) => {
  try {
    const { transactionId, amount, reason, bankDetails } = req.body;

    // Verify transaction exists and belongs to user
    const transaction = await Payment.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const refund = await Refund.create({
      userId: req.user._id,
      transactionId,
      amount,
      reason,
      bankDetails,
      timeline: [{
        status: "Request Submitted",
        date: Date.now(),
        note: "Refund request submitted by student",
      }],
    });

    res.status(201).json({
      success: true,
      message: "Refund request submitted successfully",
      refund,
    });
  } catch (error) {
    console.error("❌ Error creating refund:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update refund status (admin)
export const updateRefundStatus = async (req, res) => {
  try {
    const { status, comments } = req.body;

    const refund = await Refund.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({ success: false, message: "Refund not found" });
    }

    refund.status = status;
    refund.comments = comments;
    refund.processedBy = req.user._id;

    // Update timeline
    refund.timeline.push({
      status,
      date: Date.now(),
      note: comments || `Status updated to ${status}`,
    });

    // Update dates based on status
    if (status === "Request Approved") {
      refund.approvedDate = Date.now();
    } else if (status === "Refund Completed") {
      refund.completedDate = Date.now();
    }

    await refund.save();

    res.json({
      success: true,
      message: "Refund status updated successfully",
      refund,
    });
  } catch (error) {
    console.error("❌ Error updating refund:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get refund by ID
export const getRefundById = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id)
      .populate("userId", "name email regno")
      .populate("transactionId");

    if (!refund) {
      return res.status(404).json({ success: false, message: "Refund not found" });
    }

    res.json({ success: true, refund });
  } catch (error) {
    console.error("❌ Error fetching refund:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
