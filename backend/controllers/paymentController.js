import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import { sendReceipt } from "../utils/mailer.js";

// ✅ Get Razorpay configuration (will be validated when first used)
const getRazorpayConfig = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    throw new Error("❌ Missing Razorpay credentials in environment variables! Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file");
  }
  
  return { keyId, keySecret };
};

// ✅ Create Razorpay instance with lazy configuration
const createRazorpayInstance = () => {
  const { keyId, keySecret } = getRazorpayConfig();
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// ✅ Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { amount, name, email, phone, regno, feeType, userId } = req.body;

    if (!amount || !name || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const options = {
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpay = createRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Save order in MongoDB
    await Payment.create({
      userId,
      orderId: order.id,
      amount,
      currency: "INR",
      status: "created",
      name,
      email,
      phone,
      regno,
      feeType: feeType || "General",
    });

    console.log(`🧾 Order created for ₹${amount} | ${email}`);
    res.json({
      success: true,
      message: "Order created successfully",
      order,
      key: getRazorpayConfig().keyId,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
};

// ✅ Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    const { keySecret } = getRazorpayConfig();
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", keySecret)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // ✅ Update payment record
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { 
          paymentId: razorpay_payment_id, 
          status: "paid",
          signature: razorpay_signature,
          updatedAt: Date.now()
        },
        { new: true }
      );

      // ✅ Update user's pending fee and total paid
      if (payment && payment.userId) {
        await User.findByIdAndUpdate(payment.userId, {
          $inc: {
            totalPaid: payment.amount,
            pendingFee: -payment.amount,
          },
        });
        console.log(`✅ Updated pending fee for user ${payment.userId}`);
      }

      // ✅ Send email receipt
      if (payment && payment.email) {
        await sendReceipt(payment);
        console.log(`✅ Payment verified & receipt sent to ${payment.email}`);
      } else {
        console.warn("⚠️ Payment record not found or missing email");
      }

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get User Transactions
export const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const transactions = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ success: false, message: "Error fetching transactions" });
  }
};

// ✅ Get All Transactions (for admin or user's own)
export const getAllTransactions = async (req, res) => {
  try {
    const { email } = req.query;
    
    const query = email ? { email } : {};
    const transactions = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error("❌ Error fetching all transactions:", error);
    res.status(500).json({ success: false, message: "Error fetching transactions" });
  }
};

// ✅ Get Transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Payment.findById(id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    
    res.json({
      success: true,
      transaction
    });
  } catch (error) {
    console.error("❌ Error fetching transaction:", error);
    res.status(500).json({ success: false, message: "Error fetching transaction" });
  }
};

// ✅ Get Payment Stats for User
export const getPaymentStats = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get all paid transactions for user
    const paidTransactions = await Payment.find({ userId, status: "paid" });
    
    // Calculate total paid
    const totalPaid = paidTransactions.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get transaction count
    const transactions = paidTransactions.length;
    
    // For pending, you can calculate based on expected fees vs paid
    // For now, setting it to 0 as we don't have a pending fee structure
    const pending = 0;
    
    res.json({
      success: true,
      stats: {
        totalPaid,
        pending,
        transactions
      }
    });
  } catch (error) {
    console.error("❌ Error fetching payment stats:", error);
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
};
