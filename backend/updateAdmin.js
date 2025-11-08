import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

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

const updateAdmin = async () => {
  try {
    await connectDB();

    const newEmail = process.env.ADMIN_EMAIL || "sravanthivarikuti233@gmail.com";
    const newPassword = process.env.ADMIN_PASSWORD || "Admin@Sravanthi4651";

    console.log("🔍 Finding existing admin...");
    
    // Find any existing admin
    let admin = await Admin.findOne();

    if (!admin) {
      console.log("👤 No admin found, creating new one...");
      admin = await Admin.create({
        email: newEmail.toLowerCase(),
        password: newPassword,
        name: "Sravanthi Varikuti",
        role: "superadmin",
        isActive: true,
      });
      console.log("✅ New admin created successfully");
    } else {
      console.log("📝 Updating existing admin...");
      console.log(`   - Old email: ${admin.email}`);
      
      // Update existing admin
      admin.email = newEmail.toLowerCase();
      admin.password = newPassword; // This will be hashed by the pre-save middleware
      admin.name = "Sravanthi Varikuti";
      admin.role = "superadmin";
      admin.isActive = true;
      
      await admin.save();
      console.log("✅ Admin updated successfully");
    }

    console.log("\n📊 Updated Admin Details:");
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Name: ${admin.name}`);
    console.log(`   - Role: ${admin.role}`);
    console.log(`   - Active: ${admin.isActive}`);
    console.log(`   - Password: ${newPassword}`);
    console.log("\n🎉 Admin credentials updated! You can now login with the new credentials.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating admin:", error);
    process.exit(1);
  }
};

updateAdmin();
