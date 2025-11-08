import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  Assessment,
  Support,
  TrendingUp,
  People,
  AttachMoney,
  School,
} from "@mui/icons-material";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const API_URL = "http://localhost:5000/api";

export default function Reports() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [supportTickets, setSupportTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalStudents: 0,
    totalTickets: 0,
    pendingTickets: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch support tickets
      const ticketsRes = await axios.get(`${API_URL}/support/admin/tickets`, config);
      if (ticketsRes.data.success) {
        setSupportTickets(ticketsRes.data.tickets || []);
        setStats(prev => ({
          ...prev,
          totalTickets: ticketsRes.data.tickets.length,
          pendingTickets: ticketsRes.data.tickets.filter(t => t.status === "Open").length,
        }));
      }

      // Fetch dashboard stats
      const statsRes = await axios.get(`${API_URL}/admin/dashboard/stats`, config);
      if (statsRes.data.success) {
        setStats(prev => ({
          ...prev,
          totalRevenue: statsRes.data.stats.totalCollected || 0,
          totalStudents: statsRes.data.stats.totalStudents || 0,
        }));
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "warning";
      case "In Progress":
        return "info";
      case "Resolved":
        return "success";
      case "Closed":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Reports & Analytics
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Comprehensive fee payment analysis and support tickets
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={3}>
            <Paper className="!p-4 !bg-gradient-to-br !from-green-500 !to-green-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2">Total Revenue</Typography>
                </Box>
                <AttachMoney className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="!p-4 !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
                <People className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="!p-4 !bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.totalTickets}
                  </Typography>
                  <Typography variant="body2">Support Tickets</Typography>
                </Box>
                <Support className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper className="!p-4 !bg-gradient-to-br !from-orange-500 !to-orange-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.pendingTickets}
                  </Typography>
                  <Typography variant="body2">Pending Tickets</Typography>
                </Box>
                <Assessment className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card className="!shadow-lg !mb-6">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            className="!border-b"
          >
            <Tab label="Support Tickets" icon={<Support />} iconPosition="start" />
            <Tab label="Revenue Trend" icon={<TrendingUp />} iconPosition="start" />
            <Tab label="Payment Analysis" icon={<AttachMoney />} iconPosition="start" />
          </Tabs>
        </Card>

        {/* Support Tickets Tab */}
        {activeTab === 0 && (
          <Card className="!shadow-lg">
            <CardContent>
              <Box className="flex justify-between items-center mb-4">
                <Typography variant="h6" className="!font-semibold">
                  Student Support Tickets
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={fetchData}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <Typography className="!text-center !py-8 !text-gray-500">
                  Loading tickets...
                </Typography>
              ) : supportTickets.length === 0 ? (
                <Typography className="!text-center !py-8 !text-gray-500">
                  No support tickets found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className="!bg-gray-50">
                        <TableCell className="!font-semibold">Ticket ID</TableCell>
                        <TableCell className="!font-semibold">Student</TableCell>
                        <TableCell className="!font-semibold">Subject</TableCell>
                        <TableCell className="!font-semibold">Category</TableCell>
                        <TableCell className="!font-semibold">Priority</TableCell>
                        <TableCell className="!font-semibold">Status</TableCell>
                        <TableCell className="!font-semibold">Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supportTickets.map((ticket) => (
                        <TableRow key={ticket._id} className="hover:!bg-gray-50">
                          <TableCell className="!font-mono !text-sm">
                            {ticket.ticketId}
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" className="!font-medium">
                                {ticket.userId?.name || "N/A"}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {ticket.userId?.regno || "N/A"}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>
                            <Chip label={ticket.category} size="small" className="!bg-blue-100 !text-blue-800" />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              color={getPriorityColor(ticket.priority)}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ticket.status}
                              size="small"
                              color={getStatusColor(ticket.status)}
                            />
                          </TableCell>
                          <TableCell className="!text-sm">
                            {formatDate(ticket.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Revenue Trend Tab */}
        {activeTab === 1 && (
          <Card className="!shadow-lg">
            <CardContent>
              <Typography variant="h6" className="!font-semibold !mb-4">
                Revenue Trend
              </Typography>
              <Box className="!h-64 flex items-center justify-center !bg-gray-50 !rounded">
                <Typography className="!text-gray-500">
                  Chart visualization coming soon...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Payment Analysis Tab */}
        {activeTab === 2 && (
          <Card className="!shadow-lg">
            <CardContent>
              <Typography variant="h6" className="!font-semibold !mb-4">
                Payment Analysis
              </Typography>
              <Box className="!h-64 flex items-center justify-center !bg-gray-50 !rounded">
                <Typography className="!text-gray-500">
                  Analysis charts coming soon...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </AdminLayout>
  );
}
