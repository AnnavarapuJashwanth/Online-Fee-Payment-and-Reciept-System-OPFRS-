import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  adminLogin,
  getAdminProfile,
  createInitialAdmin,
  changeAdminPassword,
} from "../controllers/adminAuthController.js";

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });
import {
  getDashboardStats,
  getRecentActivity,
  getMonthlyRevenue,
  getAllPayments,
  getAllStudents,
} from "../controllers/adminDashboardController.js";
import {
  getAllFees,
  createFee,
  updateFee,
  deleteFee,
} from "../controllers/feeController.js";
import {
  sendReminder,
  sendEmailToAll,
  bulkUpload,
  getActivityLog,
  getAllScholarships,
  approveScholarship,
  rejectScholarship,
} from "../controllers/adminActionsController.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/create-initial", createInitialAdmin);

// Protected routes - Authentication
router.get("/profile", verifyAdmin, getAdminProfile);
router.put("/change-password", verifyAdmin, changeAdminPassword);

// Protected routes - Dashboard
router.get("/dashboard/stats", verifyAdmin, getDashboardStats);
router.get("/dashboard/recent-activity", verifyAdmin, getRecentActivity);
router.get("/dashboard/monthly-revenue", verifyAdmin, getMonthlyRevenue);

// Protected routes - Payments & Students
router.get("/payments", verifyAdmin, getAllPayments);
router.get("/students", verifyAdmin, getAllStudents);

// Protected routes - Fee Management
router.get("/fees", verifyAdmin, getAllFees);
router.post("/fees", verifyAdmin, createFee);
router.put("/fees/:id", verifyAdmin, updateFee);
router.delete("/fees/:id", verifyAdmin, deleteFee);

// Protected routes - Admin Actions
router.post("/send-reminder", verifyAdmin, sendReminder);
router.post("/send-email-all", verifyAdmin, sendEmailToAll);
router.post("/bulk-upload", verifyAdmin, upload.single("file"), bulkUpload);
router.get("/activity-log", verifyAdmin, getActivityLog);

// Protected routes - Scholarships  
router.get("/scholarships", verifyAdmin, getAllScholarships);
router.put("/scholarships/:id/approve", verifyAdmin, approveScholarship);
router.put("/scholarships/:id/reject", verifyAdmin, rejectScholarship);

// Health check endpoint
router.get("/health", verifyAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin API is healthy",
    timestamp: new Date().toISOString(),
    dbState: mongoose.connection.readyState
  });
});

export default router;
