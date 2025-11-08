import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null");
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const logout = () => {
    localStorage.removeItem("ofprs_token");
    localStorage.removeItem("ofprs_user");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="sticky" className="!bg-white !shadow-md" elevation={0}>
        <Toolbar className="container mx-auto flex justify-between py-2">
          {/* Logo */}
          <Link to="/dashboard" className="no-underline">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <Typography variant="h5" className="!font-bold !bg-gradient-to-r !from-blue-600 !to-cyan-600 !bg-clip-text !text-transparent">
                OFPRS
              </Typography>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/dashboard" className="no-underline">
              <Button
                className={`!rounded-xl !px-4 !py-2 !transition-all ${
                  isActive('/dashboard')
                    ? '!bg-gradient-to-r !from-blue-600 !to-cyan-600 !text-white !shadow-lg'
                    : '!text-gray-700 hover:!bg-gray-100'
                }`}
              >
                🏠 Dashboard
              </Button>
            </Link>
            <Link to="/pay" className="no-underline">
              <Button
                className={`!rounded-xl !px-4 !py-2 !transition-all ${
                  isActive('/pay')
                    ? '!bg-gradient-to-r !from-blue-600 !to-cyan-600 !text-white !shadow-lg'
                    : '!text-gray-700 hover:!bg-gray-100'
                }`}
              >
                💳 Pay Fees
              </Button>
            </Link>
            {user ? (
              <>
                <div className="mx-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <Typography variant="body2" className="text-blue-600 font-semibold">
                    👤 {user.name}
                  </Typography>
                </div>
                <Button
                  onClick={logout}
                  className="!bg-red-500 !text-white !rounded-xl !px-4 !py-2 hover:!bg-red-600 !transition-all"
                >
                  🚪 Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="no-underline">
                  <Button className="!text-gray-700 hover:!bg-gray-100 !rounded-xl !px-4 !py-2">
                    Login
                  </Button>
                </Link>
                <Link to="/signup" className="no-underline">
                  <Button className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !text-white !rounded-xl !px-4 !py-2 !shadow-lg">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <IconButton
            className="md:!hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <div className="w-64 p-4">
          <List>
            <ListItem button onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
              <ListItemText primary="🏠 Dashboard" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/pay'); setMobileOpen(false); }}>
              <ListItemText primary="💳 Pay Fees" />
            </ListItem>
            {user ? (
              <>
                <ListItem>
                  <ListItemText primary={`👤 ${user.name}`} />
                </ListItem>
                <ListItem button onClick={() => { logout(); setMobileOpen(false); }}>
                  <ListItemText primary="🚪 Logout" className="text-red-500" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button onClick={() => { navigate('/login'); setMobileOpen(false); }}>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button onClick={() => { navigate('/signup'); setMobileOpen(false); }}>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
}
