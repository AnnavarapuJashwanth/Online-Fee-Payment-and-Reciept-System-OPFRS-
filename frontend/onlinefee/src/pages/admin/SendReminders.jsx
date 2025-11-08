import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import {
  Send,
  Email,
  Sms,
  People,
  CheckCircle,
} from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function SendReminders() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingStudents: 0,
  });

  const [formData, setFormData] = useState({
    reminderType: "email",
    targetGroup: "all_pending",
    subject: "Fee Payment Reminder",
    message: "",
    year: "all",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await api.get("/admin/dashboard/stats");
      if (response.data.success) {
        setStats({
          totalStudents: response.data.stats.totalStudents || 0,
          pendingStudents: response.data.stats.pendingStudentsCount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSendReminder = async () => {
    if (!formData.message) {
      setError("Please enter a message");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Check if sending to all users
      const endpoint = formData.targetGroup === "all_users" 
        ? "/admin/send-email-all"
        : "/admin/send-reminder";

      const response = await api.post(
        endpoint,
        formData
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          ...formData,
          message: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      setError(error.response?.data?.message || "Failed to send reminder");
    } finally {
      setLoading(false);
    }
  };

  const getTargetCount = () => {
    switch (formData.targetGroup) {
      case "all_students":
        return stats.totalStudents;
      case "all_pending":
        return stats.pendingStudents;
      default:
        return 0;
    }
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Send Reminders
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Send payment reminders to students via email or SMS
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold">
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="body2">Total Students</Typography>
                </Box>
                <People className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-orange-500 !to-orange-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold">
                    {stats.pendingStudents}
                  </Typography>
                  <Typography variant="body2">Pending Payments</Typography>
                </Box>
                <Email className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-green-500 !to-green-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h4" className="!font-bold">
                    {getTargetCount()}
                  </Typography>
                  <Typography variant="body2">Will Receive Reminder</Typography>
                </Box>
                <Send className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Reminder Form */}
        <Card className="!shadow-lg">
          <CardContent>
            <Typography variant="h6" className="!font-semibold !mb-4">
              Compose Reminder
            </Typography>

            {success && (
              <Alert severity="success" className="!mb-4" icon={<CheckCircle />}>
                Reminder sent successfully to {getTargetCount()} students!
              </Alert>
            )}

            {error && (
              <Alert severity="error" className="!mb-4">
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Reminder Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Reminder Type</InputLabel>
                  <Select
                    name="reminderType"
                    value={formData.reminderType}
                    onChange={handleChange}
                    label="Reminder Type"
                  >
                    <MenuItem value="email">
                      <Box className="flex items-center gap-2">
                        <Email /> Email
                      </Box>
                    </MenuItem>
                    <MenuItem value="sms">
                      <Box className="flex items-center gap-2">
                        <Sms /> SMS
                      </Box>
                    </MenuItem>
                    <MenuItem value="both">
                      <Box className="flex items-center gap-2">
                        <Send /> Email & SMS
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Target Group */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Group</InputLabel>
                  <Select
                    name="targetGroup"
                    value={formData.targetGroup}
                    onChange={handleChange}
                    label="Target Group"
                  >
                    <MenuItem value="all_students">
                      All Students ({stats.totalStudents})
                    </MenuItem>
                    <MenuItem value="all_users">
                      All Registered Users ({stats.totalUsers})
                    </MenuItem>
                    <MenuItem value="all_pending">
                      Students with Pending Payments ({stats.pendingStudents})
                    </MenuItem>
                    <MenuItem value="1st_year">1st Year Students</MenuItem>
                    <MenuItem value="2nd_year">2nd Year Students</MenuItem>
                    <MenuItem value="3rd_year">3rd Year Students</MenuItem>
                    <MenuItem value="4th_year">4th Year Students</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter email subject"
                />
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={6}
                  placeholder="Enter your reminder message here..."
                  required
                />
                <Typography variant="caption" className="!text-gray-500 !mt-1">
                  Tip: Use placeholders like {"{student_name}"}, {"{amount}"}, {"{due_date}"}
                </Typography>
              </Grid>

              {/* Preview */}
              <Grid item xs={12}>
                <Paper className="!p-4 !bg-gray-50">
                  <Typography variant="subtitle2" className="!font-semibold !mb-2">
                    Preview:
                  </Typography>
                  <Typography variant="body2" className="!text-gray-700">
                    <strong>To:</strong> {getTargetCount()} students
                  </Typography>
                  <Typography variant="body2" className="!text-gray-700">
                    <strong>Via:</strong>{" "}
                    {formData.reminderType === "email"
                      ? "Email"
                      : formData.reminderType === "sms"
                      ? "SMS"
                      : "Email & SMS"}
                  </Typography>
                  <Typography variant="body2" className="!text-gray-700 !mt-2">
                    <strong>Subject:</strong> {formData.subject}
                  </Typography>
                  <Typography variant="body2" className="!text-gray-700 !mt-2 !whitespace-pre-wrap">
                    {formData.message || "Your message will appear here..."}
                  </Typography>
                </Paper>
              </Grid>

              {/* Send Button */}
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 !py-3"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  onClick={handleSendReminder}
                  disabled={loading || !formData.message}
                >
                  {loading ? "Sending..." : `Send Reminder to ${getTargetCount()} Students`}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card className="!shadow-lg !mt-6">
          <CardContent>
            <Typography variant="h6" className="!font-semibold !mb-4">
              Quick Templates
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  className="!p-4 !cursor-pointer hover:!shadow-md !transition-all"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      subject: "Urgent: Fee Payment Reminder",
                      message:
                        "Dear {student_name},\n\nThis is a reminder that your fee payment of ₹{amount} is pending. Please make the payment before {due_date} to avoid late fees.\n\nThank you,\nVignan University",
                    })
                  }
                >
                  <Typography variant="subtitle2" className="!font-semibold !text-orange-600">
                    Payment Reminder
                  </Typography>
                  <Typography variant="caption" className="!text-gray-600">
                    Standard payment reminder template
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  className="!p-4 !cursor-pointer hover:!shadow-md !transition-all"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      subject: "Last Chance: Fee Payment Due",
                      message:
                        "Dear {student_name},\n\nThis is your final reminder. Your fee payment is overdue. Please pay immediately to avoid penalties.\n\nAmount Due: ₹{amount}\n\nThank you,\nVignan University",
                    })
                  }
                >
                  <Typography variant="subtitle2" className="!font-semibold !text-red-600">
                    Final Notice
                  </Typography>
                  <Typography variant="caption" className="!text-gray-600">
                    Final warning for overdue payments
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  className="!p-4 !cursor-pointer hover:!shadow-md !transition-all"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      subject: "Fee Payment Confirmation",
                      message:
                        "Dear {student_name},\n\nThank you for your payment! Your fee payment has been received and processed successfully.\n\nThank you,\nVignan University",
                    })
                  }
                >
                  <Typography variant="subtitle2" className="!font-semibold !text-green-600">
                    Payment Confirmation
                  </Typography>
                  <Typography variant="caption" className="!text-gray-600">
                    Confirm successful payment
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}
