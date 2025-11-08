import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userType: {
    type: String,
    enum: ["student", "admin"],
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      "login",
      "logout",
      "payment_made",
      "payment_verified",
      "profile_updated",
      "fee_created",
      "fee_updated",
      "fee_deleted",
      "student_uploaded",
      "reminder_sent",
      "report_generated",
      "scholarship_applied",
      "scholarship_approved",
      "scholarship_rejected",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ userType: 1, action: 1 });
activityLogSchema.index({ timestamp: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
