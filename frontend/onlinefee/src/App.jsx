import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FastDashboard from "./pages/FastDashboard";
import PaymentPage from "./pages/PaymentPage";
import TransactionHistory from "./pages/TransactionHistory";
import Receipts from "./pages/Receipts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PayFees from "./pages/PayFees";
import FeeStructure from "./pages/FeeStructure";
import Announcements from "./pages/Announcements";
import Scholarships from "./pages/ScholarshipsNew";
import RefundStatus from "./pages/RefundStatus";
import Support from "./pages/Support";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageFees from "./pages/admin/ManageFees";
import AllPayments from "./pages/admin/AllPayments";
import StudentStatus from "./pages/admin/StudentStatus";
import SendReminders from "./pages/admin/SendReminders";
import BulkUpload from "./pages/admin/BulkUpload";
import ActivityLog from "./pages/admin/ActivityLog";
import AdminScholarships from "./pages/admin/AdminScholarships";
import Reports from "./pages/admin/Reports";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import { CssBaseline } from "@mui/material";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const showSidebar = !["/login", "/signup", "/admin/login"].includes(location.pathname) && !isAdminRoute;

  return (
    <>
      <CssBaseline />
      {!isAdminRoute && <Navbar />}
      {showSidebar && <Sidebar />}
      <div className={showSidebar ? "ml-64" : ""}>
        <Routes>
          {/* Student Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pay" element={<PayFees />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/transactions" element={<TransactionHistory />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/fee-structure" element={<FeeStructure />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/refund-status" element={<RefundStatus />} />
          <Route path="/support" element={<Support />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-fees" element={<ManageFees />} />
          <Route path="/admin/payments" element={<AllPayments />} />
          <Route path="/admin/students" element={<StudentStatus />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/reminders" element={<SendReminders />} />
          <Route path="/admin/bulk-upload" element={<BulkUpload />} />
          <Route path="/admin/activity-log" element={<ActivityLog />} />
          <Route path="/admin/scholarships" element={<AdminScholarships />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}
