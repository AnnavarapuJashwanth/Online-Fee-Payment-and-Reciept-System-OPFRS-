import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    scholarshipPerSem: {
      type: Number,
      required: true,
    },
    scholarshipType: {
      type: String,
      required: true,
      enum: ["Merit-based", "Need-based", "Sports", "Cultural", "Research", "Other"],
    },
    reasonForApplication: {
      type: String,
      required: true,
    },
    // Bank Account Details
    accountHolderName: {
      type: String,
      required: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankIFSCCode: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankBranch: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    // Documents
    documents: [{
      name: String,
      url: String,
      uploadedAt: Date,
    }],
    admissionLetterUrl: String,
    feePaymentChallanUrl: String,
    bankDocumentUrl: String, // Bank cheque/passbook xerox
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
    },
    amount: {
      type: Number,
      default: 0,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    reviewedDate: {
      type: Date,
    },
    reviewedAt: {
      type: Date,
    },
    comments: {
      type: String,
    },
    adminMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
scholarshipSchema.index({ status: 1, createdAt: -1 });
scholarshipSchema.index({ userId: 1 });

export default mongoose.model("Scholarship", scholarshipSchema);
