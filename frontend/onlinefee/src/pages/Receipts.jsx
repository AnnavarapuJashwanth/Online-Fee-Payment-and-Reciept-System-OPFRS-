import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReceipt, faDownload, faEye, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import { getAllTransactions } from "../services/transactionService";
import { downloadReceipt, viewReceipt } from "../utils/pdfGenerator";

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null");

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions(user?.email);
      // Only show paid transactions
      const paidTransactions = (data.transactions || []).filter(t => t.status === "paid");
      setReceipts(paidTransactions);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8">
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 mb-8 border border-white/50"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-600 to-teal-600 p-4 rounded-2xl">
              <FontAwesomeIcon icon={faReceipt} className="text-white text-3xl" />
            </div>
            <div>
              <Typography variant="h4" className="!font-bold !bg-gradient-to-r !from-green-600 !to-teal-600 !bg-clip-text !text-transparent">
                Payment Receipts
              </Typography>
              <Typography variant="body2" className="!text-gray-600 !mt-1">
                Download or view your payment receipts
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Receipts Grid */}
        {receipts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-12 text-center border border-white/50"
          >
            <div className="text-6xl mb-4">📄</div>
            <Typography variant="h5" className="!font-bold !text-gray-800 !mb-2">
              No Receipts Available
            </Typography>
            <Typography className="!text-gray-600">
              Receipts will be generated after successful payments
            </Typography>
          </motion.div>
        ) : (
          <Grid container spacing={3}>
            {receipts.map((receipt, index) => (
              <Grid item xs={12} sm={6} md={4} key={receipt._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="!backdrop-blur-xl !bg-white/70 !rounded-3xl !shadow-xl !border !border-white/50 hover:!shadow-2xl !transition-all">
                    <CardContent className="!p-6">
                      {/* Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="bg-gradient-to-br from-green-500 to-teal-600 p-4 rounded-2xl">
                          <FontAwesomeIcon icon={faFileInvoice} className="text-white text-3xl" />
                        </div>
                      </div>

                      {/* Receipt Info */}
                      <Typography variant="h6" className="!font-bold !text-gray-800 !text-center !mb-2">
                        {receipt.feeType || "Fee Receipt"}
                      </Typography>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <Typography variant="caption" className="!text-gray-600">Amount:</Typography>
                          <Typography variant="caption" className="!font-bold !text-green-600">₹{receipt.amount}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="caption" className="!text-gray-600">Date:</Typography>
                          <Typography variant="caption" className="!text-gray-800">
                            {new Date(receipt.createdAt).toLocaleDateString()}
                          </Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="caption" className="!text-gray-600">Payment ID:</Typography>
                          <Typography variant="caption" className="!text-gray-800 !font-mono">
                            {receipt.paymentId?.substring(0, 12)}...
                          </Typography>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          fullWidth
                          variant="outlined"
                          size="small"
                          className="!border-green-600 !text-green-600 !rounded-xl"
                          startIcon={<FontAwesomeIcon icon={faEye} />}
                          onClick={() => viewReceipt(receipt)}
                        >
                          View
                        </Button>
                        <Button
                          fullWidth
                          variant="contained"
                          size="small"
                          className="!bg-gradient-to-r !from-green-600 !to-teal-600 !rounded-xl"
                          startIcon={<FontAwesomeIcon icon={faDownload} />}
                          onClick={() => downloadReceipt(receipt)}
                        >
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </div>
  );
}
