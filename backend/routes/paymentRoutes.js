import express from "express";
import { 
  createOrder, 
  verifyPayment, 
  getUserTransactions, 
  getAllTransactions,
  getTransactionById,
  getPaymentStats
} from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Create a Razorpay order
router.post("/create-order", createOrder);

// ✅ Verify Razorpay payment
router.post("/verify", verifyPayment);

// ✅ Get user transactions
router.get("/transactions/user/:userId", getUserTransactions);

// ✅ Get all transactions (with optional email filter)
router.get("/transactions", getAllTransactions);

// ✅ Get transaction by ID
router.get("/transaction/:id", getTransactionById);

// ✅ Get payment stats for user
router.get("/stats", verifyToken, getPaymentStats);

export default router;
