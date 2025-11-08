import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createOrder, verifyPayment } from "../services/paymentService";
import { Button, TextField, Container, Typography, CircularProgress, Alert, Snackbar, Card, CardContent, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import { downloadReceipt } from "../utils/pdfGenerator";
import { getTransactionById } from "../services/transactionService";

export default function PaymentPage() {
  const location = useLocation();
  const savedUser = JSON.parse(localStorage.getItem("ofprs_user") || "null") || {};
  
  // Get fee data from navigation state
  const feeData = location.state || {};
  
  const [name, setName] = useState(savedUser.name || "");
  const [email, setEmail] = useState(savedUser.email || "");
  const [phone, setPhone] = useState(savedUser.phone || "");
  const [regno, setRegno] = useState(savedUser.regno || "");
  const [amount, setAmount] = useState(feeData.amount?.toString() || "500");
  const [feeType, setFeeType] = useState(feeData.feeType || feeData.category || "Tuition");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [feeName, setFeeName] = useState(feeData.feeName || "");
  const [feeDescription, setFeeDescription] = useState(feeData.description || "");

  // Update form fields when fee data is received from Dashboard
  useEffect(() => {
    if (feeData && feeData.amount) {
      setAmount(feeData.amount.toString());
      setFeeType(feeData.feeType || feeData.category || "Tuition");
      setFeeName(feeData.feeName || "");
      setFeeDescription(feeData.description || "");
      console.log("✅ Payment form pre-filled with fee data:", feeData);
    }
  }, [feeData]);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setSnackbar({ open: true, message: "Please enter a valid amount", severity: "error" });
      return;
    }
    if (!name || !email) {
      setSnackbar({ open: true, message: "Please fill in all fields", severity: "error" });
      return;
    }
    
    setLoading(true);
    try {
      const res = await createOrder({ 
        amount: Number(amount), 
        name, 
        email,
        phone,
        regno,
        feeType,
        userId: savedUser._id
      });
      const { order, key } = res;
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "OFPRS - College Fees",
        description: "Fee payment",
        order_id: order.id,
        prefill: { name, email },
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            if (verifyRes.success) {
              setSnackbar({ open: true, message: "✅ Payment successful! Receipt sent to your email.", severity: "success" });
              
              // Auto-generate and download PDF receipt
              setTimeout(async () => {
                try {
                  // Fetch the complete transaction details
                  const transactionData = await getTransactionById(response.razorpay_order_id);
                  if (transactionData.success) {
                    downloadReceipt(transactionData.transaction);
                  }
                } catch (err) {
                  console.error("Error generating PDF:", err);
                }
              }, 2000);
            } else {
              setSnackbar({ open: true, message: "❌ Payment verification failed", severity: "error" });
            }
          } catch (err) {
            setSnackbar({ open: true, message: "Error verifying payment", severity: "error" });
          }
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        },
        theme: { color: "#1976D2" }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setSnackbar({ open: true, message: err.response?.data?.message || "Could not create order", severity: "error" });
      setLoading(false);
    }
  };

  const feeOptions = [
    { label: "Tuition Fee", amount: 5000 },
    { label: "Exam Fee", amount: 1000 },
    { label: "Library Fee", amount: 500 },
    { label: "Lab Fee", amount: 2000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <Container maxWidth="md">
        <motion.div
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Fee Payment
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Secure online payment powered by Razorpay
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              <Typography variant="h6" className="font-bold text-gray-800 mb-6">Payment Details</Typography>
              
              {/* Fee Information Display */}
              {feeName && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-200">
                  <Typography variant="h6" className="font-bold text-blue-800 mb-2">
                    {feeName}
                  </Typography>
                  {feeDescription && (
                    <Typography variant="body2" className="text-blue-600 mb-2">
                      {feeDescription}
                    </Typography>
                  )}
                  <Typography variant="body1" className="font-semibold text-green-600">
                    Amount: ₹{amount ? Number(amount).toLocaleString() : '0'}
                  </Typography>
                </div>
              )}
              
              <div className="space-y-4">
                <TextField
                  label="Full Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Registration Number"
                  fullWidth
                  value={regno}
                  onChange={(e) => setRegno(e.target.value)}
                  required
                />
                <TextField
                  label="Email Address"
                  fullWidth
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <TextField
                  select
                  label="Fee Type"
                  fullWidth
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value)}
                  required
                >
                  <MenuItem value="Tuition">Tuition</MenuItem>
                  <MenuItem value="Examination">Examination</MenuItem>
                  <MenuItem value="Library">Library</MenuItem>
                  <MenuItem value="Laboratory">Laboratory</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Transportation">Transportation</MenuItem>
                  <MenuItem value="Hostel">Hostel</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </TextField>
                <TextField
                  label="Amount (INR)"
                  fullWidth
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <span className="mr-2 text-gray-500">₹</span>,
                  }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handlePayment}
                  disabled={loading}
                  className="!bg-gradient-to-r !from-blue-600 !to-cyan-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? "Processing..." : "Pay Now with Razorpay"}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <Typography variant="caption" className="text-gray-600">
                  🔒 Secure payment gateway powered by Razorpay. Your payment information is encrypted and secure.
                </Typography>
              </div>
            </motion.div>

            {/* Fee Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-6">
                <Typography variant="h6" className="font-bold text-gray-800 mb-4">Quick Fee Selection</Typography>
                <div className="space-y-3">
                  {feeOptions.map((option, index) => (
                    <Card
                      key={index}
                      className="!rounded-xl !shadow-md hover:!shadow-lg !transition-all cursor-pointer"
                      onClick={() => setAmount(option.amount.toString())}
                    >
                      <CardContent className="!p-4">
                        <div className="flex justify-between items-center">
                          <Typography className="font-semibold text-gray-700">{option.label}</Typography>
                          <Typography className="font-bold text-blue-600">₹{option.amount}</Typography>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-xl p-6 text-white">
                <Typography variant="h6" className="font-bold mb-4">💡 Payment Information</Typography>
                <ul className="space-y-2 text-sm">
                  <li>✓ Instant payment confirmation</li>
                  <li>✓ Email receipt after successful payment</li>
                  <li>✓ Multiple payment methods supported</li>
                  <li>✓ 100% secure transactions</li>
                </ul>
              </div>
            </motion.div>
          </div>
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
