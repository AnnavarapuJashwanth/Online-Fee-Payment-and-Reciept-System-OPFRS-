import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, AdminPanelSettings } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/admin/login`, formData);

      if (response.data.success) {
        // Store admin token and data
        localStorage.setItem("admin_token", response.data.token);
        localStorage.setItem("admin_user", JSON.stringify(response.data.admin));

        console.log("✅ Admin login successful");
        
        // Navigate to admin dashboard
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("❌ Admin login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <Container maxWidth="sm">
        <Card className="!shadow-2xl !rounded-2xl">
          <CardContent className="!p-8">
            {/* Header */}
            <Box className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4">
                <AdminPanelSettings className="!text-5xl !text-white" />
              </div>
              <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
                Admin Portal
              </Typography>
              <Typography variant="body2" className="!text-gray-600">
                OFPRS - Online Fee Payment & Receipt System
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" className="!mb-4">
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Admin Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="!mb-4"
                placeholder="admin@vignan.ac.in"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                className="!mb-6"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 !text-white !py-3 !rounded-xl !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
              </Button>
            </form>

            {/* Footer */}
            <Box className="mt-6 text-center">
              <Typography variant="caption" className="!text-gray-500">
                Authorized personnel only. All activities are logged.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Back to Student Portal */}
        <Box className="text-center mt-4">
          <Button
            variant="text"
            className="!text-white"
            onClick={() => navigate("/login")}
          >
            ← Back to Student Portal
          </Button>
        </Box>
      </Container>
    </div>
  );
}
