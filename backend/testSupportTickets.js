import mongoose from "mongoose";
import dotenv from "dotenv";
import Support from "./models/Support.js";
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

const testSupportTickets = async () => {
  try {
    await connectDB();

    console.log("🎫 Checking support tickets...");
    
    // Count total tickets
    const totalTickets = await Support.countDocuments();
    console.log(`📊 Total support tickets: ${totalTickets}`);
    
    if (totalTickets === 0) {
      console.log("📝 No tickets found, creating sample tickets...");
      
      // Get a sample user
      const sampleUser = await User.findOne();
      if (!sampleUser) {
        console.log("❌ No users found, cannot create sample tickets");
        process.exit(0);
      }
      
      console.log(`👤 Using sample user: ${sampleUser.name} (${sampleUser.email})`);
      
      // Create sample tickets
      const sampleTickets = [
        {
          userId: sampleUser._id,
          subject: "Payment Gateway Issue",
          category: "Payment Issue",
          priority: "High",
          description: "I'm unable to complete my fee payment. The payment gateway shows an error after entering card details.",
          status: "Open"
        },
        {
          userId: sampleUser._id,
          subject: "Fee Receipt Not Generated",
          category: "Fee Related",
          priority: "Medium",
          description: "I completed my payment but the receipt was not generated. Please help me get the receipt.",
          status: "In Progress"
        },
        {
          userId: sampleUser._id,
          subject: "Login Issues",
          category: "Technical Support",
          priority: "Low",
          description: "I'm having trouble logging into my account. The password reset is not working.",
          status: "Resolved"
        }
      ];
      
      for (const ticketData of sampleTickets) {
        const ticket = await Support.create(ticketData);
        console.log(`✅ Created ticket: ${ticket.ticketId} - ${ticket.subject}`);
      }
      
      console.log("🎉 Sample tickets created successfully!");
    } else {
      // Show existing tickets
      const tickets = await Support.find()
        .populate("userId", "name email regno")
        .select("ticketId subject category priority status createdAt userId")
        .sort({ createdAt: -1 })
        .limit(10);
      
      console.log("\n🎫 Recent support tickets:");
      tickets.forEach((ticket, index) => {
        console.log(`${index + 1}. ${ticket.ticketId}`);
        console.log(`   Subject: ${ticket.subject}`);
        console.log(`   Student: ${ticket.userId?.name || 'N/A'} (${ticket.userId?.regno || 'N/A'})`);
        console.log(`   Category: ${ticket.category}`);
        console.log(`   Priority: ${ticket.priority}`);
        console.log(`   Status: ${ticket.status}`);
        console.log(`   Created: ${ticket.createdAt}`);
        console.log("");
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

testSupportTickets();
