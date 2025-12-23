import React, { useState } from "react";
import api from "../services/api";
import {
  Button,
  TextField,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    regno: "",
    password: "",
    email: "",
    otp: "",
  });

  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Regular Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("🔐 Starting student login process...");
      console.log("👤 Login data:", { regno: form.regno, password: "[HIDDEN]" });
      
      const res = await api.post("/auth/login", {
        regno: form.regno,
        password: form.password,
      });

      console.log("📡 Login response:", {
        status: res.status,
        message: res.data.message,
        hasToken: !!res.data.token,
        userName: res.data.user?.name
      });

      const { token, user } = res.data;
      localStorage.setItem("ofprs_token", token);
      localStorage.setItem("ofprs_user", JSON.stringify(user));
      
      console.log("✅ Student login successful - stored token and user data");
      console.log("👤 User details:", user);
      
      setSnackbar({ open: true, message: "✅ Login successful!", severity: "success" });
      setTimeout(() => nav("/dashboard"), 1000);
    } catch (err) {
      console.error("❌ Student login error details:");
      console.error("  - Status:", err.response?.status);
      console.error("  - Status Text:", err.response?.statusText);
      console.error("  - Data:", err.response?.data);
      console.error("  - Message:", err.message);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || "Invalid credentials.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes('Network Error')) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!form.email) return alert("Please enter your registered email");
    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { email: form.email });
      setOtpSent(true);
      setSnackbar({ open: true, message: res.data.message || "📩 OTP sent to your email!", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Failed to send OTP", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!form.otp) return alert("Please enter the OTP");
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", {
        email: form.email,
        otp: form.otp,
      });
      const { token, user } = res.data;
      localStorage.setItem("ofprs_token", token);
      localStorage.setItem("ofprs_user", JSON.stringify(user));
      setSnackbar({ open: true, message: "✅ OTP verified! Login successful.", severity: "success" });
      setTimeout(() => nav("/dashboard"), 1000);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "OTP verification failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4">
      <Container maxWidth="sm">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-2xl mb-4"
            >
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              {isOtpMode ? "Login with OTP" : "Welcome Back"}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              {isOtpMode ? "Enter your email to receive OTP" : "Sign in to your account"}
            </Typography>
          </div>

          {/* 🔹 PASSWORD LOGIN FORM */}
          {!isOtpMode ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
            <TextField
              name="regno"
              label="Registration No"
              fullWidth
              required
              value={form.regno}
              onChange={change}
            />
            <TextField
              name="password"
              label="Password"
              fullWidth
              type="password"
              required
              value={form.password}
              onChange={change}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <div className="flex items-center justify-between mt-4">
              <Typography
                variant="body2"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setIsOtpMode(true)}
              >
                🔐 Login with OTP instead
              </Typography>
              <Link to="/signup" className="text-sm text-gray-600 hover:text-blue-600">
                Create account
              </Link>
            </div>

            {/* Admin Login Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to="/admin/login">
                <Button
                  variant="outlined"
                  fullWidth
                  className="!border-2 !border-purple-500 !text-purple-600 !py-2.5 !rounded-xl !font-semibold hover:!bg-purple-50 !transition-all"
                >
                  👨‍💼 Admin Login
                </Button>
              </Link>
            </div>
          </form>
        ) : (
            // 🔹 OTP LOGIN FLOW
            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="space-y-4"
            >
            <TextField
              name="email"
              label="Registered Email"
              fullWidth
              required
              type="email"
              value={form.email}
              onChange={change}
              inputProps={{
                inputMode: "email",
                autoComplete: "email"
              }}
              placeholder="your.email@example.com"
            />

            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <TextField
                  name="otp"
                  label="Enter OTP"
                  fullWidth
                  required
                  value={form.otp}
                  onChange={change}
                  inputProps={{
                    className: "otp-input",
                    maxLength: 6,
                    pattern: "[0-9]*",
                    inputMode: "numeric"
                  }}
                  placeholder="000000"
                />
              </motion.div>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending OTP..."
                : otpSent
                ? "Verify OTP & Login"
                : "Send OTP"}
            </Button>

            <div className="flex items-center justify-between mt-4">
              <Typography
                variant="body2"
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => {
                  setIsOtpMode(false);
                  setOtpSent(false);
                  setForm({ ...form, email: "", otp: "" });
                }}
              >
                🔙 Login with Password
              </Typography>
              <Link to="/signup" className="text-sm text-gray-600 hover:text-blue-600">
                Create account
              </Link>
            </div>

            {/* Admin Login Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link to="/admin/login">
                <Button
                  variant="outlined"
                  fullWidth
                  className="!border-2 !border-purple-500 !text-purple-600 !py-2.5 !rounded-xl !font-semibold hover:!bg-purple-50 !transition-all"
                >
                  👨‍💼 Admin Login
                </Button>
              </Link>
            </div>
          </form>
          )}
        </motion.div>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
}
