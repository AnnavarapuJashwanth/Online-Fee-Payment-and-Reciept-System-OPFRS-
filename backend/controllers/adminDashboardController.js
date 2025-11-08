import Payment from "../models/Payment.js";
import User from "../models/User.js";
import FeeStructure from "../models/FeeStructure.js";
import ActivityLog from "../models/ActivityLog.js";

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's revenue
    const todayPayments = await Payment.aggregate([
      {
        $match: {
          status: "paid",
          createdAt: { $gte: today, $lt: tomorrow },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const todayRevenue = todayPayments[0]?.total || 0;

    // Total collected (all time)
    const totalCollected = await Payment.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalAmount = totalCollected[0]?.total || 0;

    // Pending dues (pending payments)
    const pendingDues = await Payment.aggregate([
      {
        $match: { status: { $in: ["pending", "created"] } },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const pendingAmount = pendingDues[0]?.total || 0;

    // Total students
    const totalStudents = await User.countDocuments();

    // Total transactions
    const totalTransactions = await Payment.countDocuments({ status: "paid" });

    // Pending students count
    const pendingStudents = await Payment.distinct("userId", {
      status: { $in: ["pending", "created"] },
    });

    res.json({
      success: true,
      stats: {
        todayRevenue,
        totalCollected: totalAmount,
        pendingDues: pendingAmount,
        totalStudents,
        totalTransactions,
        pendingStudentsCount: pendingStudents.length,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/dashboard/recent-activity
// @access  Private (Admin)
export const getRecentActivity = async (req, res) => {
  try {
    const recentPayments = await Payment.find({ status: "paid" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name regno email");

    const activities = recentPayments.map((payment) => ({
      student: payment.userId?.name || "Unknown",
      regno: payment.userId?.regno || "N/A",
      amount: payment.amount,
      type: payment.feeType || "Fee Payment",
      date: payment.createdAt,
      status: payment.status,
      paymentId: payment.paymentId,
    }));

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("❌ Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recent activity",
      error: error.message,
    });
  }
};

// @desc    Get monthly revenue data
// @route   GET /api/admin/dashboard/monthly-revenue
// @access  Private (Admin)
export const getMonthlyRevenue = async (req, res) => {
  try {
    const monthlyData = await Payment.aggregate([
      {
        $match: { status: "paid" },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $limit: 12,
      },
    ]);

    const formattedData = monthlyData.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      revenue: item.revenue,
      count: item.count,
    }));

    res.json({
      success: true,
      data: formattedData,
    });
  } catch (error) {
    console.error("❌ Error fetching monthly revenue:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching monthly revenue",
      error: error.message,
    });
  }
};

// @desc    Get all payments with filters
// @route   GET /api/admin/payments
// @access  Private (Admin)
export const getAllPayments = async (req, res) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 50 } = req.query;

    let query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search by student name, regno, or payment ID
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { regno: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map((u) => u._id);

      query.$or = [
        { userId: { $in: userIds } },
        { paymentId: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate("userId", "name regno email phone year semester branch")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// @desc    Get all students with payment status
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
  try {
    const { year, search, page = 1, limit = 50 } = req.query;

    let query = {};

    if (year && year !== "all") {
      query.year = year;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { regno: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const students = await User.find(query)
      .select("name regno email phone year semester branch category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get payment info for each student
    const studentsWithPayments = await Promise.all(
      students.map(async (student) => {
        const payments = await Payment.find({ userId: student._id });
        
        const totalPaid = payments
          .filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + p.amount, 0);
        
        const totalPending = payments
          .filter((p) => p.status !== "paid")
          .reduce((sum, p) => sum + p.amount, 0);

        const paidCount = payments.filter((p) => p.status === "paid").length;
        const pendingCount = payments.filter((p) => p.status !== "paid").length;

        let feeStatus = "Not Started";
        if (paidCount > 0 && pendingCount === 0) feeStatus = "Fully Paid";
        else if (paidCount > 0 && pendingCount > 0) feeStatus = "Partially Paid";
        else if (pendingCount > 0) feeStatus = "Pending";

        return {
          ...student.toObject(),
          totalPaid,
          totalPending,
          paidCount,
          pendingCount,
          feeStatus,
        };
      })
    );

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      students: studentsWithPayments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching students",
      error: error.message,
    });
  }
};
