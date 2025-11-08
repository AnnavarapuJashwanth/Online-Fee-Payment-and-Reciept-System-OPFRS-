import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Unread", "High Priority", "Fee Payment", "Examination", "Event", "Holiday", "General", "Academic"],
      default: "General",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    targetAudience: {
      type: String,
      enum: ["all", "students", "faculty", "specific"],
      default: "all",
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiryDate: {
      type: Date,
    },
    attachments: [{
      name: String,
      url: String,
    }],
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
