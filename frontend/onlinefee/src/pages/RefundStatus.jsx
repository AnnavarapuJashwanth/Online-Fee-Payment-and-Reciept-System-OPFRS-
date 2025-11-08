import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBillWave,
  faCheckCircle,
  faClock,
  faSpinner,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

export default function RefundStatus() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    transactionId: "",
    amount: "",
    reason: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  });

  useEffect(() => {
    fetchRefunds();
    fetchTransactions();
  }, []);

  const fetchRefunds = async () => {
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await api.get("/refunds/user");
      
      if (response.data.success) {
        setRefunds(response.data.refunds);
      }
    } catch (error) {
      console.error("Error fetching refunds:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
      const response = await api.get(`/payment/transactions?email=${user.email}`);
      
      if (response.data.success) {
        const paidTransactions = response.data.transactions.filter(t => t.status === "paid");
        setTransactions(paidTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSubmitRefund = async () => {
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await api.post("/refunds", {
          ...formData,
          bankDetails: {
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode,
            accountHolderName: formData.accountHolderName,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOpenDialog(false);
        fetchRefunds();
        setFormData({
          transactionId: "",
          amount: "",
          reason: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
        });
      }
    } catch (error) {
      console.error("Error submitting refund:", error);
    }
  };

  const getStatusStep = (status) => {
    const steps = ["Request Submitted", "Request Approved", "Processing Refund", "Refund Completed"];
    return steps.indexOf(status);
  };

  const getStatusColor = (status) => {
    const colors = {
      "Request Submitted": "#ffd43b",
      "Request Approved": "#51cf66",
      "Processing Refund": "#339af0",
      "Refund Completed": "#51cf66",
      "Rejected": "#ff6b6b",
    };
    return colors[status] || "#868e96";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mb-4">
            <FontAwesomeIcon icon={faMoneyBillWave} className="text-white text-4xl" />
          </div>
          <Typography variant="h4" className="!font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Refund Status
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Track your refund requests and status
          </Typography>
        </motion.div>

        {/* Request Refund Button */}
        <div className="mb-6 text-right">
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              "&:hover": {
                background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              },
            }}
          >
            Request Refund
          </Button>
        </div>

        {/* Refund List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : refunds.length === 0 ? (
          <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
            <CardContent className="!p-12 text-center">
              <FontAwesomeIcon icon={faFileInvoice} className="text-gray-300 text-6xl mb-4" />
              <Typography variant="h6" className="!text-gray-600 !mb-2">
                No refund requests yet
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                Click "Request Refund" to submit a new request
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {refunds.map((refund, index) => (
              <motion.div
                key={refund._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 overflow-hidden">
                  <div
                    className="h-2"
                    style={{ backgroundColor: getStatusColor(refund.status) }}
                  />
                  <CardContent className="!p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <Typography variant="h6" className="!font-bold !text-gray-800 !mb-1">
                          Refund Status
                        </Typography>
                        <Typography variant="caption" className="!text-gray-500">
                          Request ID: {refund._id.slice(-8).toUpperCase()}
                        </Typography>
                      </div>
                      <Chip
                        label={refund.status}
                        sx={{
                          backgroundColor: getStatusColor(refund.status),
                          color: "#fff",
                          fontWeight: "bold",
                          padding: "20px 12px",
                        }}
                      />
                    </div>

                    {/* Refund Details */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <Typography variant="caption" className="!text-gray-500">
                          Amount
                        </Typography>
                        <Typography variant="h6" className="!font-bold !text-gray-800">
                          ₹{refund.amount}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" className="!text-gray-500">
                          Request Date
                        </Typography>
                        <Typography variant="body2" className="!font-semibold !text-gray-800">
                          {new Date(refund.requestDate).toLocaleDateString()}
                        </Typography>
                      </div>
                      <div className="md:col-span-2">
                        <Typography variant="caption" className="!text-gray-500">
                          Reason
                        </Typography>
                        <Typography variant="body2" className="!text-gray-700">
                          {refund.reason}
                        </Typography>
                      </div>
                    </div>

                    {/* Timeline */}
                    <Stepper activeStep={getStatusStep(refund.status)} orientation="vertical">
                      {refund.timeline?.map((item, idx) => (
                        <Step key={idx} completed={idx <= getStatusStep(refund.status)}>
                          <StepLabel
                            StepIconComponent={() => (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{
                                  backgroundColor: idx <= getStatusStep(refund.status)
                                    ? getStatusColor(item.status)
                                    : "#e0e0e0",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={idx <= getStatusStep(refund.status) ? faCheckCircle : faClock}
                                  className="text-white text-sm"
                                />
                              </div>
                            )}
                          >
                            <Typography variant="subtitle2" className="!font-bold">
                              {item.status}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Typography variant="caption" className="!text-gray-500">
                              {new Date(item.date).toLocaleString()}
                            </Typography>
                            {item.note && (
                              <Typography variant="body2" className="!text-gray-600 !mt-1">
                                {item.note}
                              </Typography>
                            )}
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Request Refund Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Request Refund</DialogTitle>
          <DialogContent>
            <div className="space-y-4 mt-2">
              <TextField
                fullWidth
                select
                label="Select Transaction"
                value={formData.transactionId}
                onChange={(e) => {
                  const transaction = transactions.find(t => t._id === e.target.value);
                  setFormData({
                    ...formData,
                    transactionId: e.target.value,
                    amount: transaction?.amount || "",
                  });
                }}
                variant="outlined"
              >
                {transactions.map((transaction) => (
                  <MenuItem key={transaction._id} value={transaction._id}>
                    {transaction.feeType} - ₹{transaction.amount} ({new Date(transaction.createdAt).toLocaleDateString()})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Refund Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                type="number"
                variant="outlined"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason for Refund"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                variant="outlined"
              />

              <Typography variant="subtitle2" className="!font-bold !text-gray-700 !mt-4">
                Bank Details
              </Typography>

              <TextField
                fullWidth
                label="Account Holder Name"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                variant="outlined"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              onClick={handleSubmitRefund}
              variant="contained"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
