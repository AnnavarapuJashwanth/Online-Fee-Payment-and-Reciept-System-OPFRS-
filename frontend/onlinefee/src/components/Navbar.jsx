import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Avatar, Badge, Chip } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCreditCard,
  faUser,
  faSignOutAlt,
  faSignInAlt,
  faUserPlus,
  faBars,
  faTimes,
  faWallet,
  faReceipt,
  faBell,
  faMoneyCheckAlt
} from "@fortawesome/free-solid-svg-icons";

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
      {/* Professional Navbar with Glassmorphism */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <AppBar 
          position="sticky" 
          className="!backdrop-blur-xl !bg-white/80 !shadow-lg !border-b !border-white/50"
          elevation={0}
          style={{
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar className="container mx-auto py-3">
            <div className="flex items-center justify-between w-full">
              {/* Logo Section - Left Side */}
              <Link to="/dashboard" className="no-underline">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  {/* Animated Logo Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg relative overflow-hidden">
                      {/* Animated shine effect */}
                      <motion.div
                        animate={{
                          x: [-100, 100],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                      
                      {/* Payment Icon */}
                      <FontAwesomeIcon 
                        icon={faMoneyCheckAlt} 
                        className="text-white text-2xl relative z-10" 
                      />
                    </div>
                    
                    {/* Pulsing dot indicator */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                    />
                  </motion.div>

                  {/* Logo Text */}
                  <div>
                    <Typography 
                      variant="h5" 
                      className="!font-black !bg-gradient-to-r !from-blue-600 !via-purple-600 !to-pink-600 !bg-clip-text !text-transparent !tracking-tight"
                    >
                      OFPRS
                    </Typography>
                    <Typography 
                      variant="caption" 
                      className="!text-gray-600 !font-semibold !text-xs !tracking-wide"
                    >
                      Online Fee Payment
                    </Typography>
                  </div>
                </motion.div>
              </Link>

              {/* Desktop Navigation - Center & Right */}
              <div className="hidden md:flex items-center gap-3">
                {/* Navigation Links */}
                <Link to="/dashboard" className="no-underline">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className={`!rounded-2xl !px-6 !py-2.5 !transition-all !font-semibold !text-sm ${
                        isActive('/dashboard')
                          ? '!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !shadow-lg'
                          : '!text-gray-700 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50'
                      }`}
                      startIcon={<FontAwesomeIcon icon={faHome} />}
                    >
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>

                <Link to="/pay" className="no-underline">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      className={`!rounded-2xl !px-6 !py-2.5 !transition-all !font-semibold !text-sm ${
                        isActive('/pay')
                          ? '!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !shadow-lg'
                          : '!text-gray-700 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50'
                      }`}
                      startIcon={<FontAwesomeIcon icon={faCreditCard} />}
                    >
                      Pay Fees
                    </Button>
                  </motion.div>
                </Link>

                {/* User Section */}
                {user ? (
                  <>
                    {/* User Info Chip */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="mx-2"
                    >
                      <Chip
                        avatar={
                          <Avatar className="!bg-gradient-to-br !from-blue-500 !to-purple-600 !text-white !font-bold">
                            {user.name?.charAt(0) || "U"}
                          </Avatar>
                        }
                        label={user.name}
                        className="!bg-gradient-to-r !from-blue-50 !to-purple-50 !text-gray-800 !font-semibold !px-2 !py-5 !border !border-blue-200"
                      />
                    </motion.div>

                    {/* Notifications Badge */}
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <IconButton className="!bg-gradient-to-r !from-orange-50 !to-pink-50 !text-orange-600">
                        <Badge badgeContent={0} color="error">
                          <FontAwesomeIcon icon={faBell} />
                        </Badge>
                      </IconButton>
                    </motion.div>

                    {/* Logout Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={logout}
                        className="!bg-gradient-to-r !from-red-500 !to-pink-600 !text-white !rounded-2xl !px-6 !py-2.5 !shadow-lg hover:!shadow-xl !transition-all !font-semibold !text-sm"
                        startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                      >
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="no-underline">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          className="!text-gray-700 hover:!bg-gradient-to-r hover:!from-blue-50 hover:!to-purple-50 !rounded-2xl !px-6 !py-2.5 !font-semibold !text-sm"
                          startIcon={<FontAwesomeIcon icon={faSignInAlt} />}
                        >
                          Login
                        </Button>
                      </motion.div>
                    </Link>
                    <Link to="/signup" className="no-underline">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white !rounded-2xl !px-6 !py-2.5 !shadow-lg hover:!shadow-xl !transition-all !font-semibold !text-sm"
                          startIcon={<FontAwesomeIcon icon={faUserPlus} />}
                        >
                          Sign Up
                        </Button>
                      </motion.div>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  className="md:!hidden !bg-gradient-to-r !from-blue-50 !to-purple-50 !text-blue-600"
                  onClick={() => setMobileOpen(!mobileOpen)}
                >
                  <FontAwesomeIcon icon={mobileOpen ? faTimes : faBars} />
                </IconButton>
              </motion.div>
            </div>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer with Glassmorphism */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          className: "!backdrop-blur-xl !bg-white/95",
          style: {
            width: "280px",
          }
        }}
      >
        <div className="p-6">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl">
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-white text-xl" />
            </div>
            <div>
              <Typography variant="h6" className="!font-black !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent">
                OFPRS
              </Typography>
              <Typography variant="caption" className="!text-gray-600 !font-semibold">
                Online Fee Payment
              </Typography>
            </div>
          </div>

          {/* Mobile Navigation */}
          <List className="space-y-2">
            <ListItem 
              button 
              onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
              className={`!rounded-xl !mb-2 ${isActive('/dashboard') ? '!bg-gradient-to-r !from-blue-50 !to-purple-50' : ''}`}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3 text-blue-600" />
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ className: "!font-semibold" }}
              />
            </ListItem>

            <ListItem 
              button 
              onClick={() => { navigate('/pay'); setMobileOpen(false); }}
              className={`!rounded-xl !mb-2 ${isActive('/pay') ? '!bg-gradient-to-r !from-blue-50 !to-purple-50' : ''}`}
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-3 text-purple-600" />
              <ListItemText 
                primary="Pay Fees" 
                primaryTypographyProps={{ className: "!font-semibold" }}
              />
            </ListItem>

            {user ? (
              <>
                <div className="my-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="!bg-gradient-to-br !from-blue-500 !to-purple-600 !text-white !font-bold">
                      {user.name?.charAt(0) || "U"}
                    </Avatar>
                    <div>
                      <Typography variant="body2" className="!font-bold !text-gray-800">
                        {user.name}
                      </Typography>
                      <Typography variant="caption" className="!text-gray-600">
                        {user.email}
                      </Typography>
                    </div>
                  </div>
                </div>

                <ListItem 
                  button 
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="!rounded-xl !bg-gradient-to-r !from-red-50 !to-pink-50 !text-red-600"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                  <ListItemText 
                    primary="Logout" 
                    primaryTypographyProps={{ className: "!font-semibold !text-red-600" }}
                  />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem 
                  button 
                  onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="!rounded-xl !mb-2"
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-3 text-blue-600" />
                  <ListItemText 
                    primary="Login" 
                    primaryTypographyProps={{ className: "!font-semibold" }}
                  />
                </ListItem>

                <ListItem 
                  button 
                  onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                  className="!rounded-xl !bg-gradient-to-r !from-blue-600 !to-purple-600 !text-white"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="mr-3" />
                  <ListItemText 
                    primary="Sign Up" 
                    primaryTypographyProps={{ className: "!font-semibold !text-white" }}
                  />
                </ListItem>
              </>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
}
