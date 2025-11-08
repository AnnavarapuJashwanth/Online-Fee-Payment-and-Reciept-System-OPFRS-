import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Avatar,
  Card,
  CardContent,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCamera, faSave } from "@fortawesome/free-solid-svg-icons";
import api from "../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [profileData, setProfileData] = useState({
    name: "",
    regno: "",
    email: "",
    phone: "",
    year: "1st Year",
    semester: "1st Semester",
    branch: "Computer Science and Engineering",
    section: "A",
    category: "Category A",
    profilePhoto: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // First load from localStorage immediately
      const savedUser = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
      if (savedUser && savedUser.name) {
        setProfileData(prev => ({
          ...prev,
          name: savedUser.name || "",
          regno: savedUser.regno || "",
          email: savedUser.email || "",
          phone: savedUser.phone || "",
          year: savedUser.year || "1st Year",
          semester: savedUser.semester || "1st Semester",
          branch: savedUser.branch || "Computer Science and Engineering",
          section: savedUser.section || "A",
          category: savedUser.category || "Category A",
          profilePhoto: savedUser.profilePhoto || "",
        }));
      }

      // Then fetch from backend to get latest data
      const token = localStorage.getItem("ofprs_token");
      if (token) {
        const response = await api.get("/profile");
        if (response.data.success) {
          const userData = response.data.user;
          setProfileData({
            name: userData.name || "",
            regno: userData.regno || "",
            email: userData.email || "",
            phone: userData.phone || "",
            year: userData.year || "1st Year",
            semester: userData.semester || "1st Semester",
            branch: userData.branch || "Computer Science and Engineering",
            section: userData.section || "A",
            category: userData.category || "Category A",
            profilePhoto: userData.profilePhoto || "",
          });
          // Update localStorage with latest data
          localStorage.setItem("ofprs_user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 500KB to avoid localStorage quota issues)
      if (file.size > 500 * 1024) {
        setSnackbar({
          open: true,
          message: "Image size should be less than 500KB. Please compress your image.",
          severity: "error",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: "Please upload an image file",
          severity: "error",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        // Check if base64 string is too large for localStorage
        if (base64String.length > 400000) {
          setSnackbar({
            open: true,
            message: "Image is too large even after compression. Please use a smaller image (< 500KB).",
            severity: "error",
          });
          return;
        }
        
        setProfileData({ ...profileData, profilePhoto: base64String });
        setSnackbar({
          open: true,
          message: "Image uploaded! Click 'Update Profile' to save.",
          severity: "info",
        });
      };
      reader.onerror = () => {
        setSnackbar({
          open: true,
          message: "Failed to read image file",
          severity: "error",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("ofprs_token");
      
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to update profile",
          severity: "error",
        });
        setLoading(false);
        return;
      }

      console.log("Updating profile with data:", {
        ...profileData,
        profilePhoto: profileData.profilePhoto ? "Image data present" : "No image"
      });

      const response = await api.put("/profile", profileData);
      
      console.log("Profile update response:", response.data);
      
      if (response.data.success) {
        // Update state with returned data
        const updatedUserData = {
          name: response.data.user.name || "",
          regno: response.data.user.regno || "",
          email: response.data.user.email || "",
          phone: response.data.user.phone || "",
          year: response.data.user.year || "1st Year",
          semester: response.data.user.semester || "1st Semester",
          branch: response.data.user.branch || "Computer Science and Engineering",
          section: response.data.user.section || "A",
          category: response.data.user.category || "Category A",
          profilePhoto: response.data.user.profilePhoto || "",
        };
        
        setProfileData(updatedUserData);
        
        // Try to update localStorage, but handle quota errors
        try {
          localStorage.setItem("ofprs_user", JSON.stringify(response.data.user));
        } catch (storageError) {
          console.error("localStorage quota exceeded:", storageError);
          // If photo is too large, save without photo
          const userWithoutPhoto = { ...response.data.user, profilePhoto: "" };
          try {
            localStorage.setItem("ofprs_user", JSON.stringify(userWithoutPhoto));
            console.log("Saved user data without photo to localStorage");
          } catch (e) {
            console.error("Still failed to save to localStorage:", e);
          }
        }
        
        setSnackbar({ 
          open: true, 
          message: "Profile updated successfully! ✅", 
          severity: "success" 
        });
      }
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response?.data);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to update profile. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const branches = [
    "Computer Science and Engineering",
    "CSE - AI & ML",
    "CSE - Cyber Security",
    "CSE - Data Science",
    "CSE - IoT",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Chemical Engineering",
    "Agriculture Engineering",
    "Civil Engineering",
    "Textile Technology",
    "Biotechnology",
    "Bioinformatics",
    "Food Technology",
  ];

  const sections = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
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
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl mb-4"
            >
              <FontAwesomeIcon icon={faUser} className="text-white text-4xl" />
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              My Profile
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Update your personal and academic information
            </Typography>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Photo Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
                <CardContent className="!p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar
                      src={profileData.profilePhoto}
                      sx={{ width: 150, height: 150 }}
                      className="!border-4 !border-blue-500"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-400" />
                    </Avatar>
                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full cursor-pointer hover:shadow-lg transition-all">
                      <FontAwesomeIcon icon={faCamera} className="text-white" />
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <Typography variant="h6" className="!font-bold !text-gray-800 !mb-1">
                    {profileData.name || "Student Name"}
                  </Typography>
                  <Typography variant="body2" className="!text-gray-500 !mb-1">
                    {profileData.regno || "Registration Number"}
                  </Typography>
                  <Typography variant="caption" className="!text-gray-400">
                    {profileData.email || "Email Address"}
                  </Typography>

                  <Box className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                    <Typography variant="body2" className="!font-semibold !text-gray-700 !mb-2">
                      Academic Info
                    </Typography>
                    <div className="space-y-1 text-left">
                      <Typography variant="caption" className="!text-gray-600 block">
                        <strong>Year:</strong> {profileData.year}
                      </Typography>
                      <Typography variant="caption" className="!text-gray-600 block">
                        <strong>Semester:</strong> {profileData.semester}
                      </Typography>
                      <Typography variant="caption" className="!text-gray-600 block">
                        <strong>Section:</strong> {profileData.section}
                      </Typography>
                    </div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Profile Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2"
            >
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
                <CardContent className="!p-8">
                  <Typography variant="h6" className="!font-bold !text-gray-800 !mb-6">
                    Personal & Academic Details
                  </Typography>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Basic Details - Read Only */}
                      <TextField
                        label="Full Name"
                        value={profileData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        fullWidth
                        required
                      />
                      <TextField
                        label="Registration Number"
                        value={profileData.regno}
                        fullWidth
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Email Address"
                        value={profileData.email}
                        fullWidth
                        disabled
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <TextField
                        label="Phone Number"
                        value={profileData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        fullWidth
                        required
                      />

                      {/* Academic Details */}
                      <TextField
                        select
                        label="Year"
                        value={profileData.year}
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
                        value={profileData.semester}
                        onChange={(e) => handleChange("semester", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="1st Semester">1st Semester</MenuItem>
                        <MenuItem value="2nd Semester">2nd Semester</MenuItem>
                      </TextField>

                      <TextField
                        select
                        label="Branch"
                        value={profileData.branch}
                        onChange={(e) => handleChange("branch", e.target.value)}
                        fullWidth
                        required
                        className="md:col-span-2"
                      >
                        {branches.map((branch) => (
                          <MenuItem key={branch} value={branch}>
                            {branch}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Section"
                        value={profileData.section}
                        onChange={(e) => handleChange("section", e.target.value)}
                        fullWidth
                        required
                      >
                        {sections.map((section) => (
                          <MenuItem key={section} value={section}>
                            Section {section}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        select
                        label="Fee Category"
                        value={profileData.category}
                        onChange={(e) => handleChange("category", e.target.value)}
                        fullWidth
                        required
                      >
                        <MenuItem value="Category A">Category A</MenuItem>
                        <MenuItem value="Category B">Category B</MenuItem>
                      </TextField>
                    </div>

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !py-3 !rounded-xl !text-white !font-semibold !shadow-lg hover:!shadow-xl !transition-all !mt-6"
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FontAwesomeIcon icon={faSave} />}
                    >
                      {loading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

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
