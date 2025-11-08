import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardContent, Grid, Avatar, Chip, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faHourglassHalf,
  faChartLine,
  faFileInvoice,
  faHistory,
  faBell,
  faCog,
  faWallet,
  faCreditCard,
  faDownload,
  faArrowRight,
  faCheckCircle,
  faClock,
  faCalendarAlt,
  faIdCard,
  faSignOutAlt,
  faBolt,
  faStar,
  faGraduationCap,
  faBook,
  faFlask,
  faEnvelope,
  faReceipt,
  faChartBar,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { getAllTransactions } from "../services/transactionService";
import api from "../services/api";

export default function SimplifiedDashboard() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null") || { name: "Guest" };
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [stats, setStats] = useState({
    totalPaid: 0,
    pending: 0,
    transactionCount: 0
  });
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Fast data fetching with fallback
  useEffect(() => {
    const fetchStats = async () => {
      if (user && user.email) {
        try {
          setLoading(true);
          
          // Try new API first, fallback to old method quickly
          const token = localStorage.getItem("ofprs_token");
          
          try {
            // Quick attempt at new API
            const [summaryRes, feesRes] = await Promise.all([
              api.get("/fees/student/summary", {
                timeout: 3000 // 3 second timeout
              }),
              api.get("/fees/student", {
                timeout: 3000
              })
            ]);

            if (summaryRes.data.success) {
              const summary = summaryRes.data.summary;
              setStats({
                totalPaid: summary.totalPaidAmount || 0,
                pending: summary.totalPending || 0,
                transactionCount: summary.transactionCount || 0
              });
            }

            if (feesRes.data.success) {
              setFees(feesRes.data.fees || []);
            }
          } catch (apiError) {
            console.log("New API failed, using fallback method");
            
            // Fast fallback to transaction service
            const data = await getAllTransactions(user.email);
            const transactions = data.transactions || [];
            
            const totalPaid = transactions
              .filter(t => t.status === "paid")
              .reduce((sum, t) => sum + t.amount, 0);
            
            // Use correct pending calculation
            const userTotalFee = user.pendingFee || user.semesterFee || 50505;
            const pending = Math.max(0, userTotalFee - totalPaid);
            
            setStats({
              totalPaid,
              pending,
              transactionCount: transactions.length
            });
          }
        } catch (error) {
          console.error("Error fetching stats:", error);
          // Set default values if everything fails
          setStats({
            totalPaid: 0,
            pending: user.pendingFee || 50505,
            transactionCount: 0
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchStats();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("ofprs_token");
    localStorage.removeItem("ofprs_user");
    navigate("/login");
  };

  const handlePayFee = (fee) => {
    navigate('/payment', { 
      state: { 
        amount: fee.remainingAmount || fee.amount,
        feeType: fee.category,
        feeName: fee.feeName,
        feeId: fee._id
      } 
    });
  };

  const statsCards = [
    {
      label: "Total Paid",
      value: `₹${stats.totalPaid.toLocaleString()}`,
      icon: faMoneyBillWave,
      gradient: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      delay: 0.1
    },
    {
      label: "Pending",
      value: `₹${stats.pending.toLocaleString()}`,
      icon: faHourglassHalf,
      gradient: "from-amber-400 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      delay: 0.2
    },
    {
      label: "Transactions",
      value: stats.transactionCount.toString(),
      icon: faChartLine,
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      delay: 0.3
    },
  ];

  const quickActions = [
    {
      title: "Pay Fees",
      icon: faWallet,
      gradient: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50",
      description: "Make fee payments",
      delay: 0.4,
      path: "/payment"
    },
    {
      title: "Download Receipt",
      icon: faDownload,
      gradient: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      description: "Get payment receipts",
      delay: 0.5,
      path: "/receipts"
    },
    {
      title: "Payment History",
      icon: faHistory,
      gradient: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      description: "View transactions",
      delay: 0.6,
      path: "/transactions"
    },
    {
      title: "Scholarships",
      icon: faGraduationCap,
      gradient: "from-indigo-400 to-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Apply for scholarships",
      delay: 0.7,
      path: "/scholarships"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Typography variant="h6" className="text-gray-600">Loading Dashboard...</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      <Container maxWidth="lg" className="relative z-10">
        {/* Simplified Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 mb-8 border border-white/50 relative overflow-hidden"
          style={{
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4">
                {/* User Avatar with Status */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  <Avatar
                    className="!w-20 !h-20 !bg-gradient-to-br !from-blue-500 !to-purple-600 !text-2xl !font-bold !shadow-lg"
                  >
                    {user.name?.charAt(0) || "G"}
                  </Avatar>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"
                  />
                </motion.div>

                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
                      {greeting}, {user.name || "Guest"}! 👋
                    </Typography>
                    <Typography variant="body1" className="!text-gray-600 !mb-2">
                      Registration: <span className="font-semibold text-blue-600">{user.regno || "N/A"}</span>
                    </Typography>
                    <div className="flex gap-2">
                      <Chip 
                        label={stats.pending > 0 ? "Pending Payments" : "All Fees Paid"} 
                        color={stats.pending > 0 ? "warning" : "success"}
                        className="!font-semibold"
                      />
                      <Chip 
                        label={`${stats.transactionCount} Transactions`} 
                        variant="outlined"
                        className="!font-semibold"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Time and Date */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-right"
              >
                <Typography variant="h6" className="!text-gray-600 !mb-1">
                  {currentTime.toLocaleDateString('en-IN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Typography variant="h4" className="!font-bold !text-gray-800">
                  {currentTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Typography>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} className="!mb-8">
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="h-full"
              >
                <Card className="!shadow-lg !rounded-2xl !bg-white !border-0 hover:!shadow-xl !transition-all !duration-300 !h-full">
                  <CardContent className="!p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl ${card.bgColor}`}>
                        <FontAwesomeIcon icon={card.icon} className={`text-2xl ${card.iconColor}`} />
                      </div>
                      <div className="text-right">
                        <Typography variant="body2" className="!text-gray-600 !mb-1">
                          {card.label}
                        </Typography>
                        <Typography variant="h4" className="!font-bold !text-gray-800">
                          {card.value}
                        </Typography>
                      </div>
                    </div>
                    
                    {/* Progress bar for visual appeal */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: index === 0 ? "75%" : index === 1 ? "45%" : "90%" }}
                        transition={{ delay: card.delay + 0.5, duration: 1 }}
                        className={`h-2 rounded-full bg-gradient-to-r ${card.gradient}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Fee Management Section - Only show if fees exist */}
        {fees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="!mb-8"
          >
            <Card className="!shadow-lg !rounded-2xl !bg-white !border-0">
              <CardContent className="!p-6">
                <Typography variant="h5" className="!font-bold !text-gray-800 !mb-4">
                  📋 Available Fees
                </Typography>
                <Grid container spacing={2}>
                  {fees.slice(0, 4).map((fee, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card className="!bg-gradient-to-br !from-blue-50 !to-purple-50 !border !border-blue-200">
                        <CardContent className="!p-4 !text-center">
                          <Typography variant="h6" className="!font-bold !text-gray-800 !mb-2">
                            {fee.feeName}
                          </Typography>
                          <Chip 
                            label={fee.category} 
                            size="small" 
                            className="!bg-blue-100 !text-blue-800 !mb-2"
                          />
                          <Typography variant="h5" className="!font-bold !text-blue-600 !mb-2">
                            ₹{fee.amount?.toLocaleString()}
                          </Typography>
                          {!fee.isPaid && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handlePayFee(fee)}
                              className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !text-white"
                              fullWidth
                            >
                              Pay Now
                            </Button>
                          )}
                          {fee.isPaid && (
                            <Chip label="✅ Paid" color="success" size="small" />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Typography variant="h5" className="!font-bold !text-gray-800 !mb-6">
            ⚡ Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: action.delay, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-full"
                >
                  <Card 
                    className="!shadow-lg !rounded-2xl !bg-white !border-0 hover:!shadow-xl !transition-all !duration-300 !cursor-pointer !h-full"
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="!p-6 !text-center !flex !flex-col !justify-between !h-full">
                      <div>
                        <div className={`p-4 rounded-xl ${action.bgColor} !mb-4 !inline-block`}>
                          <FontAwesomeIcon icon={action.icon} className="text-2xl text-blue-600" />
                        </div>
                        <Typography variant="h6" className="!font-bold !text-gray-800 !mb-2">
                          {action.title}
                        </Typography>
                        <Typography variant="body2" className="!text-gray-600 !mb-4">
                          {action.description}
                        </Typography>
                      </div>
                      <Button
                        variant="outlined"
                        size="small"
                        className="!border-blue-300 !text-blue-600 hover:!bg-blue-50"
                        endIcon={<FontAwesomeIcon icon={faArrowRight} />}
                      >
                        Go
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
}
