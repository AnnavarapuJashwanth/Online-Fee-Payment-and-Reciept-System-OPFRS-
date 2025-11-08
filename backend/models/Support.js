import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: String,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Payment Issue", "Technical Support", "Account Issue", "Fee Related", "Refund Query", "General Query", "Other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    attachments: [{
      name: String,
      url: String,
      uploadedAt: Date,
    }],
    responses: [{
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      isStaff: Boolean,
    }],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Generate ticket ID
supportSchema.pre("save", async function (next) {
  if (!this.ticketId) {
    try {
      const count = await mongoose.model("Support").countDocuments();
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      this.ticketId = `TKT-${timestamp}-${count + 1}-${random}`;
      console.log("✅ Generated ticket ID:", this.ticketId);
    } catch (error) {
      console.error("❌ Error generating ticket ID:", error);
      // Fallback to simple timestamp-based ID
      this.ticketId = `TKT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
  }
  next();
});

export default mongoose.model("Support", supportSchema);
