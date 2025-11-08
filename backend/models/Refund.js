import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Request Submitted", "Request Approved", "Processing Refund", "Refund Completed", "Rejected"],
      default: "Request Submitted",
    },
    requestDate: {
      type: Date,
      default: Date.now,
    },
    approvedDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    refundMethod: {
      type: String,
      enum: ["Bank Transfer", "Original Payment Method", "Cheque", "Cash"],
      default: "Original Payment Method",
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    comments: {
      type: String,
    },
    timeline: [{
      status: String,
      date: Date,
      note: String,
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Refund", refundSchema);
