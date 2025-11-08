import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faUpload,
  faCheckCircle,
  faClock,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Scholarships() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    studentId: user.regno || "",
    fullName: user.name || "",
    scholarshipType: "",
    reasonForApplication: "",
  });

  const scholarshipTypes = [
    "Merit-based",
    "Need-based",
    "Sports",
    "Cultural",
    "Research",
    "Other",
  ];

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await axios.get(`${API_URL}/scholarships/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.success) {
        setScholarships(response.data.scholarships);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.scholarshipType || !formData.reasonForApplication) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await axios.post(`${API_URL}/scholarships`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Scholarship application submitted successfully!",
          severity: "success",
        });
        setFormData({
          ...formData,
          scholarshipType: "",
          reasonForApplication: "",
        });
        fetchScholarships();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit application",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Pending": "#ffd43b",
      "Under Review": "#339af0",
      "Approved": "#51cf66",
      "Rejected": "#ff6b6b",
    };
    return colors[status] || "#868e96";
  };

  const getStatusIcon = (status) => {
    const icons = {
      "Pending": faClock,
      "Under Review": faClock,
      "Approved": faCheckCircle,
      "Rejected": faTimesCircle,
    };
    return icons[status] || faClock;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mb-4">
            <FontAwesomeIcon icon={faGraduationCap} className="text-white text-4xl" />
          </div>
          <Typography variant="h4" className="!font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Scholarship Application
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Apply for scholarships and track your applications
          </Typography>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
              <CardContent className="!p-8">
                <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                  New Application
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TextField
                    fullWidth
                    label="Student ID"
                    value={formData.studentId}
                    disabled
                    variant="outlined"
                    className="!mb-4"
                  />

                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    variant="outlined"
                    required
                  />

                  <TextField
                    fullWidth
                    select
                    label="Scholarship Type"
                    value={formData.scholarshipType}
                    onChange={(e) => handleChange("scholarshipType", e.target.value)}
                    variant="outlined"
                    required
                  >
                    {scholarshipTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Reason for Application"
                    value={formData.reasonForApplication}
                    onChange={(e) => handleChange("reasonForApplication", e.target.value)}
                    variant="outlined"
                    placeholder="Explain why you are applying for this scholarship..."
                    required
                  />

                  <Box className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all cursor-pointer">
                    <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-3xl mb-2" />
                    <Typography variant="body2" className="text-gray-500">
                      Click to browse or drag and drop
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      PDF, JPG, PNG (Max 5MB)
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff",
                      padding: "12px",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "16px",
                      "&:hover": {
                        background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
              <CardContent className="!p-8">
                <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                  Application Status
                </Typography>

                {scholarships.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-gray-300 text-5xl mb-4" />
                    <Typography variant="body2" className="text-gray-500">
                      No applications yet
                    </Typography>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scholarships.map((scholarship, index) => (
                      <motion.div
                        key={scholarship._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Typography variant="subtitle1" className="!font-bold !text-gray-800">
                            {scholarship.scholarshipType}
                          </Typography>
                          <Chip
                            icon={<FontAwesomeIcon icon={getStatusIcon(scholarship.status)} />}
                            label={scholarship.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(scholarship.status),
                              color: "#fff",
                              fontWeight: "bold",
                            }}
                          />
                        </div>
                        <Typography variant="caption" className="!text-gray-500 block mb-2">
                          Applied on: {new Date(scholarship.appliedDate).toLocaleDateString()}
                        </Typography>
                        {scholarship.status === "Approved" && scholarship.amount > 0 && (
                          <Typography variant="body2" className="!text-green-600 !font-bold">
                            Amount: ₹{scholarship.amount}
                          </Typography>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
