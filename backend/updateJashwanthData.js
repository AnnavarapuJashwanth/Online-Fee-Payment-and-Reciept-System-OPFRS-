import mongoose from "mongoose";
import User from "./models/User.js";
import Payment from "./models/Payment.js";
import dotenv from "dotenv";

dotenv.config();

const updateJashwanthData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Find Jashwanth's user record
    const jashwanth = await User.findOne({ 
      $or: [
        { email: /jashwanth/i },
        { name: /jashwanth/i },
        { regno: /jashwanth/i }
      ]
    });

    if (jashwanth) {
      console.log("📋 Current Jashwanth Data:");
      console.log("Name:", jashwanth.name);
      console.log("Email:", jashwanth.email);
      console.log("Registration:", jashwanth.regno);
      console.log("Current Pending Fee:", jashwanth.pendingFee);
      console.log("Current Total Paid:", jashwanth.totalPaid);

      // Update Jashwanth's data to show correct pending amount
      const updatedUser = await User.findByIdAndUpdate(
        jashwanth._id,
        {
          pendingFee: 50505, // Set correct pending fee
          semesterFee: 50505, // Set semester fee
          totalPaid: jashwanth.totalPaid || 0
        },
        { new: true }
      );

      console.log("✅ Updated Jashwanth Data:");
      console.log("Name:", updatedUser.name);
      console.log("Pending Fee:", updatedUser.pendingFee);
      console.log("Total Paid:", updatedUser.totalPaid);

      // Check Jashwanth's payments
      const payments = await Payment.find({ userId: jashwanth._id });
      console.log("💳 Jashwanth's Payments:", payments.length);
      
      let totalPaidFromPayments = 0;
      payments.forEach(payment => {
        console.log(`- Payment: ₹${payment.amount} (${payment.status})`);
        if (payment.status === 'paid') {
          totalPaidFromPayments += payment.amount;
        }
      });

      console.log("💰 Total Paid from Payments:", totalPaidFromPayments);
      console.log("💰 Actual Pending:", 50505 - totalPaidFromPayments);

    } else {
      console.log("❌ Jashwanth not found in database");
      
      // Show all users to find the correct one
      const allUsers = await User.find({}).select('name email regno pendingFee totalPaid');
      console.log("👥 All Users:");
      allUsers.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Pending: ₹${user.pendingFee}, Paid: ₹${user.totalPaid}`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  }
};

updateJashwanthData();
