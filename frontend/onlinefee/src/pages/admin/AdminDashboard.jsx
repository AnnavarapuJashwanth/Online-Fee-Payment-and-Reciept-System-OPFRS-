import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  AccountBalance,
  PendingActions,
  People,
  AttachMoney,
  Payment,
  Notifications,
  Assessment,
} from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    totalCollected: 0,
    pendingDues: 0,
    totalStudents: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("📊 AdminDashboard: Starting data fetch...");
      const token = localStorage.getItem("admin_token");
      const adminUser = localStorage.getItem("admin_user");
      
      console.log("🔍 AdminDashboard: Token check:", {
        hasToken: !!token,
        hasAdminUser: !!adminUser,
        tokenLength: token?.length
      });
      
      if (!token) {
        console.log("❌ AdminDashboard: No token found, redirecting to login");
        navigate("/admin/login");
        return;
      }

      console.log("📡 AdminDashboard: Fetching stats...");
      // Fetch stats
      const statsRes = await api.get("/admin/dashboard/stats");
      console.log("📈 AdminDashboard: Stats response:", {
        status: statsRes.status,
        success: statsRes.data.success,
        stats: statsRes.data.stats
      });
      
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      console.log("📡 AdminDashboard: Fetching recent activity...");
      // Fetch recent activity
      const activityRes = await api.get("/admin/dashboard/recent-activity");
      console.log("📋 AdminDashboard: Activity response:", {
        status: activityRes.status,
        success: activityRes.data.success,
        activitiesCount: activityRes.data.activities?.length
      });
      
      if (activityRes.data.success) {
        setRecentActivity(activityRes.data.activities);
      }

      console.log("✅ AdminDashboard: Data fetch completed successfully");
      setLoading(false);
    } catch (error) {
      console.error("❌ AdminDashboard: Error fetching dashboard data:");
      console.error("  - Status:", error.response?.status);
      console.error("  - Status Text:", error.response?.statusText);
      console.error("  - Data:", error.response?.data);
      console.error("  - Message:", error.message);
      console.error("  - Full Error:", error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("🔓 AdminDashboard: Authentication error, clearing tokens and redirecting");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminLayout>
      <Box>
        {/* Welcome Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Welcome back, Super Admin! 👋
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Here's what's happening with your fee management system today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          {/* Today's Revenue */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !cursor-pointer">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90 !font-medium">
                    Today's Revenue
                  </Typography>
                  <TrendingUp className="!text-3xl" />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  {formatCurrency(stats.todayRevenue)}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  {stats.todayRevenue > 0 ? "+12% from yesterday" : "No payments today"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Collected */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-green-500 !to-green-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !cursor-pointer">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90 !font-medium">
                    Total Collected
                  </Typography>
                  <AccountBalance className="!text-3xl" />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  {formatCurrency(stats.totalCollected)}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  {stats.totalTransactions || 0} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Pending Dues */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-orange-500 !to-orange-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !cursor-pointer">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90 !font-medium">
                    Pending Dues
                  </Typography>
                  <PendingActions className="!text-3xl" />
                </Box>
                <Typography variant="h4" className="!font-bold !mb-1">
                  {formatCurrency(stats.pendingDues)}
                </Typography>
                <Typography variant="caption" className="!opacity-75">
                  From {stats.pendingStudentsCount || 0} students
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Students */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white !shadow-lg hover:!shadow-xl !transition-all !cursor-pointer">
              <CardContent>
                <Box className="flex items-center justify-between mb-2">
                  <Typography variant="body2" className="!opacity-90 !font-medium">
                    Total Students
                  </Typography>
                  <People className="!text-3xl" />
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
                  startIcon={<AttachMoney />}
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
                  startIcon={<Payment />}
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
                  startIcon={<Notifications />}
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
                  startIcon={<Assessment />}
                  onClick={() => navigate("/admin/reports")}
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="!shadow-lg">
          <CardContent>
            <Box className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="!font-semibold">
                Recent Activity
              </Typography>
              <Button
                size="small"
                onClick={() => navigate("/admin/payments")}
                className="!text-purple-600"
              >
                View All
              </Button>
            </Box>

            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                Loading...
              </Typography>
            ) : recentActivity.length === 0 ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                No recent activity
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="!bg-gray-50">
                      <TableCell className="!font-semibold">Student</TableCell>
                      <TableCell className="!font-semibold">Reg No</TableCell>
                      <TableCell className="!font-semibold">Amount</TableCell>
                      <TableCell className="!font-semibold">Type</TableCell>
                      <TableCell className="!font-semibold">Date</TableCell>
                      <TableCell className="!font-semibold">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.map((activity, index) => (
                      <TableRow key={index} className="hover:!bg-gray-50">
                        <TableCell>{activity.student}</TableCell>
                        <TableCell className="!font-mono !text-sm">{activity.regno}</TableCell>
                        <TableCell className="!font-semibold !text-green-600">
                          {formatCurrency(activity.amount)}
                        </TableCell>
                        <TableCell>{activity.type}</TableCell>
                        <TableCell className="!text-sm !text-gray-600">
                          {formatDate(activity.date)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={activity.status}
                            size="small"
                            className="!bg-green-100 !text-green-800 !font-medium"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}
