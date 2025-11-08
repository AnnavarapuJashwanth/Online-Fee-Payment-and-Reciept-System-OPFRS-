// 🧩 Load environment variables early and reliably
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// ✅ Resolve backend directory path (important for Windows)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");

// ✅ Verify .env exists and load
if (!fs.existsSync(envPath)) {
  console.error("❌ .env file not found at:", envPath);
  process.exit(1);
}
dotenv.config({ path: envPath });

// ✅ Debug .env status
console.log("🔍 ENV CHECK:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_KEY_SECRET exists:", !!process.env.RAZORPAY_KEY_SECRET);
console.log("EMAIL_HOST_USER:", process.env.EMAIL_HOST_USER);
console.log("EMAIL_HOST_PASSWORD exists:", !!process.env.EMAIL_HOST_PASSWORD);
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS exists:", !!process.env.SMTP_PASS);

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import profileRoutes from "./routes/profile.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import refundRoutes from "./routes/refundRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import studentFeeRoutes from "./routes/studentFeeRoutes.js";
import adminRoutes from "./routes/admin.js";

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middlewares
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "50mb" })); // Increased for profile photos
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// ✅ Routes
console.log("📍 Registering routes...");
app.use("/api/payment", paymentRoutes);
console.log("✅ Payment routes registered");
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes registered");
app.use("/api/webhook", webhookRoutes);
console.log("✅ Webhook routes registered");
app.use("/api/profile", profileRoutes);
console.log("✅ Profile routes registered");
app.use("/api/announcements", announcementRoutes);
console.log("✅ Announcement routes registered");
app.use("/api/scholarships", scholarshipRoutes);
console.log("✅ Scholarship routes registered");
app.use("/api/refunds", refundRoutes);
console.log("✅ Refund routes registered");
app.use("/api/support", supportRoutes);
console.log("✅ Support routes registered");
app.use("/api/fees", studentFeeRoutes);
console.log("✅ Student fee routes registered");
app.use("/api/admin", adminRoutes);
console.log("✅ Admin routes registered");

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ OFPRS Backend is running successfully!");
});

// ✅ 404 handler for undefined routes
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} not found` 
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
