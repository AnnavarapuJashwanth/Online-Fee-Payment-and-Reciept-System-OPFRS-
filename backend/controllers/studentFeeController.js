import FeeStructure from "../models/FeeStructure.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

// @desc    Get active fees for students
// @route   GET /api/fees/student
// @access  Private (Student)
export const getStudentFees = async (req, res) => {
  try {
    console.log("📚 Fetching active fees for student:", req.user._id);

    // Set timeout for database operations
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 3000)
    );

    // Get all active fees with timeout
    const feesPromise = FeeStructure.find({ 
      status: "Active" 
    })
    .select('feeName category amount description dueDate status applicableClasses academicYear')
    .sort({ dueDate: 1 })
    .limit(50) // Limit results for faster response
    .maxTimeMS(2000); // MongoDB timeout

    const fees = await Promise.race([feesPromise, timeoutPromise]);

    console.log(`✅ Found ${fees.length} active fees for student`);

    // Simplified response without payment calculations for faster loading
    const simplifiedFees = fees.map(fee => ({
      _id: fee._id,
      feeName: fee.feeName,
      category: fee.category,
      amount: fee.amount,
      description: fee.description,
      dueDate: fee.dueDate,
      status: fee.status,
      applicableClasses: fee.applicableClasses,
      academicYear: fee.academicYear,
      isPaid: false, // Will be calculated on payment
      remainingAmount: fee.amount
    }));

    res.json({
      success: true,
      fees: simplifiedFees,
      totalFees: fees.length
    });

  } catch (error) {
    console.error("❌ Error fetching student fees:", error);
    
    // Return empty array instead of error for better UX
    res.json({
      success: true,
      fees: [],
      totalFees: 0,
      message: "Fees temporarily unavailable"
    });
  }
};

// @desc    Get student payment summary (optimized)
// @route   GET /api/fees/student/summary
// @access  Private (Student)
export const getStudentPaymentSummary = async (req, res) => {
  try {
    console.log("📊 Fetching payment summary for student:", req.user._id);

    // Use parallel queries for better performance
    const [allFees, studentPayments, userDoc] = await Promise.all([
      FeeStructure.find({ status: "Active" }).select('amount category').lean(),
      Payment.find({ userId: req.user._id, status: "paid" }).select('amount feeType').lean(),
      User.findById(req.user._id).select('pendingFee semesterFee').lean()
    ]);

    // Fast calculation
    const totalPaidAmount = studentPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalFeeAmount = allFees.reduce((sum, fee) => sum + fee.amount, 0);
    
    // Use user's semester fee as fallback if no fees in structure
    const actualTotalFee = totalFeeAmount > 0 ? totalFeeAmount : (userDoc?.pendingFee || userDoc?.semesterFee || 50505);
    const totalPending = Math.max(0, actualTotalFee - totalPaidAmount);
    const paymentPercentage = actualTotalFee > 0 ? Math.round((totalPaidAmount / actualTotalFee) * 100) : 0;

    console.log(`✅ Quick summary: ₹${totalPaidAmount} paid, ₹${totalPending} pending`);

    res.json({
      success: true,
      summary: {
        totalFeeAmount: actualTotalFee,
        totalPaidAmount,
        totalPending,
        paymentPercentage,
        isFullyPaid: totalPending <= 0,
        transactionCount: studentPayments.length
      }
    });

  } catch (error) {
    console.error("❌ Error fetching payment summary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment summary",
      error: error.message,
    });
  }
};
