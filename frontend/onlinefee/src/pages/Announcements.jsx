import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faExclamationCircle,
  faMoneyBillWave,
  faGraduationCap,
  faCalendarAlt,
  faFlag,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Announcements");
  const [error, setError] = useState("");

  const categories = [
    { name: "All Announcements", count: 0, color: "primary" },
    { name: "Unread", count: 0, color: "error" },
    { name: "High Priority", count: 0, color: "warning" },
    { name: "Fee Payment", count: 0, color: "success" },
    { name: "Examination", count: 0, color: "info" },
    { name: "Academic", count: 0, color: "secondary" },
  ];

  const eventCategories = [
    { name: "Event", count: 0, icon: faCalendarAlt },
    { name: "Holiday", count: 0, icon: faFlag },
    { name: "General", count: 0, icon: faBook },
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedCategory]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const params = selectedCategory !== "All Announcements" ? `?category=${selectedCategory}` : "";
      const response = await axios.get(`${API_URL}/announcements${params}`);
      
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Fee Payment": faMoneyBillWave,
      "Examination": faGraduationCap,
      "Academic": faBook,
      "High Priority": faExclamationCircle,
      "Event": faCalendarAlt,
      "Holiday": faFlag,
    };
    return icons[category] || faBullhorn;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "High Priority": "#ff6b6b",
      "Fee Payment": "#51cf66",
      "Examination": "#339af0",
      "Academic": "#845ef7",
      "Event": "#ffd43b",
      "Holiday": "#ff8787",
      "General": "#868e96",
      "Unread": "#fa5252",
    };
    return colors[category] || "#6c757d";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 py-8 px-4">
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <Typography variant="h4" className="!font-bold !text-white mb-2">
                Announcements
              </Typography>
              <Typography variant="body2" className="!text-purple-200">
                0 total • 0 unread
              </Typography>
            </div>
            <Typography variant="caption" className="!text-purple-300">
              Last updated: {new Date().toLocaleString()}
            </Typography>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={`${cat.name} ${cat.count}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  sx={{
                    backgroundColor: selectedCategory === cat.name ? "#fff" : "rgba(255,255,255,0.1)",
                    color: selectedCategory === cat.name ? "#6b46c1" : "#fff",
                    fontWeight: "bold",
                    border: selectedCategory === cat.name ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                    "&:hover": {
                      backgroundColor: selectedCategory === cat.name ? "#fff" : "rgba(255,255,255,0.2)",
                    },
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Event Categories */}
          <div className="flex flex-wrap gap-3">
            {eventCategories.map((cat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  icon={<FontAwesomeIcon icon={cat.icon} />}
                  label={`${cat.name} ${cat.count}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  sx={{
                    backgroundColor: selectedCategory === cat.name ? "#fff" : "rgba(255,255,255,0.1)",
                    color: selectedCategory === cat.name ? "#6b46c1" : "#fff",
                    fontWeight: "bold",
                    border: selectedCategory === cat.name ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                    "& .MuiChip-icon": {
                      color: selectedCategory === cat.name ? "#6b46c1" : "#fff",
                    },
                    "&:hover": {
                      backgroundColor: selectedCategory === cat.name ? "#fff" : "rgba(255,255,255,0.2)",
                    },
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress sx={{ color: "#fff" }} />
          </div>
        ) : error ? (
          <Alert severity="error" className="!bg-red-900 !text-white">
            {error}
          </Alert>
        ) : announcements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <FontAwesomeIcon
              icon={faBullhorn}
              className="text-purple-300 mb-4"
              size="4x"
            />
            <Typography variant="h6" className="!text-white !mb-2">
              No announcements found
            </Typography>
            <Typography variant="body2" className="!text-purple-300">
              Check back later for new announcements
            </Typography>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="!bg-white/10 !backdrop-blur-lg !border !border-white/20 hover:!bg-white/20 transition-all">
                    <CardContent>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: getCategoryColor(announcement.category) }}
                          >
                            <FontAwesomeIcon
                              icon={getCategoryIcon(announcement.category)}
                              className="text-white text-xl"
                            />
                          </div>
                          <div className="flex-1">
                            <Typography variant="h6" className="!text-white !font-bold !mb-2">
                              {announcement.title}
                            </Typography>
                            <Typography variant="body2" className="!text-purple-200 !mb-3">
                              {announcement.content}
                            </Typography>
                            <div className="flex items-center gap-2">
                              <Chip
                                label={announcement.category}
                                size="small"
                                sx={{
                                  backgroundColor: getCategoryColor(announcement.category),
                                  color: "#fff",
                                  fontWeight: "bold",
                                }}
                              />
                              <Typography variant="caption" className="!text-purple-300">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </Container>
    </div>
  );
}
