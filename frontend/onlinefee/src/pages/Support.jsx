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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadset,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faChevronDown,
  faTicketAlt,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

export default function Support() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "Medium",
    description: "",
  });

  const categories = [
    "Payment Issue",
    "Technical Support",
    "Account Issue",
    "Fee Related",
    "Refund Query",
    "General Query",
    "Other",
  ];

  const priorities = ["Low", "Medium", "High", "Urgent"];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await api.get("/support/user");
      
      if (response.data.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.category || !formData.description) {
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
      const response = await api.post("/support", formData);

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Support ticket created successfully!",
          severity: "success",
        });
        setFormData({
          subject: "",
          category: "",
          priority: "Medium",
          description: "",
        });
        fetchTickets();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create ticket",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      "Open": "#ffd43b",
      "In Progress": "#339af0",
      "Resolved": "#51cf66",
      "Closed": "#868e96",
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
            <FontAwesomeIcon icon={faHeadset} className="text-white text-4xl" />
          </div>
          <Typography variant="h4" className="!font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Support & Help
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Get help with your queries and issues
          </Typography>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Contact Cards */}
          {[
            { icon: faEnvelope, title: "Email", value: "support@ofprs.edu", color: "from-blue-500 to-blue-600" },
            { icon: faPhone, title: "Phone", value: "+91 1234567890", color: "from-purple-500 to-purple-600" },
            { icon: faMapMarkerAlt, title: "Address", value: "College Campus, City", color: "from-pink-500 to-pink-600" },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="!rounded-2xl !shadow-lg hover:!shadow-xl transition-all">
                <CardContent className="!p-6 text-center">
                  <div className={`inline-block bg-gradient-to-r ${item.color} p-3 rounded-xl mb-3`}>
                    <FontAwesomeIcon icon={item.icon} className="text-white text-2xl" />
                  </div>
                  <Typography variant="subtitle2" className="!font-bold !text-gray-700 !mb-1">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="!text-gray-600">
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Ticket Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
              <CardContent className="!p-8">
                <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                  Create Support Ticket
                </Typography>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TextField
                    fullWidth
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    variant="outlined"
                    required
                  />

                  <TextField
                    fullWidth
                    select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    variant="outlined"
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    select
                    label="Priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    variant="outlined"
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    variant="outlined"
                    placeholder="Describe your issue in detail..."
                    required
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
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
                    {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Submit Ticket"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Tickets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
              <CardContent className="!p-8">
                <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                  My Tickets
                </Typography>

                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <FontAwesomeIcon icon={faTicketAlt} className="text-gray-300 text-5xl mb-4" />
                    <Typography variant="body2" className="text-gray-500">
                      No tickets yet
                    </Typography>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {tickets.map((ticket, index) => (
                      <Accordion key={ticket._id} className="!rounded-xl !shadow-sm">
                        <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                          <div className="flex items-center justify-between w-full pr-4">
                            <div>
                              <Typography variant="subtitle2" className="!font-bold">
                                {ticket.subject}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {ticket.ticketId}
                              </Typography>
                            </div>
                            <Chip
                              label={ticket.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(ticket.status),
                                color: "#fff",
                                fontWeight: "bold",
                              }}
                            />
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography variant="body2" className="!text-gray-600 !mb-2">
                            {ticket.description}
                          </Typography>
                          <Typography variant="caption" className="!text-gray-500">
                            Created: {new Date(ticket.createdAt).toLocaleString()}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
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
