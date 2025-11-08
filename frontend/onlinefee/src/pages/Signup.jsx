import React, { useState } from "react";
import api from "../services/api";
import { Button, TextField, Container, Typography, CircularProgress, Alert, Snackbar } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    regno: "", // ✅ changed to lowercase
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const nav = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/signup", form);
      setSnackbar({ open: true, message: "✅ Signup successful! Redirecting to login...", severity: "success" });
      setTimeout(() => nav("/login"), 1500);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Signup failed", severity: "error" });
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Create Account
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Join us to manage your fee payments easily
            </Typography>
          </div>

          <form onSubmit={submit} className="space-y-4">
          <TextField 
            name="name" 
            label="Full Name" 
            fullWidth 
            required 
            value={form.name} 
            onChange={change}
            inputProps={{ autoComplete: "name" }}
          />
          <TextField 
            name="regno" 
            label="Registration No" 
            fullWidth 
            required 
            value={form.regno} 
            onChange={change}
            inputProps={{ autoComplete: "username" }}
          />
          <TextField 
            name="email" 
            label="Email" 
            type="email"
            fullWidth 
            required 
            value={form.email} 
            onChange={change}
            inputProps={{ 
              inputMode: "email",
              autoComplete: "email" 
            }}
            placeholder="your.email@example.com"
          />
          <TextField 
            name="phone" 
            label="Phone Number" 
            type="tel"
            fullWidth 
            required 
            value={form.phone} 
            onChange={change}
            inputProps={{ 
              inputMode: "tel",
              autoComplete: "tel",
              pattern: "[0-9]*"
            }}
            placeholder="+91 9876543210"
          />
          <TextField 
            name="password" 
            label="Password" 
            type="password" 
            fullWidth 
            required 
            value={form.password} 
            onChange={change}
            inputProps={{ autoComplete: "new-password" }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="text-center mt-4">
            <Typography variant="body2" className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </Typography>
          </div>
        </form>
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
