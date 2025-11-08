import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Chip,
  Snackbar,
  Alert,
  Paper,
  Divider,
  IconButton,
} from "@mui/material";
import {
  School,
  AccountBalance,
  CloudUpload,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Delete,
} from "@mui/icons-material";
import api from "../services/api";

export default function ScholarshipsNew() {
  const user = JSON.parse(localStorage.getItem("ofprs_user") || "{}");
  const [loading, setLoading] = useState(false);
  const [scholarships, setScholarships] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [formData, setFormData] = useState({
    studentId: user.regno || "",
    fullName: user.name || "",
    scholarshipPerSem: "",
    scholarshipType: "",
    reasonForApplication: "",
    accountHolderName: "",
    bankAccountNumber: "",
    bankIFSCCode: "",
    bankName: "",
    bankBranch: "",
    mobileNumber: user.phone || "",
  });

  const [files, setFiles] = useState({
    admissionLetter: null,
    feePaymentChallan: null,
    bankDocument: null,
  });

  const scholarshipTypes = [
    "Merit-based",
    "Need-based",
    "Sports",
    "Cultural",
    "Research",
    "Other",
  ];

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const token = localStorage.getItem("ofprs_token");
      const response = await api.get("/scholarships/user");

      if (response.data.success) {
        setScholarships(response.data.scholarships);
      }
    } catch (error) {
      console.error("Error fetching scholarships:", error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles({ ...files, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.scholarshipPerSem ||
      !formData.scholarshipType ||
      !formData.reasonForApplication ||
      !formData.accountHolderName ||
      !formData.bankAccountNumber ||
      !formData.bankIFSCCode ||
      !formData.bankName ||
      !formData.bankBranch ||
      !formData.mobileNumber
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    if (!files.admissionLetter || !files.feePaymentChallan || !files.bankDocument) {
      setSnackbar({
        open: true,
        message: "Please upload all required documents",
        severity: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("ofprs_token");
      const payload = {
        ...formData,
        admissionLetterUrl: files.admissionLetter,
        feePaymentChallanUrl: files.feePaymentChallan,
        bankDocumentUrl: files.bankDocument,
      };

      const response = await api.post("/scholarships", payload);

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Scholarship application submitted successfully!",
          severity: "success",
        });
        
        // Reset form
        setFormData({
          studentId: user.regno || "",
          fullName: user.name || "",
          scholarshipPerSem: "",
          scholarshipType: "",
          reasonForApplication: "",
          accountHolderName: "",
          bankAccountNumber: "",
          bankIFSCCode: "",
          bankName: "",
          bankBranch: "",
          mobileNumber: user.phone || "",
        });
        setFiles({
          admissionLetter: null,
          feePaymentChallan: null,
          bankDocument: null,
        });
        
        fetchScholarships();
      }
    } catch (error) {
      console.error("Error submitting scholarship:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error submitting application",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="!text-green-500" />;
      case "Rejected":
        return <Cancel className="!text-red-500" />;
      case "Pending":
        return <HourglassEmpty className="!text-yellow-500" />;
      default:
        return <HourglassEmpty className="!text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      {/* Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
          <School className="!mr-2 !text-blue-600" />
          Scholarship Application
        </Typography>
        <Typography variant="body1" className="!text-gray-600">
          Apply for scholarships and track your applications
        </Typography>
      </Box>

      {/* Application Form */}
      <Card className="!shadow-lg !mb-6">
        <CardContent className="!p-6">
          <Typography variant="h6" className="!font-semibold !mb-4 !text-blue-600">
            New Scholarship Application
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Student Details */}
            <Box className="!mb-6">
              <Typography variant="subtitle1" className="!font-semibold !mb-3">
                Student Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name of the Student"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="VUID / Reg. No."
                    value={formData.studentId}
                    onChange={(e) => handleChange("studentId", e.target.value)}
                    required
                    disabled
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Scholarship per sem"
                    type="number"
                    value={formData.scholarshipPerSem}
                    onChange={(e) => handleChange("scholarshipPerSem", e.target.value)}
                    required
                    placeholder="e.g., 48000"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Scholarship Type"
                    value={formData.scholarshipType}
                    onChange={(e) => handleChange("scholarshipType", e.target.value)}
                    required
                  >
                    {scholarshipTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Reason for Application"
                    value={formData.reasonForApplication}
                    onChange={(e) => handleChange("reasonForApplication", e.target.value)}
                    required
                    placeholder="Explain why you are applying for this scholarship..."
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider className="!my-6" />

            {/* Bank Account Details */}
            <Box className="!mb-6">
              <Typography variant="subtitle1" className="!font-semibold !mb-3 !flex !items-center">
                <AccountBalance className="!mr-2 !text-green-600" />
                Bank A/c Details
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Account Holder Name"
                    value={formData.accountHolderName}
                    onChange={(e) => handleChange("accountHolderName", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank a/c number"
                    value={formData.bankAccountNumber}
                    onChange={(e) => handleChange("bankAccountNumber", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Bank IFSC code"
                    value={formData.bankIFSCCode}
                    onChange={(e) => handleChange("bankIFSCCode", e.target.value)}
                    required
                    placeholder="e.g., MAHB0000001"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name of the bank & Branch"
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    required
                    placeholder="e.g., COASTAL LOCAL AREA Bank, Repalle"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Branch"
                    value={formData.bankBranch}
                    onChange={(e) => handleChange("bankBranch", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile No."
                    value={formData.mobileNumber}
                    onChange={(e) => handleChange("mobileNumber", e.target.value)}
                    required
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider className="!my-6" />

            {/* Enclosures Mandatory */}
            <Box className="!mb-6">
              <Typography variant="subtitle1" className="!font-semibold !mb-3 !flex !items-center">
                <CloudUpload className="!mr-2 !text-purple-600" />
                Enclosures Mandatory
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper className="!p-4 !border-2 !border-dashed !border-gray-300 hover:!border-blue-500 !transition">
                    <Typography variant="body2" className="!mb-2 !font-medium">
                      Admission Letter Xerox
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange("admissionLetter", e)}
                      />
                    </Button>
                    {files.admissionLetter && (
                      <Chip
                        label="Uploaded"
                        color="success"
                        size="small"
                        className="!mt-2"
                        onDelete={() => setFiles({ ...files, admissionLetter: null })}
                      />
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper className="!p-4 !border-2 !border-dashed !border-gray-300 hover:!border-blue-500 !transition">
                    <Typography variant="body2" className="!mb-2 !font-medium">
                      Full Fee Payment Challan Xerox
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange("feePaymentChallan", e)}
                      />
                    </Button>
                    {files.feePaymentChallan && (
                      <Chip
                        label="Uploaded"
                        color="success"
                        size="small"
                        className="!mt-2"
                        onDelete={() => setFiles({ ...files, feePaymentChallan: null })}
                      />
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper className="!p-4 !border-2 !border-dashed !border-gray-300 hover:!border-blue-500 !transition">
                    <Typography variant="body2" className="!mb-2 !font-medium">
                      Bank Cheque / Passbook Colour Xerox
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      size="small"
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange("bankDocument", e)}
                      />
                    </Button>
                    {files.bankDocument && (
                      <Chip
                        label="Uploaded"
                        color="success"
                        size="small"
                        className="!mt-2"
                        onDelete={() => setFiles({ ...files, bankDocument: null })}
                      />
                    )}
                  </Paper>
                </Grid>
              </Grid>

              <Box className="!mt-4 !p-3 !bg-yellow-50 !border-l-4 !border-yellow-500">
                <Typography variant="body2" className="!text-gray-700">
                  <strong>Note:</strong>
                  <br />
                  1. Students should only apply Previous academic year with out any backlogs and 70% aggregate Marks (Not applicable for 1 year students)
                  <br />
                  2. Student should maintain one account number for all semesters
                  <br />
                  3. Application submission to Finance office, after 15-20 days amount credited your account
                </Typography>
              </Box>
            </Box>

            {/* Submit Button */}
            <Box className="!flex !justify-end !gap-3">
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                className="!bg-blue-600 hover:!bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Previous Applications */}
      <Card className="!shadow-lg">
        <CardContent className="!p-6">
          <Typography variant="h6" className="!font-semibold !mb-4">
            Your Applications
          </Typography>

          {scholarships.length === 0 ? (
            <Typography className="!text-center !py-8 !text-gray-500">
              No applications yet
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {scholarships.map((scholarship) => (
                <Grid item xs={12} md={6} key={scholarship._id}>
                  <Paper className="!p-4 !border !border-gray-200 hover:!shadow-md !transition">
                    <Box className="!flex !justify-between !items-start !mb-3">
                      <Box>
                        <Typography variant="subtitle1" className="!font-semibold">
                          {scholarship.scholarshipType}
                        </Typography>
                        <Typography variant="caption" className="!text-gray-500">
                          Applied: {new Date(scholarship.createdAt).toLocaleDateString("en-IN")}
                        </Typography>
                      </Box>
                      <Box className="!flex !items-center !gap-2">
                        {getStatusIcon(scholarship.status)}
                        <Chip
                          label={scholarship.status}
                          color={getStatusColor(scholarship.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" className="!text-gray-600 !mb-2">
                      Amount: ₹{scholarship.scholarshipPerSem?.toLocaleString("en-IN") || "N/A"} per sem
                    </Typography>
                    {scholarship.adminMessage && (
                      <Box className="!mt-3 !p-2 !bg-blue-50 !rounded">
                        <Typography variant="caption" className="!font-medium !text-blue-800">
                          Admin Message:
                        </Typography>
                        <Typography variant="body2" className="!text-gray-700">
                          {scholarship.adminMessage}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
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
  );
}
