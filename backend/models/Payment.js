import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: String,
  paymentId: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  status: { type: String, default: "pending" },
  name: String,
  email: String,
  phone: String,
  regno: String,
  feeType: String, // Tuition, Exam, Library, Lab
  paymentMethod: String,
  signature: String,
  receiptUrl: String, // PDF receipt URL
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Payment", paymentSchema);
