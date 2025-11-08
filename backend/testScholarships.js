import mongoose from "mongoose";
import dotenv from "dotenv";
import Scholarship from "./models/Scholarship.js";

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

const testScholarships = async () => {
  try {
    await connectDB();

    console.log("🔍 Checking scholarships...");
    
    // Count total scholarships
    const totalCount = await Scholarship.countDocuments();
    console.log(`📊 Total scholarships: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log("✅ No scholarships found");
      process.exit(0);
    }
    
    // Get first few scholarships with minimal data
    const scholarships = await Scholarship.find()
      .select("_id studentId fullName scholarshipType status createdAt")
      .limit(5)
      .lean();
    
    console.log("\n📋 Sample scholarships:");
    scholarships.forEach((scholarship, index) => {
      console.log(`${index + 1}. ID: ${scholarship._id}`);
      console.log(`   Student: ${scholarship.fullName} (${scholarship.studentId})`);
      console.log(`   Type: ${scholarship.scholarshipType}`);
      console.log(`   Status: ${scholarship.status}`);
      console.log(`   Created: ${scholarship.createdAt}`);
      console.log("");
    });
    
    // Check for documents field size
    const scholarshipWithDocs = await Scholarship.findOne().select("documents").lean();
    if (scholarshipWithDocs && scholarshipWithDocs.documents) {
      console.log(`📄 Documents array length: ${scholarshipWithDocs.documents.length}`);
      if (scholarshipWithDocs.documents.length > 0) {
        console.log(`📄 First document: ${JSON.stringify(scholarshipWithDocs.documents[0]).length} characters`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testScholarships();
