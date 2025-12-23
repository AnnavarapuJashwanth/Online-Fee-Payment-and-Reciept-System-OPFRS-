import mongoose from "mongoose";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import ActivityLog from "../models/ActivityLog.js";
import Scholarship from "../models/Scholarship.js";
import Announcement from "../models/Announcement.js";
import { sendEmail } from "../utils/mailer.js";

// @desc    Send reminder to students
// @route   POST /api/admin/send-reminder
// @access  Private (Admin)
export const sendReminder = async (req, res) => {
  try {
    console.log("📧 Starting reminder send process...");
    const { reminderType, targetGroup, subject, message } = req.body;

    // Validate required fields
    if (!message) {
      console.log("❌ Missing message");
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!subject) {
      console.log("❌ Missing subject");
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    console.log("📋 Reminder details:", { reminderType, targetGroup, subject });

    // Get target students based on group with improved filtering
    let query = { role: "student" }; // Only get students, not admins
    let targetDescription = "";

    if (targetGroup === "all_students") {
      // All students - no additional filter needed
      targetDescription = "all students";
    } else if (targetGroup === "all_pending") {
      // Students with pending payments
      const pendingPayments = await Payment.find({
        status: { $in: ["pending", "created"] },
      }).distinct("userId");
      
      if (pendingPayments.length === 0) {
        console.log("⚠️ No pending payments found");
        return res.json({
          success: true,
          message: "No students with pending payments found",
          sentCount: 0,
        });
      }
      
      query._id = { $in: pendingPayments };
      targetDescription = "students with pending payments";
    } else if (targetGroup.includes("year")) {
      // Filter by year
      const yearMap = {
        "1st_year": "1st Year",
        "2nd_year": "2nd Year", 
        "3rd_year": "3rd Year",
        "4th_year": "4th Year"
      };
      
      const year = yearMap[targetGroup];
      if (year) {
        query.year = year;
        targetDescription = `${year} students`;
      } else {
        console.log("❌ Invalid year target group:", targetGroup);
        return res.status(400).json({
          success: false,
          message: "Invalid target group specified",
        });
      }
    } else {
      console.log("❌ Unknown target group:", targetGroup);
      return res.status(400).json({
        success: false,
        message: "Invalid target group specified",
      });
    }

    console.log("👥 Fetching students with query:", query);
    
    // Get students with valid emails only
    const students = await User.find({
      ...query,
      email: { $exists: true, $ne: null, $ne: "" }
    }).select("name email regno year pendingFee semesterFee").lean();
    
    console.log(`📊 Found ${students.length} ${targetDescription} with valid emails`);

    if (students.length === 0) {
      return res.json({
        success: true,
        message: `No ${targetDescription} found with valid email addresses`,
        sentCount: 0,
      });
    }

    // Remove duplicates based on email (prevent overlapping)
    const uniqueStudents = students.filter((student, index, self) => 
      index === self.findIndex(s => s.email === student.email)
    );
    
    console.log(`🔄 After removing duplicates: ${uniqueStudents.length} unique students`);

    let sentCount = 0;
    let failedCount = 0;
    const failedEmails = [];
    
    console.log("📤 Starting email sending process...");
    
    for (let i = 0; i < uniqueStudents.length; i++) {
      const student = uniqueStudents[i];
      
      try {
        // Validate email format
        if (!student.email || !student.email.includes('@')) {
          console.log(`⚠️ Skipping invalid email: ${student.email}`);
          failedCount++;
          failedEmails.push(student.email);
          continue;
        }

        console.log(`📧 Sending to ${student.name} (${student.email}) - ${i + 1}/${uniqueStudents.length}`);
        
        if (reminderType === "email" || reminderType === "both") {
          // Calculate actual pending amount
          const pendingAmount = student.pendingFee || (student.semesterFee - (student.totalPaid || 0));
          
          const personalizedMessage = message
            .replace(/\{student_name\}/g, student.name || 'Student')
            .replace(/\{amount\}/g, `₹${pendingAmount?.toLocaleString() || 'N/A'}`)
            .replace(/\{due_date\}/g, 'Soon')
            .replace(/\{regno\}/g, student.regno || 'N/A');

          await sendEmail({
            to: student.email,
            subject: subject,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">${subject}</h1>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear ${student.name || 'Student'},</p>
                  
                  <div style="color: #666; font-size: 16px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 20px;">
${personalizedMessage}
                  </div>
                  
                  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #666; font-size: 14px;">
                      <strong>Student Details:</strong><br>
                      Registration Number: ${student.regno || 'N/A'}<br>
                      Year: ${student.year || 'N/A'}<br>
                      Pending Amount: ₹${pendingAmount?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                  <p style="color: #666; font-size: 12px; margin: 0;">
                    This is an automated message from Vignan University Fee Management System.<br>
                    Please do not reply to this email.
                  </p>
                </div>
              </div>
            `,
          });
          
          sentCount++;
          console.log(`✅ Email sent successfully to ${student.email}`);
          
          // Add small delay to avoid overwhelming the email server
          if (i < uniqueStudents.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        
        // TODO: Add SMS functionality here if reminderType includes "sms"
        
      } catch (error) {
        console.error(`❌ Failed to send to ${student.email}:`, error.message);
        failedCount++;
        failedEmails.push(student.email);
      }
    }

    console.log(`📊 Email sending completed: ${sentCount} sent, ${failedCount} failed`);

    // Log activity
    try {
      await ActivityLog.create({
        userId: req.admin._id,
        userType: "admin",
        action: "reminder_sent",
        description: `Sent ${reminderType} reminder to ${sentCount} out of ${uniqueStudents.length} ${targetDescription}`,
        metadata: { 
          targetGroup, 
          sentCount, 
          failedCount, 
          totalTargeted: uniqueStudents.length,
          reminderType 
        },
      });
      console.log("✅ Activity logged");
    } catch (logError) {
      console.error("❌ Failed to log activity:", logError.message);
    }

    // Create announcement for students
    try {
      await Announcement.create({
        title: subject,
        content: message,
        category: "Fee Payment",
        priority: "high",
        targetAudience: "students",
        postedBy: req.admin._id,
      });
      console.log("✅ Announcement created for reminder");
    } catch (announcementError) {
      console.error("❌ Failed to create announcement:", announcementError.message);
    }

    console.log(`🎉 Reminder process completed successfully!`);

    res.json({
      success: true,
      message: `Reminder sent to ${sentCount} out of ${uniqueStudents.length} ${targetDescription}`,
      sentCount,
      failedCount,
      totalTargeted: uniqueStudents.length,
      failedEmails: failedEmails.length > 0 ? failedEmails.slice(0, 5) : [], // Show first 5 failed emails
    });
  } catch (error) {
    console.error("❌ Error sending reminder:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error sending reminder",
      error: error.message,
      details: "Please check server logs for more information"
    });
  }
};

// @desc    Send email to all registered users
// @route   POST /api/admin/send-email-all
// @access  Private (Admin)
export const sendEmailToAll = async (req, res) => {
  try {
    console.log("📧 Starting mass email send process...");
    const { subject, message, reminderType, targetGroup } = req.body;

    if (!subject || !message) {
      console.log("❌ Missing subject or message");
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    console.log("📋 Email details:", { subject, targetGroup, reminderType });

    // Get all registered users with valid emails
    console.log("👥 Fetching users from database...");
    const users = await User.find({ 
      email: { $exists: true, $ne: null, $ne: "" }
    }).select("name email regno year").lean();
    
    // Remove duplicates based on email (prevent overlapping)
    const uniqueUsers = users.filter((user, index, self) => 
      index === self.findIndex(u => u.email === user.email)
    );
    
    console.log(`🔄 After removing duplicates: ${uniqueUsers.length} unique users out of ${users.length} total`);
    
    console.log(`📊 Found ${uniqueUsers.length} unique users with valid emails`);

    if (uniqueUsers.length === 0) {
      return res.json({
        success: true,
        message: "No users found to send emails to",
        totalUsers: 0,
        sentCount: 0,
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const failedEmails = [];

    // Send emails to users (limit concurrent sends)
    console.log("📤 Starting email sending process...");
    
    for (let i = 0; i < uniqueUsers.length; i++) {
      const user = uniqueUsers[i];
      
      try {
        // Validate email format
        if (!user.email || !user.email.includes('@')) {
          console.log(`⚠️ Skipping invalid email: ${user.email}`);
          failedCount++;
          continue;
        }

        console.log(`📧 Sending to ${user.name} (${user.email}) - ${i + 1}/${uniqueUsers.length}`);
        
        await sendEmail({
          to: user.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px;">${subject}</h1>
              </div>
              
              <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Dear ${user.name || 'Student'},</p>
                
                <div style="color: #666; font-size: 16px; line-height: 1.6; white-space: pre-wrap; margin-bottom: 20px;">
${message}
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="margin: 0; color: #666; font-size: 14px;">
                    <strong>Student Details:</strong><br>
                    Registration Number: ${user.regno || 'N/A'}<br>
                    Year: ${user.year || 'N/A'}
                  </p>
                </div>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; margin: 0;">
                  This is an automated message from Vignan University Fee Management System.<br>
                  Please do not reply to this email.
                </p>
              </div>
            </div>
          `,
        });
        
        sentCount++;
        console.log(`✅ Email sent successfully to ${user.email}`);
        
        // Add small delay to avoid overwhelming the email server
        if (i < uniqueUsers.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (emailError) {
        console.error(`❌ Failed to send to ${user.email}:`, emailError.message);
        failedCount++;
        failedEmails.push(user.email);
      }
    }

    console.log(`📊 Email sending completed: ${sentCount} sent, ${failedCount} failed`);

    // Log activity
    try {
      await ActivityLog.create({
        userId: req.admin._id,
        userType: "admin",
        action: "mass_email_sent",
        description: `Sent mass email to ${sentCount} out of ${uniqueUsers.length} registered users`,
        metadata: { 
          subject, 
          totalUsers: uniqueUsers.length, 
          sentCount, 
          failedCount,
          targetGroup: targetGroup || 'all_users'
        },
      });
      console.log("✅ Activity logged");
    } catch (logError) {
      console.error("❌ Failed to log activity:", logError.message);
    }

    // Create announcement
    try {
      await Announcement.create({
        title: subject,
        content: message,
        category: "General",
        priority: "high",
        targetAudience: "all",
        postedBy: req.admin._id,
      });
      console.log("✅ Announcement created");
    } catch (announcementError) {
      console.error("❌ Failed to create announcement:", announcementError.message);
    }

    console.log(`🎉 Mass email process completed successfully!`);

    res.json({
      success: true,
      message: `Email sent to ${sentCount} out of ${uniqueUsers.length} registered users`,
      totalUsers: uniqueUsers.length,
      sentCount,
      failedCount,
      failedEmails: failedEmails.length > 0 ? failedEmails.slice(0, 5) : [], // Show first 5 failed emails
    });
    
  } catch (error) {
    console.error("❌ Error in sendEmailToAll:", error);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({
      success: false,
      message: "Error sending mass email",
      error: error.message,
      details: "Please check server logs for more information"
    });
  }
};

// @desc    Bulk upload students
// @route   POST /api/admin/bulk-upload
// @access  Private (Admin)
export const bulkUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV file",
      });
    }

    // Parse CSV (simplified - in production use a proper CSV parser)
    const csvData = req.file.buffer.toString();
    const rows = csvData.split("\n").slice(1); // Skip header

    let imported = 0;
    let skipped = 0;
    let errors = 0;
    const details = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;

      const [studentId, name, email, phone, year, semester, branch, section, category] =
        row.split(",");

      try {
        // Check if student already exists
        const existingUser = await User.findOne({
          $or: [{ regno: studentId }, { email }],
        });

        if (existingUser) {
          skipped++;
          details.push({
            row: i + 2,
            studentId,
            name,
            status: "skipped",
            message: "Student already exists",
          });
          continue;
        }

        // Create new user
        await User.create({
          regno: studentId,
          name,
          email,
          phone,
          year,
          semester,
          branch,
          section,
          category,
          password: studentId, // Default password is student ID
        });

        imported++;
        details.push({
          row: i + 2,
          studentId,
          name,
          status: "success",
          message: "Imported successfully",
        });
      } catch (error) {
        errors++;
        details.push({
          row: i + 2,
          studentId,
          name,
          status: "error",
          message: error.message,
        });
      }
    }

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "bulk_upload",
      description: `Bulk uploaded students: ${imported} imported, ${skipped} skipped, ${errors} errors`,
      metadata: { imported, skipped, errors },
    });

    console.log(`✅ Bulk upload: ${imported} imported, ${skipped} skipped, ${errors} errors`);

    res.json({
      success: true,
      message: "Bulk upload completed",
      imported,
      skipped,
      errors,
      details,
    });
  } catch (error) {
    console.error("❌ Error in bulk upload:", error);
    res.status(500).json({
      success: false,
      message: "Error processing bulk upload",
      error: error.message,
    });
  }
};

// @desc    Get activity log
// @route   GET /api/admin/activity-log
// @access  Private (Admin)
export const getActivityLog = async (req, res) => {
  try {
    const { page = 1, limit = 20, action, userType, search } = req.query;

    let query = {};

    if (action) query.action = action;
    if (userType) query.userType = userType;

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { regno: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = users.map((u) => u._id);
      query.$or = [
        { userId: { $in: userIds } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const activities = await ActivityLog.find(query)
      .populate("userId", "name regno email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      activities,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Error fetching activity log:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activity log",
      error: error.message,
    });
  }
};

// @desc    Get all scholarships
// @route   GET /api/admin/scholarships
// @access  Private (Admin)
export const getAllScholarships = async (req, res) => {
  // Set response timeout to prevent hanging
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      console.log("⏰ Response timeout, sending fallback");
      res.json({
        success: true,
        scholarships: [],
        pagination: { total: 0, page: 1, pages: 0, limit: 10 },
        message: "Loading scholarships is taking longer than expected. Please try again."
      });
    }
  }, 5000); // 5 second response timeout

  try {
    console.log("📚 Admin requesting scholarships");
    
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status && status !== 'all') query.status = status;

    console.log("🔍 Query:", JSON.stringify(query), "Page:", page, "Limit:", limit);
    
    // Quick health check
    if (mongoose.connection.readyState !== 1) {
      clearTimeout(timeout);
      console.error("❌ Database not connected");
      return res.json({
        success: true,
        scholarships: [],
        pagination: { total: 0, page: 1, pages: 0, limit: parseInt(limit) },
        message: "Database connection unavailable"
      });
    }
    
    // Try to get scholarships with very short timeout
    let scholarships = [];
    let totalCount = 0;
    
    try {
      // Use Promise.race to enforce timeout
      const queryPromise = Scholarship.find(query)
        .populate("userId", "name regno email")
        .select("userId fullName scholarshipType status createdAt adminMessage amount")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean()
        .exec();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 3000)
      );
      
      scholarships = await Promise.race([queryPromise, timeoutPromise]);
      
      // Get count separately
      totalCount = await Scholarship.countDocuments(query).maxTimeMS(1000);
      
      console.log(`✅ Loaded ${scholarships.length} scholarships`);
    } catch (queryError) {
      console.error("Query failed, returning empty result:", queryError.message);
      scholarships = [];
      totalCount = 0;
    }

    clearTimeout(timeout);
    
    if (!res.headersSent) {
      res.json({
        success: true,
        scholarships,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          pages: Math.ceil(totalCount / limit) || 0,
          limit: parseInt(limit),
        },
      });
    }
    
  } catch (error) {
    clearTimeout(timeout);
    console.error("❌ Scholarships error:", error.message);
    
    // Always return a valid response
    if (!res.headersSent) {
      res.json({
        success: true,
        scholarships: [],
        pagination: { total: 0, page: 1, pages: 0, limit: 10 },
        message: "Unable to load scholarships. Please try again later."
      });
    }
  }
};

// @desc    Approve scholarship
// @route   PUT /api/admin/scholarships/:id/approve
// @access  Private (Admin)
export const approveScholarship = async (req, res) => {
  try {
    const { adminMessage } = req.body;

    const scholarship = await Scholarship.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    scholarship.status = "Approved";
    scholarship.adminMessage = adminMessage || "Your scholarship has been approved.";
    scholarship.reviewedBy = req.admin._id;
    scholarship.reviewedAt = new Date();
    await scholarship.save();

    // Send email notification
    try {
      await sendEmail({
        to: scholarship.userId.email,
        subject: "Scholarship Application Approved",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #10b981;">Scholarship Approved! 🎉</h2>
            <p>Dear ${scholarship.userId.name},</p>
            <p>Congratulations! Your scholarship application has been approved.</p>
            <p><strong>Scholarship Type:</strong> ${scholarship.scholarshipType}</p>
            ${adminMessage ? `<p><strong>Admin Message:</strong> ${adminMessage}</p>` : ""}
            <p>Thank you,<br>Vignan University</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // Create announcement for student
    try {
      await Announcement.create({
        title: "Scholarship Application Approved! 🎉",
        content: `Your ${scholarship.scholarshipType} scholarship application has been approved. ${adminMessage || "Congratulations!"}`,
        category: "Scholarship",
        priority: "high",
        targetAudience: "specific",
        postedBy: req.admin._id,
        userId: scholarship.userId._id,
      });
    } catch (announcementError) {
      console.error("Failed to create announcement:", announcementError);
    }

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "scholarship_approved",
      description: `Approved scholarship for ${scholarship.userId.name}`,
      metadata: { scholarshipId: scholarship._id },
    });

    console.log(`✅ Scholarship approved for ${scholarship.userId.name}`);

    res.json({
      success: true,
      message: "Scholarship approved successfully",
      scholarship,
    });
  } catch (error) {
    console.error("❌ Error approving scholarship:", error);
    res.status(500).json({
      success: false,
      message: "Error approving scholarship",
      error: error.message,
    });
  }
};

// @desc    Reject scholarship
// @route   PUT /api/admin/scholarships/:id/reject
// @access  Private (Admin)
export const rejectScholarship = async (req, res) => {
  try {
    const { adminMessage } = req.body;

    if (!adminMessage) {
      return res.status(400).json({
        success: false,
        message: "Please provide a reason for rejection",
      });
    }

    const scholarship = await Scholarship.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!scholarship) {
      return res.status(404).json({
        success: false,
        message: "Scholarship not found",
      });
    }

    scholarship.status = "Rejected";
    scholarship.adminMessage = adminMessage;
    scholarship.reviewedBy = req.admin._id;
    scholarship.reviewedAt = new Date();
    await scholarship.save();

    // Send email notification
    try {
      await sendEmail({
        to: scholarship.userId.email,
        subject: "Scholarship Application Update",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #ef4444;">Scholarship Application Update</h2>
            <p>Dear ${scholarship.userId.name},</p>
            <p>We regret to inform you that your scholarship application has not been approved at this time.</p>
            <p><strong>Scholarship Type:</strong> ${scholarship.scholarshipType}</p>
            <p><strong>Reason:</strong> ${adminMessage}</p>
            <p>You may reapply in the future if your circumstances change.</p>
            <p>Thank you,<br>Vignan University</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // Create announcement for student
    try {
      await Announcement.create({
        title: "Scholarship Application Update",
        content: `Your ${scholarship.scholarshipType} scholarship application status has been updated. Reason: ${adminMessage}`,
        category: "Scholarship",
        priority: "medium",
        targetAudience: "specific",
        postedBy: req.admin._id,
        userId: scholarship.userId._id,
      });
    } catch (announcementError) {
      console.error("Failed to create announcement:", announcementError);
    }

    // Log activity
    await ActivityLog.create({
      userId: req.admin._id,
      userType: "admin",
      action: "scholarship_rejected",
      description: `Rejected scholarship for ${scholarship.userId.name}`,
      metadata: { scholarshipId: scholarship._id },
    });

    console.log(`✅ Scholarship rejected for ${scholarship.userId.name}`);

    res.json({
      success: true,
      message: "Scholarship rejected",
      scholarship,
    });
  } catch (error) {
    console.error("❌ Error rejecting scholarship:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting scholarship",
      error: error.message,
    });
  }
};
