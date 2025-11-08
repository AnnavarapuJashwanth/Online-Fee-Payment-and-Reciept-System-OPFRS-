import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/icons-material";

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

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
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
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              className={`!rounded-lg !text-white hover:!bg-purple-800 !transition-all ${
                location.pathname === item.path ? "!bg-purple-800" : ""
              }`}
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
        {children}
      </Box>
    </Box>
  );
}
