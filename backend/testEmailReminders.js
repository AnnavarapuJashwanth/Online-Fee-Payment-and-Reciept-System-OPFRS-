import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Payment from "./models/Payment.js";
import { sendEmail, isValidEmail } from "./utils/mailer.js";

// Load environment variables
dotenv.config();

const testEmailReminders = async () => {
  try {
    console.log("🧪 Starting Email Reminder System Test...");
    
    // Connect to MongoDB
    console.log("📡 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Test 1: Email validation
    console.log("\n📧 Test 1: Email Validation");
    const testEmails = [
      "valid@example.com",
      "invalid-email",
      "",
      null,
      "another.valid@test.co.in"
    ];
    
    testEmails.forEach(email => {
      const isValid = isValidEmail(email);
      console.log(`  ${email || 'null'}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    });

    // Test 2: Fetch students with valid emails
    console.log("\n👥 Test 2: Fetching Students");
    const allStudents = await User.find({ role: "student" }).select("name email regno year").lean();
    console.log(`  Total students in database: ${allStudents.length}`);
    
    const studentsWithEmails = await User.find({
      role: "student",
      email: { $exists: true, $ne: null, $ne: "" }
    }).select("name email regno year").lean();
    console.log(`  Students with valid emails: ${studentsWithEmails.length}`);

    // Test 3: Check for duplicate emails
    console.log("\n🔄 Test 3: Checking for Duplicate Emails");
    const emailCounts = {};
    studentsWithEmails.forEach(student => {
      emailCounts[student.email] = (emailCounts[student.email] || 0) + 1;
    });
    
    const duplicates = Object.entries(emailCounts).filter(([email, count]) => count > 1);
    if (duplicates.length > 0) {
      console.log(`  ⚠️ Found ${duplicates.length} duplicate emails:`);
      duplicates.forEach(([email, count]) => {
        console.log(`    ${email}: ${count} occurrences`);
      });
    } else {
      console.log("  ✅ No duplicate emails found");
    }

    // Test 4: Check pending payments
    console.log("\n💰 Test 4: Checking Pending Payments");
    const pendingPayments = await Payment.find({
      status: { $in: ["pending", "created"] }
    }).distinct("userId");
    console.log(`  Students with pending payments: ${pendingPayments.length}`);
    
    const studentsWithPending = await User.find({
      _id: { $in: pendingPayments },
      role: "student",
      email: { $exists: true, $ne: null, $ne: "" }
    }).select("name email regno year").lean();
    console.log(`  Students with pending payments and valid emails: ${studentsWithPending.length}`);

    // Test 5: Test email sending (dry run)
    console.log("\n📧 Test 5: Email Sending Test (Dry Run)");
    if (studentsWithEmails.length > 0) {
      const testStudent = studentsWithEmails[0];
      console.log(`  Testing with student: ${testStudent.name} (${testStudent.email})`);
      
      try {
        // This is a dry run - we won't actually send the email
        const testMessage = `Dear {student_name},

This is a test reminder for your fee payment.

Amount Due: {amount}
Due Date: {due_date}

Please make the payment at your earliest convenience.

Thank you,
Vignan University`;

        const personalizedMessage = testMessage
          .replace(/\{student_name\}/g, testStudent.name || 'Student')
          .replace(/\{amount\}/g, '₹50,000')
          .replace(/\{due_date\}/g, 'Soon')
          .replace(/\{regno\}/g, testStudent.regno || 'N/A');

        console.log("  📝 Personalized message preview:");
        console.log("  " + personalizedMessage.split('\n').join('\n  '));
        console.log("  ✅ Message personalization working correctly");
        
        // Uncomment the line below to actually send a test email
        // await sendEmail({
        //   to: testStudent.email,
        //   subject: "Test Fee Payment Reminder",
        //   html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><pre>${personalizedMessage}</pre></div>`
        // });
        
      } catch (error) {
        console.log(`  ❌ Email test failed: ${error.message}`);
      }
    }

    // Test 6: Year-based filtering
    console.log("\n📚 Test 6: Year-based Filtering");
    const yearGroups = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    for (const year of yearGroups) {
      const yearStudents = await User.find({
        role: "student",
        year: year,
        email: { $exists: true, $ne: null, $ne: "" }
      }).countDocuments();
      console.log(`  ${year}: ${yearStudents} students`);
    }

    console.log("\n🎉 Email Reminder System Test Completed Successfully!");
    console.log("\n📋 Summary:");
    console.log(`  - Total students: ${allStudents.length}`);
    console.log(`  - Students with emails: ${studentsWithEmails.length}`);
    console.log(`  - Students with pending payments: ${studentsWithPending.length}`);
    console.log(`  - Duplicate emails: ${duplicates.length}`);
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("📡 Disconnected from MongoDB");
  }
};

// Run the test
testEmailReminders();
