import mongoose from "mongoose";
import FeeStructure from "./models/FeeStructure.js";
import dotenv from "dotenv";

dotenv.config();

const createTestFee = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Create a test fee
    const testFee = new FeeStructure({
      feeName: "Library Fee",
      category: "Library",
      amount: 2500,
      description: "Annual library access and book borrowing fee",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "Active",
      applicableClasses: ["All Classes"],
      academicYear: "2024-25"
    });

    await testFee.save();
    console.log("✅ Test fee created:", testFee.feeName);

    // Create another test fee
    const testFee2 = new FeeStructure({
      feeName: "Sports Fee",
      category: "Sports",
      amount: 1500,
      description: "Sports facilities and equipment usage fee",
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      status: "Active",
      applicableClasses: ["All Classes"],
      academicYear: "2024-25"
    });

    // Create exam fee
    const testFee3 = new FeeStructure({
      feeName: "Mid-term Examination Fee",
      category: "Examination",
      amount: 1000,
      description: "Fee for mid-term examinations",
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: "Active",
      applicableClasses: ["All Classes"],
      academicYear: "2024-25"
    });

    await testFee2.save();
    console.log("✅ Test fee created:", testFee2.feeName);

    await testFee3.save();
    console.log("✅ Test fee created:", testFee3.feeName);

    // List all fees
    const allFees = await FeeStructure.find({ status: "Active" });
    console.log("📋 All Active Fees:");
    allFees.forEach(fee => {
      console.log(`- ${fee.feeName}: ₹${fee.amount} (${fee.category})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
};

createTestFee();
