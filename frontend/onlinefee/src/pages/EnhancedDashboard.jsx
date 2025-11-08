import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Card, CardContent, Grid, Avatar, Chip, Box,
  AppBar, Toolbar, IconButton, Menu, MenuItem, Switch, FormControlLabel,
  Badge, Divider, ListItemIcon, ListItemText, Tooltip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import { 
  DarkMode, LightMode, AccountCircle, Logout, Person, 
  Notifications, ExpandMore, Payment as PaymentIcon, School,
  AttachMoney, Schedule, CheckCircle, Warning
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave, faHourglassHalf, faChartLine, faFileInvoice,
  faHistory, faBell, faCog, faWallet, faCreditCard, faDownload,
  faArrowRight, faCheckCircle, faClock, faCalendarAlt, faIdCard,
  faSignOutAlt, faBolt, faStar, faGraduationCap, faBook, faFlask,
  faEnvelope, faReceipt, faChartBar, faUserCircle
} from "@fortawesome/free-solid-svg-icons";
import { getAllTransactions } from "../services/transactionService";
import api from "../services/api";

export default function EnhancedDashboard() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null") || { name: "Guest" };
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [fees, setFees] = useState([]);
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

  // Fetch fees, announcements and payment data
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.email) {
        try {
          const token = localStorage.getItem("ofprs_token");
          const config = {
            headers: { Authorization: `Bearer ${token}` }
          };

          // Fetch student fees and payment summary
          const [feesRes, summaryRes, announcementsRes] = await Promise.all([
            api.get("/fees/student"),
            api.get("/fees/student/summary"),
            api.get("/announcements")
          ]);

          if (feesRes.data.success) {
            setFees(feesRes.data.fees || []);
          }

          if (summaryRes.data.success) {
            const summary = summaryRes.data.summary;
            setStats({
              totalPaid: summary.totalPaidAmount || 0,
              pending: summary.totalPending || 0,
              transactionCount: summary.transactionCount || 0,
              totalFeeAmount: summary.totalFeeAmount || 0,
              paymentPercentage: summary.paymentPercentage || 0
            });
          }

          if (announcementsRes.data.success) {
            setAnnouncements(announcementsRes.data.announcements || []);
          }

        } catch (error) {
          console.error("Error fetching data:", error);
          // Fallback to old method if new endpoints fail
          try {
            const data = await getAllTransactions(user.email);
            const transactions = data.transactions || [];
            const totalPaid = transactions
              .filter(t => t.status === "paid")
              .reduce((sum, t) => sum + t.amount, 0);
            const pending = Math.max(0, (user.pendingFee || 50505) - totalPaid);
            
            setStats({
              totalPaid,
              pending,
              transactionCount: transactions.length,
              totalFeeAmount: user.pendingFee || 50505,
              paymentPercentage: pending > 0 ? Math.round((totalPaid / (user.pendingFee || 50505)) * 100) : 100
            });
          } catch (fallbackError) {
            console.error("Fallback error:", fallbackError);
          }
        }
      }
    };
    fetchData();
  }, [user]);

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("ofprs_token");
    localStorage.removeItem("ofprs_user");
    localStorage.removeItem("darkMode");
    navigate("/login");
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handlePayFee = (fee) => {
    navigate('/payment', { 
      state: { 
        amount: fee.remainingAmount,
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
    {
      label: "Payment Progress",
      value: `${stats.paymentPercentage}%`,
      icon: faChartBar,
      gradient: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      delay: 0.4
    }
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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
    } py-8 relative overflow-hidden`}>
      
      {/* Header with Dark Mode Toggle and User Menu */}
      <AppBar 
        position="static" 
        className={`!mb-8 ${darkMode ? '!bg-gray-800/90' : '!bg-white/90'} !backdrop-blur-xl !shadow-lg`}
        elevation={0}
      >
        <Toolbar className="!px-8">
          <Typography variant="h6" className={`!flex-1 !font-bold ${darkMode ? '!text-white' : '!text-gray-800'}`}>
            OFPRS Dashboard
          </Typography>
          
          {/* Dark Mode Toggle */}
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleDarkModeToggle}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
              />
            }
            label=""
            className="!mr-4"
          />
          
          {/* Notifications */}
          <Tooltip title="Announcements">
            <IconButton onClick={handleNotificationOpen} className={darkMode ? '!text-white' : '!text-gray-700'}>
              <Badge badgeContent={announcements.length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* User Menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleUserMenuOpen} className={darkMode ? '!text-white' : '!text-gray-700'}>
              <AccountCircle />
              <ExpandMore />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        className="!mt-2"
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon><Person /></ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        className="!mt-2"
        PaperProps={{ style: { maxWidth: 400, maxHeight: 400 } }}
      >
        {announcements.length > 0 ? (
          announcements.slice(0, 5).map((announcement, index) => (
            <MenuItem key={index} onClick={handleNotificationClose}>
              <Box>
                <Typography variant="subtitle2" className="!font-semibold">
                  {announcement.title}
                </Typography>
                <Typography variant="caption" className="!text-gray-600">
                  {announcement.content?.substring(0, 100)}...
                </Typography>
              </Box>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2" className="!text-gray-500">
              No new announcements
            </Typography>
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={() => navigate('/announcements')}>
          <Typography variant="body2" className="!text-blue-600 !font-semibold">
            View All Announcements
          </Typography>
        </MenuItem>
      </Menu>

      <Container maxWidth="lg" className="relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className={`backdrop-blur-xl ${
            darkMode ? 'bg-gray-800/70' : 'bg-white/70'
          } rounded-3xl shadow-2xl p-8 mb-8 border ${
            darkMode ? 'border-gray-700/50' : 'border-white/50'
          } relative overflow-hidden`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="!w-20 !h-20 !bg-gradient-to-br !from-blue-500 !to-purple-600 !text-2xl !font-bold !shadow-lg">
                {user.name?.charAt(0) || "G"}
              </Avatar>
              <div>
                <Typography variant="h4" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'} !mb-2`}>
                  {greeting}, {user.name || "Guest"}!
                </Typography>
                <Typography variant="body1" className={`${darkMode ? '!text-gray-300' : '!text-gray-600'} !mb-2`}>
                  Registration: {user.regno || "N/A"}
                </Typography>
                <Chip 
                  label={stats.pending > 0 ? "Pending Payments" : "All Fees Paid"} 
                  color={stats.pending > 0 ? "warning" : "success"}
                  className="!font-semibold"
                />
              </div>
            </div>
            <div className="text-right">
              <Typography variant="h6" className={`${darkMode ? '!text-gray-300' : '!text-gray-600'} !mb-1`}>
                {currentTime.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
              <Typography variant="h4" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'}`}>
                {currentTime.toLocaleTimeString('en-IN', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} className="!mb-8">
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay, duration: 0.5 }}
              >
                <Card className={`!shadow-lg !rounded-2xl ${darkMode ? '!bg-gray-800' : '!bg-white'} !border-0 hover:!shadow-xl !transition-all !duration-300`}>
                  <CardContent className="!p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body2" className={`${darkMode ? '!text-gray-400' : '!text-gray-600'} !mb-2`}>
                          {card.label}
                        </Typography>
                        <Typography variant="h4" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'}`}>
                          {card.value}
                        </Typography>
                      </div>
                      <div className={`p-3 rounded-xl ${card.bgColor}`}>
                        <FontAwesomeIcon icon={card.icon} className={`text-2xl ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Fee Management Section */}
        {fees.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="!mb-8"
          >
            <Card className={`!shadow-lg !rounded-2xl ${darkMode ? '!bg-gray-800' : '!bg-white'} !border-0`}>
              <CardContent className="!p-6">
                <Typography variant="h5" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'} !mb-4`}>
                  Fee Management
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Fee Name</TableCell>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Category</TableCell>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Amount</TableCell>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Due Date</TableCell>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Status</TableCell>
                        <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fees.map((fee, index) => (
                        <TableRow key={index}>
                          <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>
                            {fee.feeName}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={fee.category} 
                              size="small" 
                              className="!bg-blue-100 !text-blue-800"
                            />
                          </TableCell>
                          <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>
                            ₹{fee.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className={darkMode ? '!text-gray-300' : '!text-gray-700'}>
                            {new Date(fee.dueDate).toLocaleDateString('en-IN')}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={fee.isPaid ? "Paid" : fee.isOverdue ? "Overdue" : "Pending"}
                              color={fee.isPaid ? "success" : fee.isOverdue ? "error" : "warning"}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {!fee.isPaid && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handlePayFee(fee)}
                                className="!bg-gradient-to-r !from-blue-500 !to-purple-600"
                              >
                                Pay ₹{fee.remainingAmount.toLocaleString()}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
          <Typography variant="h5" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'} !mb-6`}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: action.delay, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className={`!shadow-lg !rounded-2xl ${darkMode ? '!bg-gray-800' : '!bg-white'} !border-0 hover:!shadow-xl !transition-all !duration-300 !cursor-pointer`}
                    onClick={() => navigate(action.path)}
                  >
                    <CardContent className="!p-6 !text-center">
                      <div className={`p-4 rounded-xl ${action.bgColor} !mb-4 !inline-block`}>
                        <FontAwesomeIcon icon={action.icon} className="text-2xl text-blue-600" />
                      </div>
                      <Typography variant="h6" className={`!font-bold ${darkMode ? '!text-white' : '!text-gray-800'} !mb-2`}>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" className={darkMode ? '!text-gray-400' : '!text-gray-600'}>
                        {action.description}
                      </Typography>
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
