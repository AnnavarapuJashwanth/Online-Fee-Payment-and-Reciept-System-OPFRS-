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

const optimizeScholarships = async () => {
  try {
    await connectDB();

    console.log("🔧 Optimizing scholarship collection...");
    
    // Create compound indexes for better performance
    await Scholarship.collection.createIndex({ status: 1, createdAt: -1 });
    await Scholarship.collection.createIndex({ userId: 1, status: 1 });
    await Scholarship.collection.createIndex({ createdAt: -1 });
    
    console.log("✅ Indexes created successfully");
    
    // Get collection stats
    const stats = await Scholarship.collection.stats();
    console.log(`📊 Collection stats:`);
    console.log(`   - Documents: ${stats.count}`);
    console.log(`   - Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   - Indexes: ${stats.nindexes}`);
    
    // List all indexes
    const indexes = await Scholarship.collection.indexes();
    console.log(`📋 Indexes:`);
    indexes.forEach((index, i) => {
      console.log(`   ${i + 1}. ${JSON.stringify(index.key)}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error optimizing:", error);
    process.exit(1);
  }
};

optimizeScholarships();
