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

const createOrUpdateAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "sravanthivarikuti233@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@Sravanthi4651";

    console.log("🔍 Checking for existing admin...");
    
    // Check if admin already exists
    let admin = await Admin.findOne({ email: adminEmail.toLowerCase() });

    if (admin) {
      console.log("📝 Updating existing admin...");
      // Update existing admin
      admin.password = adminPassword;
      admin.isActive = true;
      admin.name = "Sravanthi Varikuti";
      admin.role = "superadmin";
      await admin.save();
      console.log("✅ Admin updated successfully");
    } else {
      console.log("👤 Creating new admin...");
      // Create new admin
      admin = await Admin.create({
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        name: "Sravanthi Varikuti",
        role: "superadmin",
        isActive: true,
      });
      console.log("✅ Admin created successfully");
    }

    console.log("\n📊 Admin Details:");
    console.log(`   - Email: ${admin.email}`);
    console.log(`   - Name: ${admin.name}`);
    console.log(`   - Role: ${admin.role}`);
    console.log(`   - Active: ${admin.isActive}`);
    console.log(`   - Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating/updating admin:", error);
    process.exit(1);
  }
};

createOrUpdateAdmin();
