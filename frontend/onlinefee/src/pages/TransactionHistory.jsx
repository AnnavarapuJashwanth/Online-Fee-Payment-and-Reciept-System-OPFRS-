import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Button, Chip, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faDownload,
  faEye,
  faCheckCircle,
  faHourglassHalf,
  faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import { getAllTransactions } from "../services/transactionService";
import { downloadReceipt, viewReceipt } from "../utils/pdfGenerator";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "null");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions(user?.email);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />;
      case "pending":
        return <FontAwesomeIcon icon={faHourglassHalf} className="text-amber-600" />;
      default:
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "!bg-green-50 !text-green-700 !border-green-200";
      case "pending":
        return "!bg-amber-50 !text-amber-700 !border-amber-200";
      default:
        return "!bg-red-50 !text-red-700 !border-red-200";
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
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-2xl">
              <FontAwesomeIcon icon={faHistory} className="text-white text-3xl" />
            </div>
            <div>
              <Typography variant="h4" className="!font-bold !bg-gradient-to-r !from-blue-600 !to-purple-600 !bg-clip-text !text-transparent">
                Transaction History
              </Typography>
              <Typography variant="body2" className="!text-gray-600 !mt-1">
                View all your payment transactions
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-12 text-center border border-white/50"
          >
            <div className="text-6xl mb-4">📭</div>
            <Typography variant="h5" className="!font-bold !text-gray-800 !mb-2">
              No Transactions Yet
            </Typography>
            <Typography className="!text-gray-600">
              Your payment history will appear here once you make a payment
            </Typography>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="!backdrop-blur-xl !bg-white/70 !rounded-3xl !shadow-xl !border !border-white/50 hover:!shadow-2xl !transition-all">
                  <CardContent className="!p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      {/* Transaction Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusIcon(transaction.status)}
                          <Typography variant="h6" className="!font-bold !text-gray-800">
                            {transaction.feeType || "General Fee"}
                          </Typography>
                          <Chip
                            label={transaction.status.toUpperCase()}
                            size="small"
                            className={`!font-semibold !border ${getStatusColor(transaction.status)}`}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Typography variant="caption" className="!text-gray-600 !font-semibold">
                              Amount:
                            </Typography>
                            <Typography variant="body2" className="!font-bold !text-blue-600">
                              ₹{transaction.amount}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" className="!text-gray-600 !font-semibold">
                              Date:
                            </Typography>
                            <Typography variant="body2" className="!text-gray-800">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" className="!text-gray-600 !font-semibold">
                              Payment ID:
                            </Typography>
                            <Typography variant="body2" className="!text-gray-800 !font-mono !text-xs">
                              {transaction.paymentId || "N/A"}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="caption" className="!text-gray-600 !font-semibold">
                              Order ID:
                            </Typography>
                            <Typography variant="body2" className="!text-gray-800 !font-mono !text-xs">
                              {transaction.orderId?.substring(0, 20)}...
                            </Typography>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      {transaction.status === "paid" && (
                        <div className="flex gap-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              className="!border-blue-600 !text-blue-600 !rounded-xl"
                              startIcon={<FontAwesomeIcon icon={faEye} />}
                              onClick={() => viewReceipt(transaction)}
                            >
                              View
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="contained"
                              size="small"
                              className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !rounded-xl"
                              startIcon={<FontAwesomeIcon icon={faDownload} />}
                              onClick={() => downloadReceipt(transaction)}
                            >
                              Download
                            </Button>
                          </motion.div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
