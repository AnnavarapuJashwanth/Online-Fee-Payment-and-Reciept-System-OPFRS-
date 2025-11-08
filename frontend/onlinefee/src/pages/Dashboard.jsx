import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Card, CardContent, Grid, Avatar, Chip, Box,
  AppBar, Toolbar, IconButton, Menu, MenuItem, Switch, FormControlLabel,
  Badge, Divider, ListItemIcon, ListItemText, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { 
  DarkMode, LightMode, AccountCircle, Logout, Person, 
  Notifications, ExpandMore, Payment as PaymentIcon
} from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  faUserCircle,
  faSync
} from "@fortawesome/free-solid-svg-icons";
import { getAllTransactions } from "../services/transactionService";
import api from "../services/api";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null") || { name: "Guest" };
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [fees, setFees] = useState([]);
  const [adminFees, setAdminFees] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showFeeDetails, setShowFeeDetails] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingFees, setIsLoadingFees] = useState(false);
  const [stats, setStats] = useState({
    totalPaid: 0,
    pending: 0,
    transactionCount: 0,
    totalFeeAmount: 0,
    paymentPercentage: 0
  });

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

  // Fetch admin-created fees with loading state
  const fetchAdminFees = async () => {
    if (isLoadingFees) return; // Prevent multiple simultaneous calls
    
    setIsLoadingFees(true);
    try {
      const token = localStorage.getItem("ofprs_token");
      
      const response = await api.get("/fees/student", {
        timeout: 3000
      });
      
      if (response.data.success && response.data.fees) {
        setAdminFees(response.data.fees);
        console.log("✅ Admin fees loaded:", response.data.fees.length);
      } else {
        setAdminFees([]);
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log("⏱️ Admin fees timeout - using fallback");
      }
      setAdminFees([]);
    } finally {
      setIsLoadingFees(false);
    }
  };

  // Define fetchStats function with loading state
  const fetchStats = async () => {
    if (!user || !user.email || isLoadingStats) return; // Prevent multiple calls
    
    setIsLoadingStats(true);
    try {
      // Use fast, reliable transaction service first
      const data = await getAllTransactions(user.email);
      const transactions = data.transactions || [];
      
      const totalPaid = transactions
        .filter(t => t.status === "paid")
        .reduce((sum, t) => sum + t.amount, 0);
      
      // Use correct pending calculation - ensure positive total fee
      let userTotalFee = user.pendingFee || user.semesterFee || 50505;
      
      // Fix negative or invalid fee amounts
      if (userTotalFee <= 0) {
        userTotalFee = 50505; // Default semester fee
        console.log("⚠️ Fixed invalid userTotalFee, using default 50505");
      }
      
      const pending = Math.max(0, userTotalFee - totalPaid);
      
      setStats({
        totalPaid,
        pending,
        transactionCount: transactions.length,
        totalFeeAmount: userTotalFee,
        paymentPercentage: userTotalFee > 0 ? Math.round((totalPaid / userTotalFee) * 100) : 0
      });

      console.log("✅ Fast stats loaded:", { 
        totalPaid, 
        pending, 
        transactionCount: transactions.length,
        userTotalFee 
      });

      // Notify sidebar to update stats
      window.dispatchEvent(new CustomEvent('dashboardStatsUpdated'));

    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default values based on user data
      const userTotalFee = user.pendingFee || 50505;
      setStats({
        totalPaid: 0,
        pending: userTotalFee,
        transactionCount: 0,
        totalFeeAmount: userTotalFee,
        paymentPercentage: 0
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Load data once when component mounts
  useEffect(() => {
    if (user && user.email) {
      fetchStats();
      fetchAdminFees();
    }
  }, []); // Empty dependency array - only run once on mount


  const handleLogout = () => {
    localStorage.removeItem("ofprs_token");
    localStorage.removeItem("ofprs_user");
    navigate("/login");
  };

  const handleFeeDetails = (fee) => {
    setSelectedFee(fee);
    setShowFeeDetails(true);
  };

  const handlePayFee = (fee) => {
    navigate('/payment', { 
      state: { 
        amount: fee.amount,
        feeType: fee.category,
        feeName: fee.feeName,
        feeId: fee._id,
        description: fee.description
      } 
    });
  };

  const statsCards = [
    {
      label: "Total Paid",
      value: `₹${stats.totalPaid}`,
      icon: faMoneyBillWave,
      gradient: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      delay: 0.1
    },
    {
      label: "Pending",
      value: `₹${stats.pending}`,
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
      title: "Download Receipt",
      icon: faDownload,
      gradient: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      description: "Get payment receipts",
      delay: 0.4,
      path: "/receipts"
    },
    {
      title: "Payment History",
      icon: faHistory,
      gradient: "from-green-400 to-green-600",
      bgColor: "bg-green-50",
      description: "View transactions",
      delay: 0.5,
      path: "/transactions"
    },
    {
      title: "Notifications",
      icon: faBell,
      gradient: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50",
      description: "Check alerts",
      delay: 0.6,
      path: "/dashboard"
    },
    {
      title: "Settings",
      icon: faCog,
      gradient: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-50",
      description: "Manage account",
      delay: 0.7,
      path: "/settings"
    },
  ];


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
        {/* Glassmorphism Header Card */}
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
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"
                  />
                </motion.div>

                <div>
                  <Typography variant="h4" className="font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                    {greeting}, {user.name}! 👋
                  </Typography>
                  <div className="flex flex-wrap gap-3 mt-2">
                    <Chip
                      icon={<FontAwesomeIcon icon={faIdCard} className="text-blue-600" />}
                      label={`Reg: ${user.regno || "-"}`}
                      className="!bg-blue-50 !text-blue-700 !font-semibold"
                      size="small"
                    />
                    <Chip
                      icon={<FontAwesomeIcon icon={faEnvelope} className="text-purple-600" />}
                      label={user.email || "-"}
                      className="!bg-purple-50 !text-purple-700 !font-semibold"
                      size="small"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="text-sm" />
                    <Typography variant="body2" className="text-sm">
                      {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </Typography>
                    <span className="mx-2">•</span>
                    <FontAwesomeIcon icon={faClock} className="text-sm" />
                    <Typography variant="body2" className="text-sm font-mono">
                      {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Payment Status Summary */}
              <div className="text-right">
                <div className="flex flex-col gap-2">
                  <Chip
                    label={stats.pending > 0 ? `₹${stats.pending.toLocaleString()} Pending` : "All Fees Paid"}
                    color={stats.pending > 0 ? "warning" : "success"}
                    className="!font-bold !text-lg !px-4 !py-2"
                    icon={<FontAwesomeIcon icon={stats.pending > 0 ? faHourglassHalf : faCheckCircle} />}
                  />
                  <Typography variant="body2" className="text-gray-600">
                    {stats.transactionCount} transactions completed
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards with Glassmorphism */}
        <Grid container spacing={3} className="mb-8">
          {statsCards.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: stat.delay, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="backdrop-blur-lg bg-white/60 rounded-3xl shadow-xl p-6 border border-white/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.bgColor} p-4 rounded-2xl`}>
                        <FontAwesomeIcon icon={stat.icon} className={`text-3xl ${stat.iconColor}`} />
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xl" />
                      </motion.div>
                    </div>
                    <Typography className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {stat.value}
                    </Typography>
                    <motion.div
                      className="mt-3 flex items-center gap-2 text-green-600 text-sm font-semibold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: stat.delay + 0.3 }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      <span>Up to date</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </Grid>
          ))}
        </Grid>


        {/* Quick Actions with Professional Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/50 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-600 p-3 rounded-2xl">
              <FontAwesomeIcon icon={faBolt} className="text-white text-xl" />
            </div>
            <Typography variant="h5" className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Quick Actions
            </Typography>
          </div>

          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Link to={action.path} className="no-underline">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: action.delay, type: "spring" }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cursor-pointer"
                  >
                    <div className={`${action.bgColor} backdrop-blur-lg rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-white/50 relative overflow-hidden group`}>
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      />

                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block mb-4"
                      >
                        <div className={`bg-gradient-to-br ${action.gradient} p-4 rounded-2xl inline-block`}>
                          <FontAwesomeIcon icon={action.icon} className="text-white text-3xl" />
                        </div>
                      </motion.div>

                      <Typography className="font-bold text-gray-800 mb-2">
                        {action.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-600">
                        {action.description}
                      </Typography>
                    </div>
                  </motion.div>
                </Link>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Admin Created Fees Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/50"
        >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-500 to-teal-600 p-3 rounded-2xl">
                  <FontAwesomeIcon icon={faReceipt} className="text-white text-xl" />
                </div>
                <Typography variant="h5" className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Available Fees ({adminFees.length})
                </Typography>
              </div>
              <Button
                variant="outlined"
                size="small"
                onClick={fetchAdminFees}
                disabled={isLoadingFees}
                className="!border-blue-300 !text-blue-600 hover:!bg-blue-50"
                startIcon={<FontAwesomeIcon icon={faSync} spin={isLoadingFees} />}
              >
                {isLoadingFees ? "Loading..." : "Refresh"}
              </Button>
            </div>

            <Grid container spacing={3}>
              {adminFees.length > 0 ? (
                adminFees.map((fee, index) => (
                  <Grid item xs={12} sm={6} md={4} key={fee._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card className="!shadow-lg !rounded-2xl !bg-white !border-0 hover:!shadow-xl !transition-all !duration-300">
                        <CardContent className="!p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <Typography variant="h6" className="!font-bold !text-gray-800 !mb-2">
                                {fee.feeName}
                              </Typography>
                              <Chip 
                                label={fee.category} 
                                size="small"
                                className="!bg-blue-50 !text-blue-700 !font-semibold !mb-2"
                              />
                              <Typography variant="body2" className="!text-gray-600 !mb-3">
                                {fee.description || "No description available"}
                              </Typography>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <Typography variant="h5" className="!font-bold !text-green-600">
                              ₹{fee.amount.toLocaleString()}
                            </Typography>
                            <Chip 
                              label={fee.status}
                              color={fee.status === 'Active' ? 'success' : 'default'}
                              size="small"
                            />
                          </div>

                          {fee.dueDate && (
                            <Typography variant="body2" className="!text-orange-600 !mb-4">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                              Due: {new Date(fee.dueDate).toLocaleDateString()}
                            </Typography>
                          )}

                          <div className="flex gap-2">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleFeeDetails(fee)}
                              className="!flex-1 !border-blue-300 !text-blue-600 hover:!bg-blue-50"
                            >
                              Details
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handlePayFee(fee)}
                              className="!flex-1 !bg-gradient-to-r !from-green-600 !to-emerald-600 !text-white hover:!shadow-lg"
                              startIcon={<FontAwesomeIcon icon={faCreditCard} />}
                            >
                              Pay Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Card className="!shadow-lg !rounded-2xl !bg-gradient-to-r !from-gray-50 !to-gray-100 !border-0">
                    <CardContent className="!p-8 !text-center">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-6xl text-gray-400 mb-4" />
                      <Typography variant="h6" className="!font-bold !text-gray-600 !mb-2">
                        No Admin Fees Available
                      </Typography>
                      <Typography variant="body2" className="!text-gray-500">
                        {isLoadingFees ? "Loading fees..." : "Admin hasn't created any fees yet. Check back later!"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
        </motion.div>

        {/* Fee Details Modal */}
        <Dialog 
          open={showFeeDetails} 
          onClose={() => setShowFeeDetails(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFileInvoice} />
              Fee Details
            </div>
          </DialogTitle>
          <DialogContent className="!p-6">
            {selectedFee && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600">
                      Fee Name
                    </Typography>
                    <Typography variant="body1" className="!text-gray-800">
                      {selectedFee.feeName}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600">
                      Category
                    </Typography>
                    <Chip label={selectedFee.category} size="small" className="!bg-blue-50 !text-blue-700" />
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600">
                      Amount
                    </Typography>
                    <Typography variant="h5" className="!font-bold !text-green-600">
                      ₹{selectedFee.amount?.toLocaleString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600">
                      Status
                    </Typography>
                    <Chip 
                      label={selectedFee.status} 
                      color={selectedFee.status === 'Active' ? 'success' : 'default'}
                      size="small"
                    />
                  </div>
                </div>
                
                {selectedFee.description && (
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600 !mb-2">
                      Description
                    </Typography>
                    <Typography variant="body1" className="!text-gray-800 !bg-gray-50 !p-3 !rounded-lg">
                      {selectedFee.description}
                    </Typography>
                  </div>
                )}

                {selectedFee.dueDate && (
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600">
                      Due Date
                    </Typography>
                    <Typography variant="body1" className="!text-orange-600">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {new Date(selectedFee.dueDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </div>
                )}

                {selectedFee.applicableClasses && selectedFee.applicableClasses.length > 0 && (
                  <div>
                    <Typography variant="subtitle2" className="!font-bold !text-gray-600 !mb-2">
                      Applicable Classes
                    </Typography>
                    <div className="flex flex-wrap gap-1">
                      {selectedFee.applicableClasses.map((cls, index) => (
                        <Chip key={index} label={cls} size="small" className="!bg-purple-50 !text-purple-700" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions className="!p-4 !bg-gray-50">
            <Button 
              onClick={() => setShowFeeDetails(false)}
              className="!text-gray-600"
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowFeeDetails(false);
                handlePayFee(selectedFee);
              }}
              className="!bg-gradient-to-r !from-green-600 !to-emerald-600 !text-white"
              startIcon={<FontAwesomeIcon icon={faCreditCard} />}
            >
              Pay ₹{selectedFee?.amount?.toLocaleString()}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
