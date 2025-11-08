import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Switch,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faBell,
  faLock,
  faEnvelope,
  faMoon,
  faLanguage,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function Settings() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    darkMode: false,
    twoFactorAuth: false,
    language: "English",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
    setSnackbar({
      open: true,
      message: `${setting.replace(/([A-Z])/g, " $1").trim()} ${!settings[setting] ? "enabled" : "disabled"}`,
      severity: "success",
    });
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setSnackbar({ open: true, message: "Password must be at least 6 characters", severity: "error" });
      return;
    }
    // Here you would call your API to change password
    setSnackbar({ open: true, message: "Password changed successfully!", severity: "success" });
    setPasswordDialog(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const settingsSections = [
    {
      title: "Notifications",
      icon: faBell,
      color: "from-blue-600 to-cyan-600",
      items: [
        {
          key: "emailNotifications",
          label: "Email Notifications",
          description: "Receive payment confirmations and receipts via email",
        },
        {
          key: "smsNotifications",
          label: "SMS Notifications",
          description: "Get SMS alerts for important updates",
        },
        {
          key: "paymentReminders",
          label: "Payment Reminders",
          description: "Receive reminders for upcoming fee payments",
        },
      ],
    },
    {
      title: "Security",
      icon: faShieldAlt,
      color: "from-red-600 to-pink-600",
      items: [
        {
          key: "twoFactorAuth",
          label: "Two-Factor Authentication",
          description: "Add an extra layer of security to your account",
        },
      ],
    },
    {
      title: "Preferences",
      icon: faCog,
      color: "from-purple-600 to-indigo-600",
      items: [
        {
          key: "darkMode",
          label: "Dark Mode",
          description: "Switch to dark theme (Coming Soon)",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
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
              className="inline-block bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-2xl mb-4"
            >
              <FontAwesomeIcon icon={faCog} className="text-white text-4xl" />
            </motion.div>
            <Typography variant="h4" className="font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
              Settings
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Manage your account preferences and security
            </Typography>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Settings Sections */}
            {settingsSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
                  <CardContent className="!p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`bg-gradient-to-r ${section.color} p-3 rounded-xl`}>
                        <FontAwesomeIcon icon={section.icon} className="text-white text-xl" />
                      </div>
                      <Typography variant="h6" className="!font-bold !text-gray-800">
                        {section.title}
                      </Typography>
                    </div>

                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div key={item.key}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <Typography variant="body1" className="!font-semibold !text-gray-800">
                                {item.label}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {item.description}
                              </Typography>
                            </div>
                            <Switch
                              checked={settings[item.key]}
                              onChange={() => handleToggle(item.key)}
                              color="primary"
                            />
                          </div>
                          <Divider className="!mt-4" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100">
                <CardContent className="!p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                      <FontAwesomeIcon icon={faLock} className="text-white text-xl" />
                    </div>
                    <Typography variant="h6" className="!font-bold !text-gray-800">
                      Account Security
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setPasswordDialog(true)}
                      className="!border-2 !border-orange-600 !text-orange-600 !py-3 !rounded-xl !font-semibold hover:!bg-orange-50"
                      startIcon={<FontAwesomeIcon icon={faLock} />}
                    >
                      Change Password
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      className="!border-2 !border-blue-600 !text-blue-600 !py-3 !rounded-xl !font-semibold hover:!bg-blue-50"
                      startIcon={<FontAwesomeIcon icon={faEnvelope} />}
                    >
                      Update Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="!rounded-3xl !shadow-xl !border !border-gray-100 !bg-gradient-to-br !from-green-600 !to-emerald-600">
                <CardContent className="!p-6 !text-white">
                  <Typography variant="h6" className="!font-bold !mb-4">
                    💡 Need Help?
                  </Typography>
                  <ul className="space-y-2 text-sm">
                    <li>📧 Email: support@ofprs.edu</li>
                    <li>📞 Phone: +91 1234567890</li>
                    <li>🕐 Mon-Fri: 9:00 AM - 6:00 PM</li>
                    <li>📍 Visit Help Center for FAQs</li>
                  </ul>
                  <Button
                    variant="contained"
                    fullWidth
                    className="!bg-white !text-green-600 !py-2 !rounded-xl !font-semibold !mt-4 hover:!shadow-lg"
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Password Change Dialog */}
        <Dialog
          open={passwordDialog}
          onClose={() => setPasswordDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-2 rounded-lg">
                <FontAwesomeIcon icon={faLock} className="text-white" />
              </div>
              <Typography variant="h6" className="!font-bold">
                Change Password
              </Typography>
            </div>
          </DialogTitle>
          <DialogContent className="!pt-6">
            <div className="space-y-4">
              <TextField
                label="Current Password"
                type="password"
                fullWidth
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                fullWidth
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPasswordDialog(false)} className="!text-gray-600">
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="contained"
              className="!bg-gradient-to-r !from-orange-600 !to-red-600"
            >
              Change Password
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
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
