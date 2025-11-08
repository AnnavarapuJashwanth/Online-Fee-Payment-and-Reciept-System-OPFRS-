import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  Assessment as ReportIcon,
  Notifications as NotificationIcon,
  Upload as UploadIcon,
  History as HistoryIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon,
  Logout as LogoutIcon,
  TrendingUp,
  AccountBalance,
  PendingActions,
} from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faMoneyBillWave, faChartLine } from "@fortawesome/free-solid-svg-icons";

const drawerWidth = 260;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
  { text: "Manage Fees", icon: <MoneyIcon />, path: "/admin/manage-fees" },
  { text: "All Payments", icon: <PaymentIcon />, path: "/admin/payments" },
  { text: "Student Status", icon: <PeopleIcon />, path: "/admin/students" },
  { text: "Reports", icon: <ReportIcon />, path: "/admin/reports" },
  { text: "Send Reminders", icon: <NotificationIcon />, path: "/admin/reminders" },
  { text: "Bulk Upload", icon: <UploadIcon />, path: "/admin/bulk-upload" },
  { text: "Activity Log", icon: <HistoryIcon />, path: "/admin/activity-log" },
  { text: "Scholarships", icon: <SchoolIcon />, path: "/admin/scholarships" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    todayRevenue: 125000,
    totalCollected: 2500000,
    pendingDues: 750000,
    totalStudents: 1250,
  });

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("admin_token");
    const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setAdminUser(user);
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const drawer = (
    <div className="h-full bg-gradient-to-b from-purple-900 to-indigo-900">
      {/* Logo */}
      <div className="p-4 text-center border-b border-purple-700">
        <Typography variant="h5" className="!text-white !font-bold">
          OFPRS Admin
        </Typography>
        <Typography variant="caption" className="!text-purple-200">
          Fee Management System
        </Typography>
      </div>

      {/* Menu Items */}
      <List className="!py-4">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="!px-2 !mb-1">
            <ListItemButton
              onClick={() => navigate(item.path)}
              className="!rounded-lg !text-white hover:!bg-purple-800 !transition-all"
            >
              <ListItemIcon className="!text-purple-200 !min-w-[40px]">
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider className="!bg-purple-700 !mx-4" />

      {/* Logout */}
      <List className="!px-2 !mt-4">
        <ListItemButton
          onClick={handleLogout}
          className="!rounded-lg !text-white hover:!bg-red-600 !transition-all"
        >
          <ListItemIcon className="!text-red-300 !min-w-[40px]">
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  return (
    <Box className="flex h-screen bg-gray-100">
      {/* App Bar */}
      <AppBar
        position="fixed"
        className="!bg-white !shadow-md"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            className="!text-gray-800"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" className="!flex-1 !text-gray-800 !font-semibold">
            Admin Dashboard
          </Typography>

          <Typography variant="body2" className="!text-gray-600 !mr-3">
            {adminUser?.name || "Admin User"}
          </Typography>

          <Avatar className="!bg-purple-600 !cursor-pointer">
            {adminUser?.name?.charAt(0) || "A"}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        className="flex-1 p-6 overflow-auto"
        sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: "64px" }}
      >
        {/* Welcome Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Welcome back, {adminUser?.name}! 👋
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Here's what's happening with your fee management system today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          {/* Today's Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-lg hover:!shadow-xl !transition-all">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90">
                    Today's Revenue
                  </Typography>
                  <TrendingUp />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  ₹{stats.todayRevenue.toLocaleString()}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  +12% from yesterday
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Collected */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-green-500 !to-green-600 !text-white !shadow-lg hover:!shadow-xl !transition-all">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90">
                    Total Collected
                  </Typography>
                  <AccountBalance />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  ₹{stats.totalCollected.toLocaleString()}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  This semester
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Dues */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-orange-500 !to-orange-600 !text-white !shadow-lg hover:!shadow-xl !transition-all">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90">
                    Pending Dues
                  </Typography>
                  <PendingActions />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  ₹{stats.pendingDues.toLocaleString()}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  From 450 students
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Students */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white !shadow-lg hover:!shadow-xl !transition-all">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90">
                    Total Students
                  </Typography>
                  <FontAwesomeIcon icon={faUsers} className="text-2xl" />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  {stats.totalStudents}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  Active students
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Typography variant="h6" className="!font-semibold !mb-4">
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 !py-3"
                  startIcon={<MoneyIcon />}
                  onClick={() => navigate("/admin/manage-fees")}
                >
                  Add New Fee
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !py-3"
                  startIcon={<PaymentIcon />}
                  onClick={() => navigate("/admin/payments")}
                >
                  View Payments
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="!bg-gradient-to-r !from-green-600 !to-teal-600 !py-3"
                  startIcon={<NotificationIcon />}
                  onClick={() => navigate("/admin/reminders")}
                >
                  Send Reminder
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="contained"
                  className="!bg-gradient-to-r !from-orange-600 !to-red-600 !py-3"
                  startIcon={<ReportIcon />}
                  onClick={() => navigate("/admin/reports")}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="!shadow-lg !bg-gradient-to-r !from-purple-50 !to-blue-50">
          <CardContent className="text-center !py-8">
            <Typography variant="h5" className="!font-bold !text-purple-800 !mb-2">
              🚀 Admin Dashboard is Live!
            </Typography>
            <Typography variant="body1" className="!text-gray-700 !mb-4">
              All admin features are now available. Use the sidebar to navigate.
            </Typography>
            <Typography variant="body2" className="!text-gray-600">
              Student payments will automatically sync with this admin dashboard.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
