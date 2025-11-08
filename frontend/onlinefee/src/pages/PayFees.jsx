import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { createOrder, verifyPayment } from "../services/paymentService";
import { getStudentFee, canPayForSemester, getSemesterNumber } from "../utils/feeStructure";
import { hostelFee, transportFee } from "../utils/feeStructure";

export default function PayFees() {
  const savedUser = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errorDialog, setErrorDialog] = useState({ open: false, message: "" });
  
  const [paymentData, setPaymentData] = useState({
    name: savedUser.name || "",
    email: savedUser.email || "",
    phone: savedUser.phone || "",
    regno: savedUser.regno || "",
    feeCategory: "Tuition Fee",
    year: savedUser.year || "1st Year",
    semester: savedUser.semester || "1st Semester",
    hostelType: "AC Rooms",
    transportDistance: "Within 10km",
    amount: 0,
    testMode: false,
    testAmount: "500",
  });

  useEffect(() => {
    calculateAmount();
  }, [paymentData.feeCategory, paymentData.year, paymentData.semester, paymentData.hostelType, paymentData.transportDistance, paymentData.testMode, paymentData.testAmount]);

  const calculateAmount = () => {
    let amount = 0;
    
    // If test mode is enabled, use test amount
    if (paymentData.testMode) {
      amount = parseInt(paymentData.testAmount);
    } else {
      // Calculate actual fee amount
      if (paymentData.feeCategory === "Tuition Fee") {
        const studentFee = getStudentFee(
          savedUser.category || "Category A",
          savedUser.branch || "Computer Science and Engineering",
          paymentData.year,
          paymentData.semester
        );
        if (studentFee) {
          amount = studentFee.tuitionFee + studentFee.admissionFee;
        }
      } else if (paymentData.feeCategory === "Hostel Fee") {
        const hostelFees = hostelFee[paymentData.hostelType];
        amount = hostelFees.feePerSemester;
        if (paymentData.year === "1st Year" && paymentData.semester === "1st Semester") {
          amount += hostelFees.registrationFee;
        }
      } else if (paymentData.feeCategory === "Transport Fee") {
        const transportFees = transportFee[paymentData.transportDistance];
        amount = transportFees.feePerSemester;
      }
    }
    
    setPaymentData({ ...paymentData, amount });
  };

  const handleChange = (field, value) => {
    setPaymentData({ ...paymentData, [field]: value });
  };

  const validatePayment = () => {
    // Check if student is paying for their current semester
    const canPay = canPayForSemester(
      savedUser.year || "1st Year",
      savedUser.semester || "1st Semester",
      paymentData.year,
      paymentData.semester
    );

    if (!canPay) {
      const currentSem = getSemesterNumber(savedUser.year || "1st Year", savedUser.semester || "1st Semester");
      const targetSem = getSemesterNumber(paymentData.year, paymentData.semester);
      
      let message = "";
      if (targetSem < currentSem) {
        message = `You cannot pay for past semesters. You are currently in ${savedUser.year} ${savedUser.semester}.`;
      } else {
        message = `You can only pay for your current semester (${savedUser.year} ${savedUser.semester}). Please update your profile if you've advanced to the next semester.`;
      }
      
      setErrorDialog({ open: true, message });
      return false;
    }
    
    return true;
  };

  const handlePayment = async () => {
    if (!validatePayment()) {
      return;
    }

    if (paymentData.amount <= 0) {
      setSnackbar({ open: true, message: "Invalid amount", severity: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await createOrder({
        amount: Number(paymentData.amount),
        name: paymentData.name,
        email: paymentData.email,
        phone: paymentData.phone,
        regno: paymentData.regno,
        feeType: `${paymentData.feeCategory} - ${paymentData.year} ${paymentData.semester}`,
        userId: savedUser._id,
      });

      const { order, key } = res;
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "OFPRS - College Fees",
        description: `${paymentData.feeCategory} Payment`,
        order_id: order.id,
        prefill: { name: paymentData.name, email: paymentData.email },
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.success) {
              setSnackbar({
                open: true,
                message: "✅ Payment successful! Receipt sent to your email.",
                severity: "success",
              });
            } else {
              setSnackbar({ open: true, message: "❌ Payment verification failed", severity: "error" });
            }
          } catch (err) {
            setSnackbar({ open: true, message: "Error verifying payment", severity: "error" });
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
        theme: { color: "#1976D2" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Could not create order",
        severity: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <Container maxWidth="lg">
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
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-2xl mb-4"
            >
              <FontAwesomeIcon icon={faCreditCard} className="text-white text-4xl" />
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Pay Fees
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Secure semester fee payment
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
                <CardContent className="!p-8">
                  <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                    Payment Details
                  </Typography>

                  <div className="space-y-4">
                    {/* Student Info - Read Only */}
                    <TextField label="Full Name" value={paymentData.name} fullWidth disabled />
                    <TextField label="Registration Number" value={paymentData.regno} fullWidth disabled />
                    <TextField label="Email" value={paymentData.email} fullWidth disabled />
                    <TextField label="Phone" value={paymentData.phone} fullWidth disabled />

                    {/* Fee Category Selection */}
                    <TextField
                      select
                      label="Fee Category"
                      value={paymentData.feeCategory}
                      onChange={(e) => handleChange("feeCategory", e.target.value)}
                      fullWidth
                      required
                    >
                      <MenuItem value="Tuition Fee">Tuition Fee</MenuItem>
                      <MenuItem value="Hostel Fee">Hostel Fee</MenuItem>
                      <MenuItem value="Transport Fee">Transport Fee</MenuItem>
                    </TextField>

                    {/* Year and Semester Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <TextField
                        select
                        label="Year"
                        value={paymentData.year}
                        onChange={(e) => handleChange("year", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="1st Year">1st Year</MenuItem>
                        <MenuItem value="2nd Year">2nd Year</MenuItem>
                        <MenuItem value="3rd Year">3rd Year</MenuItem>
                        <MenuItem value="4th Year">4th Year</MenuItem>
                      </TextField>

                      <TextField
                        select
                        label="Semester"
                        value={paymentData.semester}
                        onChange={(e) => handleChange("semester", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="1st Semester">1st Semester</MenuItem>
                        <MenuItem value="2nd Semester">2nd Semester</MenuItem>
                      </TextField>
                    </div>

                    {/* Conditional Fields */}
                    {paymentData.feeCategory === "Hostel Fee" && (
                      <TextField
                        select
                        label="Hostel Type"
                        value={paymentData.hostelType}
                        onChange={(e) => handleChange("hostelType", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="AC Rooms">AC Rooms</MenuItem>
                        <MenuItem value="Non AC Rooms">Non AC Rooms</MenuItem>
                      </TextField>
                    )}

                    {paymentData.feeCategory === "Transport Fee" && (
                      <TextField
                        select
                        label="Distance"
                        value={paymentData.transportDistance}
                        onChange={(e) => handleChange("transportDistance", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="Within 10km">Within 10km</MenuItem>
                        <MenuItem value="10-20km">10-20km</MenuItem>
                        <MenuItem value="20-30km">20-30km</MenuItem>
                        <MenuItem value="Above 30km">Above 30km</MenuItem>
                      </TextField>
                    )}

                    {/* Test Mode Section */}
                    <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          id="testMode"
                          checked={paymentData.testMode}
                          onChange={(e) => handleChange("testMode", e.target.checked)}
                          className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <label htmlFor="testMode" className="font-semibold text-amber-800 cursor-pointer">
                          🧪 Test Mode (Razorpay Demo)
                        </label>
                      </div>
                      
                      {paymentData.testMode && (
                        <>
                          <Typography variant="caption" className="!text-amber-700 !block !mb-3">
                            ⚠️ Razorpay test mode cannot process large amounts. Select a test amount below for demo purposes.
                          </Typography>
                          
                          <TextField
                            select
                            label="Test Amount"
                            value={paymentData.testAmount}
                            onChange={(e) => handleChange("testAmount", e.target.value)}
                            fullWidth
                            size="small"
                            className="!bg-white"
                          >
                            <MenuItem value="100">₹100 - Minimal Test</MenuItem>
                            <MenuItem value="500">₹500 - Small Test</MenuItem>
                            <MenuItem value="1000">₹1,000 - Medium Test</MenuItem>
                            <MenuItem value="2000">₹2,000 - Standard Test</MenuItem>
                            <MenuItem value="3000">₹3,000 - Large Test</MenuItem>
                            <MenuItem value="5000">₹5,000 - Maximum Test</MenuItem>
                          </TextField>
                        </>
                      )}
                    </div>

                    {/* Amount Display */}
                    <div className={`p-6 rounded-2xl ${paymentData.testMode ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
                      <Typography variant="body2" className="!text-gray-600 !mb-2">
                        {paymentData.testMode ? '🧪 Test Amount' : 'Total Amount'}
                      </Typography>
                      <Typography variant="h4" className={`!font-bold ${paymentData.testMode ? '!text-amber-600' : '!text-indigo-600'}`}>
                        ₹{paymentData.amount.toLocaleString()}
                      </Typography>
                      {paymentData.testMode && (
                        <Typography variant="caption" className="!text-amber-700 !mt-2 !block">
                          Demo mode - Use test cards for payment
                        </Typography>
                      )}
                    </div>

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handlePayment}
                      disabled={loading}
                      className="!bg-gradient-to-r !from-indigo-600 !to-purple-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all"
                      startIcon={
                        loading ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faCreditCard} />
                      }
                    >
                      {loading ? "Processing..." : "Pay Now with Razorpay"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {/* Current Semester Info */}
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 !mb-6">
                <CardContent className="!p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-xl">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
                    </div>
                    <Typography variant="h6" className="!font-bold !text-gray-800">
                      Your Current Info
                    </Typography>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <Typography variant="body2" className="!text-gray-600">Year:</Typography>
                      <Typography variant="body2" className="!font-bold !text-gray-800">
                        {savedUser.year || "Not Set"}
                      </Typography>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <Typography variant="body2" className="!text-gray-600">Semester:</Typography>
                      <Typography variant="body2" className="!font-bold !text-gray-800">
                        {savedUser.semester || "Not Set"}
                      </Typography>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <Typography variant="body2" className="!text-gray-600">Branch:</Typography>
                      <Typography variant="body2" className="!font-bold !text-gray-800">
                        {savedUser.branch || "Not Set"}
                      </Typography>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                      <Typography variant="body2" className="!text-gray-600">Section:</Typography>
                      <Typography variant="body2" className="!font-bold !text-gray-800">
                        {savedUser.section || "Not Set"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Info */}
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 !bg-gradient-to-br !from-indigo-600 !to-purple-600">
                <CardContent className="!p-6 !text-white">
                  <Typography variant="h6" className="!font-bold !mb-4">
                    💡 Payment Information
                  </Typography>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Pay only for your current semester</li>
                    <li>✓ Update profile before advancing semester</li>
                    <li>✓ Instant payment confirmation</li>
                    <li>✓ Email receipt after payment</li>
                    <li>✓ 100% secure transactions</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Dialog */}
        <Dialog
          open={errorDialog.open}
          onClose={() => setErrorDialog({ ...errorDialog, open: false })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle className="!bg-red-50">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 text-2xl" />
              <Typography variant="h6" className="!font-bold !text-red-600">
                Payment Not Allowed
              </Typography>
            </div>
          </DialogTitle>
          <DialogContent className="!pt-6">
            <Typography variant="body1" className="!text-gray-700">
              {errorDialog.message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setErrorDialog({ ...errorDialog, open: false })}
              className="!text-red-600 !font-semibold"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
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
