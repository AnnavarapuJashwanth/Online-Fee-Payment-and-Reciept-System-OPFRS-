// 🧩 Load environment variables early and reliably
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

// ✅ Resolve backend directory path (important for Windows)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");

// ✅ Load .env if exists (for local dev), otherwise use AWS environment variables
if (fs.existsSync(envPath)) {
  console.log("✅ Loading .env file from:", envPath);
  dotenv.config({ path: envPath });
} else {
  console.log("ℹ️ No .env file found, using environment variables (AWS mode)");
}

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

// ✅ Middlewares - CORS Configuration
const allowedOrigins = [
  // Local development - all common ports
  "http://localhost:3000",
  "http://localhost:4173",
  "http://localhost:5173", 
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  "http://localhost:5181",
  "http://localhost:5182",
  "http://localhost:5183",
  "http://localhost:5184",
  // Production deployments - Netlify
  "https://opfrs9.netlify.app",
  "https://opfrs9.netlify.app/",
  "https://opfrs9--main.netlify.app",
  "https://main--opfrs9.netlify.app",
  // AWS S3 Frontend
  "http://ofprs-frontend-20251223.s3-website.ap-south-1.amazonaws.com",
  // AWS Elastic Beanstalk Backend
  "http://ofprs-production.eba-jhxevv9p.ap-south-1.elasticbeanstalk.com",
  // Backend self-reference
  "https://online-fee-payment-and-reciept-system.onrender.com"
];

app.use(cors({ 
  origin: function (origin, callback) {
    console.log("🔍 CORS Request from origin:", origin);
    
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      console.log("✅ CORS: Allowing request with no origin");
      return callback(null, true);
    }
    
    // Allow all localhost origins for development
    if (origin && origin.startsWith('http://localhost:')) {
      console.log("✅ CORS: Allowing localhost origin:", origin);
      return callback(null, true);
    }
    
    // Allow all netlify.app domains for production
    if (origin && origin.includes('netlify.app')) {
      console.log("✅ CORS: Allowing Netlify origin:", origin);
      return callback(null, true);
    }
    
    // Allow all AWS S3 website domains
    if (origin && origin.includes('s3-website')) {
      console.log("✅ CORS: Allowing S3 website origin:", origin);
      return callback(null, true);
    }
    
    // Allow all AWS Elastic Beanstalk domains
    if (origin && origin.includes('elasticbeanstalk.com')) {
      console.log("✅ CORS: Allowing Elastic Beanstalk origin:", origin);
      return callback(null, true);
    }
    
    // Check specific allowed origins for production
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("✅ CORS: Origin allowed:", origin);
      callback(null, true);
    } else {
      console.log("❌ CORS: Origin blocked:", origin);
      console.log("📋 Allowed origins:", allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

app.use(bodyParser.json({ limit: "50mb" })); // Increased for profile photos
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

// ✅ Health check and root routes
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 OFPRS Backend Server is running!", 
    status: "active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy", 
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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
