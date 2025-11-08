import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCreditCard,
  faHistory,
  faReceipt,
  faUser,
  faCog,
  faChartBar,
  faMoneyBillWave,
  faBullhorn,
  faGraduationCap,
  faMoneyCheckAlt,
  faHeadset
} from "@fortawesome/free-solid-svg-icons";
import { Typography } from "@mui/material";
import { getAllTransactions } from "../services/transactionService";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null");
  const [stats, setStats] = useState({ totalPaid: 0, pending: 0, transactions: 0 });
  const [isLoading, setIsLoading] = useState(false);

  // Load stats once when component mounts
  useEffect(() => {
    if (user && user.email) {
      fetchStats();
    }
  }, []); // Only run once on mount

  // Listen for dashboard updates
  useEffect(() => {
    const handleDashboardUpdate = () => {
      if (user && user.email && !isLoading) {
        fetchStats();
      }
    };

    window.addEventListener('dashboardStatsUpdated', handleDashboardUpdate);

    return () => {
      window.removeEventListener('dashboardStatsUpdated', handleDashboardUpdate);
    };
  }, []); // No dependencies to prevent loops

  const fetchStats = async () => {
    if (isLoading) return; // Prevent multiple calls
    
    setIsLoading(true);
    try {
      const data = await getAllTransactions(user.email);
      const transactions = data.transactions || [];
      
      const totalPaid = transactions
        .filter(t => t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Calculate correct pending fee - ensure positive total fee
      let userTotalFee = user.pendingFee || user.semesterFee || 50505;
      
      // Fix negative or invalid fee amounts
      if (userTotalFee <= 0) {
        userTotalFee = 50505; // Default semester fee
        console.log("⚠️ Sidebar: Fixed invalid userTotalFee, using default 50505");
      }
      
      const pending = Math.max(0, userTotalFee - totalPaid);
      
      setStats({
        totalPaid,
        pending,
        transactions: transactions.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show Transactions and Receipts if user is logged in
  const menuItems = [
    { path: "/dashboard", icon: faHome, label: "Dashboard", public: true },
    { path: "/pay", icon: faCreditCard, label: "Pay Fees", public: true },
    { path: "/fee-structure", icon: faMoneyBillWave, label: "Fee Structure", public: true },
    { path: "/transactions", icon: faHistory, label: "Transactions", public: false },
    { path: "/receipts", icon: faReceipt, label: "Receipts", public: false },
    { path: "/profile", icon: faUser, label: "Profile", public: false },
    { path: "/announcements", icon: faBullhorn, label: "Announcements", public: false },
    { path: "/scholarships", icon: faGraduationCap, label: "Scholarships", public: false },
    { path: "/refund-status", icon: faMoneyCheckAlt, label: "Refund Status", public: false },
    { path: "/support", icon: faHeadset, label: "Support", public: false },
    { path: "/settings", icon: faCog, label: "Settings", public: false },
  ].filter(item => item.public || user);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 backdrop-blur-xl bg-white/80 border-r border-white/50 fixed left-0 top-16 shadow-xl">
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="mb-8">
          <Typography variant="h6" className="!font-bold !text-gray-800 mb-2">
            Navigation
          </Typography>
          <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="no-underline">
              <motion.div
                whileHover={{ x: 5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                }`}
              >
                <FontAwesomeIcon 
                  icon={item.icon} 
                  className={`text-lg ${isActive(item.path) ? "text-white" : "text-blue-600"}`}
                />
                <Typography 
                  variant="body2" 
                  className={`!font-semibold ${isActive(item.path) ? "!text-white" : "!text-gray-800"}`}
                >
                  {item.label}
                </Typography>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <FontAwesomeIcon icon={faChartBar} className="text-white" />
            </div>
            <Typography variant="body2" className="!font-bold !text-gray-800">
              Quick Stats
            </Typography>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography variant="caption" className="!text-gray-600">Total Paid:</Typography>
              <Typography variant="caption" className="!font-bold !text-green-600">₹{stats.totalPaid.toLocaleString()}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="caption" className="!text-gray-600">Pending:</Typography>
              <Typography variant="caption" className="!font-bold !text-amber-600">₹{stats.pending.toLocaleString()}</Typography>
            </div>
            <div className="flex justify-between">
              <Typography variant="caption" className="!text-gray-600">Transactions:</Typography>
              <Typography variant="caption" className="!font-bold !text-blue-600">{stats.transactions}</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
