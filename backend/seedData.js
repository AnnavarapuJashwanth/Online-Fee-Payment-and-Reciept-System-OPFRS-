import mongoose from "mongoose";
import dotenv from "dotenv";
import Announcement from "./models/Announcement.js";
import Scholarship from "./models/Scholarship.js";
import Refund from "./models/Refund.js";
import Support from "./models/Support.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const sampleAnnouncements = [
  {
    title: "Fee Payment Deadline Extended",
    content: "The deadline for semester fee payment has been extended to November 15, 2025. Please ensure timely payment to avoid late fees.",
    category: "Fee Payment",
    priority: "high",
    targetAudience: "all",
  },
  {
    title: "Mid-Term Examination Schedule Released",
    content: "The mid-term examination schedule for all departments has been released. Please check your respective department notice boards for detailed timetables.",
    category: "Examination",
    priority: "high",
    targetAudience: "students",
  },
  {
    title: "Annual Sports Day - November 20, 2025",
    content: "The annual sports day will be held on November 20, 2025. All students are encouraged to participate. Registration is open until November 10.",
    category: "Event",
    priority: "medium",
    targetAudience: "all",
  },
  {
    title: "Diwali Holiday Notice",
    content: "The college will remain closed from November 12-14, 2025 on account of Diwali festival. Regular classes will resume on November 15.",
    category: "Holiday",
    priority: "medium",
    targetAudience: "all",
  },
  {
    title: "Library Timings Extended",
    content: "Library timings have been extended during examination period. The library will now be open from 8:00 AM to 10:00 PM on all working days.",
    category: "Academic",
    priority: "low",
    targetAudience: "students",
  },
  {
    title: "Guest Lecture on AI and Machine Learning",
    content: "A guest lecture on 'Future of AI and Machine Learning' will be conducted by Dr. Rajesh Kumar on November 18, 2025 at 2:00 PM in the main auditorium.",
    category: "Academic",
    priority: "medium",
    targetAudience: "students",
  },
  {
    title: "Hostel Fee Payment Reminder",
    content: "This is a reminder to all hostel residents to clear their pending hostel fees by November 10, 2025. Late payment will attract a penalty of ₹500.",
    category: "Fee Payment",
    priority: "high",
    targetAudience: "students",
  },
  {
    title: "Technical Fest - TechnoVision 2025",
    content: "The annual technical fest 'TechnoVision 2025' will be held from December 5-7, 2025. Students can register for various competitions and workshops.",
    category: "Event",
    priority: "medium",
    targetAudience: "all",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Announcement.deleteMany({});
    await Scholarship.deleteMany({});
    await Refund.deleteMany({});
    await Support.deleteMany({});

    // Seed Announcements
    console.log("📢 Seeding announcements...");
    await Announcement.insertMany(sampleAnnouncements);
    console.log(`✅ ${sampleAnnouncements.length} announcements created`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Announcements: ${sampleAnnouncements.length}`);
    console.log("\n💡 Note: Scholarships, Refunds, and Support tickets will be created when users interact with the system.");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
