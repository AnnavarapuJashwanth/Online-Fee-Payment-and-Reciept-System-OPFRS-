import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

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

const createTestStudent = async () => {
  try {
    await connectDB();

    const testStudent = {
      name: "Test Student",
      regno: "test123456", // Will be stored as lowercase
      email: "jashwanthannavarapu99@gmail.com",
      phone: "9876543210",
      password: "TestPass123"
    };

    console.log("🔍 Checking for existing test student...");
    
    // Check if student already exists
    let student = await User.findOne({ 
      $or: [
        { regno: testStudent.regno.toLowerCase() },
        { email: testStudent.email.toLowerCase() }
      ]
    });

    if (student) {
      console.log("📝 Updating existing test student...");
      // Update existing student
      const hashedPassword = await bcrypt.hash(testStudent.password, 10);
      student.password = hashedPassword;
      student.name = testStudent.name;
      student.phone = testStudent.phone;
      await student.save();
      console.log("✅ Test student updated successfully");
    } else {
      console.log("👤 Creating new test student...");
      // Create new student
      const hashedPassword = await bcrypt.hash(testStudent.password, 10);
      student = await User.create({
        name: testStudent.name,
        regno: testStudent.regno.toLowerCase(),
        email: testStudent.email.toLowerCase(),
        phone: testStudent.phone,
        password: hashedPassword,
      });
      console.log("✅ Test student created successfully");
    }

    console.log("\n📊 Test Student Details:");
    console.log(`   - Name: ${student.name}`);
    console.log(`   - Regno: ${student.regno}`);
    console.log(`   - Email: ${student.email}`);
    console.log(`   - Phone: ${student.phone}`);
    console.log(`   - Password: ${testStudent.password}`);
    console.log(`   - ID: ${student._id}`);

    // List all students for debugging
    console.log("\n📋 All students in database:");
    const allStudents = await User.find({}, 'name regno email').limit(10);
    allStudents.forEach((s, index) => {
      console.log(`   ${index + 1}. ${s.name} - ${s.regno} - ${s.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test student:", error);
    process.exit(1);
  }
};

createTestStudent();
