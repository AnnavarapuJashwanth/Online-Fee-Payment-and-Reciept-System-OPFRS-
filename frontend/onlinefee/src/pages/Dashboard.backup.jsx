import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Card, CardContent, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null") || { name: "Guest" };
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ofprs_token");
    localStorage.removeItem("ofprs_user");
    navigate("/login");
  };

  const stats = [
    { label: "Total Paid", value: "₹0", icon: "💰", color: "from-green-400 to-green-600" },
    { label: "Pending", value: "₹0", icon: "⏳", color: "from-yellow-400 to-yellow-600" },
    { label: "Transactions", value: "0", icon: "📊", color: "from-blue-400 to-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8">
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome back, {user.name}! 👋
              </Typography>
              <Typography className="text-gray-600 mt-2">
                Reg No: <span className="font-semibold">{user.regno || "-"}</span> | Email: <span className="font-semibold">{user.email || "-"}</span>
              </Typography>
              <Typography className="text-sm text-gray-500 mt-1">
                {currentTime.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </div>
            <div className="flex gap-3">
              <Link to="/pay">
                <Button variant="contained" className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !px-6 !py-3 !rounded-xl !shadow-lg hover:!shadow-xl !transition-all">
                  💳 Pay Fees
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outlined" className="!border-red-500 !text-red-500 hover:!bg-red-50 !px-6 !py-3 !rounded-xl">
                🚪 Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          {stats.map((stat, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="!rounded-2xl !shadow-lg hover:!shadow-xl !transition-all !border !border-gray-100">
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography className="text-gray-600 text-sm font-medium">{stat.label}</Typography>
                        <Typography variant="h4" className="font-bold mt-2">{stat.value}</Typography>
                      </div>
                      <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl text-3xl`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Recent Payments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <Typography variant="h5" className="font-bold text-gray-800">
              📋 Recent Transactions
            </Typography>
            <Button variant="text" className="!text-blue-600">View All</Button>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">📭</div>
            <Typography variant="h6" className="text-gray-700 font-semibold mb-2">
              No transactions yet
            </Typography>
            <Typography className="text-gray-500 mb-4">
              Start by making your first fee payment
            </Typography>
            <Link to="/pay">
              <Button variant="contained" className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !px-6 !py-2 !rounded-xl">
                Make Payment
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
        >
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">⚡ Quick Actions</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">📄</div>
                <Typography className="font-semibold text-gray-700">Download Receipt</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">📊</div>
                <Typography className="font-semibold text-gray-700">Payment History</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">🔔</div>
                <Typography className="font-semibold text-gray-700">Notifications</Typography>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-xl text-center cursor-pointer hover:shadow-lg transition-all">
                <div className="text-3xl mb-2">⚙️</div>
                <Typography className="font-semibold text-gray-700">Settings</Typography>
              </div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </div>
  );
}
