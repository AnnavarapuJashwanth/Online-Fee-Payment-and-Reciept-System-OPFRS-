import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Search,
  Visibility,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Close,
  FileDownload,
} from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function AdminScholarships() {
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminMessage, setAdminMessage] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchScholarships();
  }, [statusFilter, pagination.page]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [statusFilter]);

  const fetchScholarships = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: pagination.page,
          limit: pagination.limit,
        },
        timeout: 8000, // 8 second timeout
      };

      console.log("📚 Fetching scholarships...");
      console.log("Token:", token ? "Present" : "Missing");
      console.log("API URL:", "/admin/scholarships");
      
      const response = await api.get("/admin/scholarships");

      if (response.data.success) {
        console.log(`✅ Loaded ${response.data.scholarships?.length || 0} scholarships`);
        setScholarships(response.data.scholarships || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
        setError(null);
        setRetryCount(0);
      } else {
        // Handle API returning success: false
        setError(response.data.message || "Failed to load scholarships");
        setScholarships([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching scholarships:", error);
      
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login");
        return;
      }
      
      // Handle timeout errors with retry mechanism
      if (error.code === 'ECONNABORTED' && retryCount < 2) {
        console.log(`🔄 Retrying... Attempt ${retryCount + 1}/3`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          fetchScholarships();
        }, 2000); // Wait 2 seconds before retry
        return;
      }
      
      // Set error state instead of alert
      const errorMessage = error.code === 'ECONNABORTED' 
        ? "Request timed out. The server might be busy. Please try again later."
        : error.response?.data?.message || error.message || "Failed to load scholarships";
      
      setError(errorMessage);
      setScholarships([]);
      setLoading(false);
    }
  };

  const handleViewDetails = (scholarship) => {
    setSelectedScholarship(scholarship);
    setAdminMessage("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedScholarship(null);
    setAdminMessage("");
  };

  const handleApprove = async () => {
    if (!selectedScholarship) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await api.put(
        `/admin/scholarships/${selectedScholarship._id}/approve`,
        { adminMessage }
      );

      if (response.data.success) {
        fetchScholarships();
        handleCloseDialog();
        alert("Scholarship approved successfully! Email sent to student.");
      }
    } catch (error) {
      console.error("Error approving scholarship:", error);
      alert(error.response?.data?.message || "Failed to approve scholarship");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedScholarship || !adminMessage) {
      alert("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await api.put(
        `/admin/scholarships/${selectedScholarship._id}/reject`,
        { adminMessage }
      );

      if (response.data.success) {
        fetchScholarships();
        handleCloseDialog();
        alert("Scholarship rejected and email sent to student!");
      }
    } catch (error) {
      console.error("Error rejecting scholarship:", error);
      alert(error.response?.data?.message || "Failed to reject scholarship");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDocument = (base64Data, fileName) => {
    if (!base64Data) {
      alert("Document not available");
      return;
    }

    try {
      // Check if it's a base64 string
      if (base64Data.startsWith("data:")) {
        // Open base64 in new tab
        const newWindow = window.open();
        newWindow.document.write(`
          <html>
            <head><title>${fileName}</title></head>
            <body style="margin:0">
              <iframe src="${base64Data}" style="width:100%;height:100vh;border:none"></iframe>
            </body>
          </html>
        `);
      } else {
        // If it's a URL, open directly
        window.open(base64Data, "_blank");
      }
    } catch (error) {
      console.error("Error viewing document:", error);
      alert("Failed to open document");
    }
  };

  const handleDownloadDocument = (base64Data, fileName) => {
    if (!base64Data) {
      alert("Document not available");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = base64Data;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading document:", error);
      alert("Failed to download document");
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      scholarship.userId?.regno?.toLowerCase().includes(search.toLowerCase()) ||
      scholarship.scholarshipType?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="!text-green-500" />;
      case "Rejected":
        return <Cancel className="!text-red-500" />;
      default:
        return <HourglassEmpty className="!text-orange-500" />;
    }
  };

  const stats = {
    total: scholarships.length,
    pending: scholarships.filter((s) => s.status === "Pending").length,
    approved: scholarships.filter((s) => s.status === "Approved").length,
    rejected: scholarships.filter((s) => s.status === "Rejected").length,
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Scholarship Applications
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Review and manage student scholarship applications
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="!p-4 !bg-blue-50">
              <Typography variant="h4" className="!font-bold !text-blue-700">
                {stats.total}
              </Typography>
              <Typography variant="body2" className="!text-blue-600">
                Total Applications
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className="!p-4 !bg-orange-50">
              <Typography variant="h4" className="!font-bold !text-orange-700">
                {stats.pending}
              </Typography>
              <Typography variant="body2" className="!text-orange-600">
                Pending Review
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className="!p-4 !bg-green-50">
              <Typography variant="h4" className="!font-bold !text-green-700">
                {stats.approved}
              </Typography>
              <Typography variant="body2" className="!text-green-600">
                Approved
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper className="!p-4 !bg-red-50">
              <Typography variant="h4" className="!font-bold !text-red-700">
                {stats.rejected}
              </Typography>
              <Typography variant="body2" className="!text-red-600">
                Rejected
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Search and Filter */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Box className="flex gap-4 items-center">
              <TextField
                placeholder="Search by name, reg no, or scholarship type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="!flex-1"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl className="!min-w-[200px]">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Scholarships Table */}
        <Card className="!shadow-lg">
          <CardContent>
            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                {retryCount > 0 ? `Loading scholarships... (Retry ${retryCount}/3)` : "Loading scholarships..."}
              </Typography>
            ) : error ? (
              <Box className="!text-center !py-8">
                <Typography className="!text-red-600 !mb-4">
                  {error}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setError(null);
                    setRetryCount(0);
                    fetchScholarships();
                  }}
                  className="!bg-blue-600"
                >
                  Try Again
                </Button>
              </Box>
            ) : filteredScholarships.length === 0 ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                No scholarship applications found
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="!bg-gray-50">
                      <TableCell className="!font-semibold">Student Name</TableCell>
                      <TableCell className="!font-semibold">Reg No</TableCell>
                      <TableCell className="!font-semibold">Scholarship</TableCell>
                      <TableCell className="!font-semibold">Submitted</TableCell>
                      <TableCell className="!font-semibold">Status</TableCell>
                      <TableCell className="!font-semibold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredScholarships.map((scholarship) => (
                      <TableRow key={scholarship._id} className="hover:!bg-gray-50">
                        <TableCell className="!font-medium">
                          {scholarship.userId?.name || "N/A"}
                        </TableCell>
                        <TableCell className="!font-mono !text-sm">
                          {scholarship.userId?.regno || "N/A"}
                        </TableCell>
                        <TableCell>{scholarship.scholarshipType}</TableCell>
                        <TableCell className="!text-sm">
                          {new Date(scholarship.createdAt).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            {getStatusIcon(scholarship.status)}
                            <Chip
                              label={scholarship.status}
                              size="small"
                              color={getStatusColor(scholarship.status)}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box className="flex gap-2">
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() => handleViewDetails(scholarship)}
                            >
                              View Doc
                            </Button>
                            {scholarship.status === "Pending" && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  className="!bg-green-600"
                                  onClick={() => handleViewDetails(scholarship)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  className="!bg-red-600"
                                  onClick={() => handleViewDetails(scholarship)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <Box className="flex justify-between items-center mt-4 p-4 border-t">
                <Typography variant="body2" className="text-gray-600">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} scholarships
                </Typography>
                <Box className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <Typography variant="body2" className="flex items-center px-3">
                    Page {pagination.page} of {pagination.pages}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle className="!flex !justify-between !items-center">
            <Typography variant="h6" className="!font-semibold">
              Scholarship Application Details
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedScholarship && (
              <Box className="space-y-4">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Student Name
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.userId?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Registration No
                    </Typography>
                    <Typography variant="body1" className="!font-medium !font-mono">
                      {selectedScholarship.userId?.regno}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Scholarship Type
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.scholarshipType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Status
                    </Typography>
                    <Chip
                      label={selectedScholarship.status}
                      color={getStatusColor(selectedScholarship.status)}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" className="!text-gray-600 !mb-1">
                      Scholarship per sem
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      ₹{selectedScholarship.scholarshipPerSem?.toLocaleString("en-IN") || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" className="!text-gray-600 !mb-1">
                      Reason for Application
                    </Typography>
                    <Typography variant="body1">
                      {selectedScholarship.reasonForApplication}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider className="!my-3" />

                <Typography variant="subtitle1" className="!font-semibold !mb-2 !text-green-700">
                  Bank Account Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Account Holder
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.accountHolderName || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Account Number
                    </Typography>
                    <Typography variant="body1" className="!font-medium !font-mono">
                      {selectedScholarship.bankAccountNumber || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      IFSC Code
                    </Typography>
                    <Typography variant="body1" className="!font-medium !font-mono">
                      {selectedScholarship.bankIFSCCode || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Bank Name
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.bankName || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Branch
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.bankBranch || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" className="!text-gray-600">
                      Mobile Number
                    </Typography>
                    <Typography variant="body1" className="!font-medium">
                      {selectedScholarship.mobileNumber || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider className="!my-3" />

                <Typography variant="subtitle1" className="!font-semibold !mb-2 !text-purple-700">
                  Documents
                </Typography>
                <Box>
                  {selectedScholarship.admissionLetterUrl && (
                    <Box className="!inline-block !mr-2 !mb-2">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Visibility />}
                        className="!mr-1"
                        onClick={() => handleViewDocument(selectedScholarship.admissionLetterUrl, "Admission_Letter.pdf")}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<FileDownload />}
                        onClick={() => handleDownloadDocument(selectedScholarship.admissionLetterUrl, "Admission_Letter.pdf")}
                      >
                        Admission Letter
                      </Button>
                    </Box>
                  )}
                  {selectedScholarship.feePaymentChallanUrl && (
                    <Box className="!inline-block !mr-2 !mb-2">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Visibility />}
                        className="!mr-1"
                        onClick={() => handleViewDocument(selectedScholarship.feePaymentChallanUrl, "Fee_Payment_Challan.pdf")}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<FileDownload />}
                        onClick={() => handleDownloadDocument(selectedScholarship.feePaymentChallanUrl, "Fee_Payment_Challan.pdf")}
                      >
                        Fee Challan
                      </Button>
                    </Box>
                  )}
                  {selectedScholarship.bankDocumentUrl && (
                    <Box className="!inline-block !mr-2 !mb-2">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<Visibility />}
                        className="!mr-1"
                        onClick={() => handleViewDocument(selectedScholarship.bankDocumentUrl, "Bank_Document.pdf")}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={<FileDownload />}
                        onClick={() => handleDownloadDocument(selectedScholarship.bankDocumentUrl, "Bank_Document.pdf")}
                      >
                        Bank Document
                      </Button>
                    </Box>
                  )}
                  {!selectedScholarship.admissionLetterUrl && !selectedScholarship.feePaymentChallanUrl && !selectedScholarship.bankDocumentUrl && (
                    <Typography variant="body2" className="!text-gray-500 !italic">
                      No documents uploaded
                    </Typography>
                  )}
                </Box>

                <Divider className="!my-3" />

                {selectedScholarship.status === "Pending" && (
                  <TextField
                    fullWidth
                    label="Admin Message (Optional for approval, Required for rejection)"
                    multiline
                    rows={3}
                    value={adminMessage}
                    onChange={(e) => setAdminMessage(e.target.value)}
                    placeholder="Enter your message to the student..."
                  />
                )}

                {selectedScholarship.adminMessage && (
                  <Box className="!bg-gray-100 !p-4 !rounded">
                    <Typography variant="body2" className="!text-gray-600 !mb-1">
                      Admin Message
                    </Typography>
                    <Typography variant="body1">{selectedScholarship.adminMessage}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions className="!p-4">
            <Button onClick={handleCloseDialog}>Close</Button>
            {selectedScholarship?.status === "Pending" && (
              <>
                <Button
                  variant="contained"
                  className="!bg-red-600"
                  onClick={handleReject}
                  disabled={actionLoading}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  className="!bg-green-600"
                  onClick={handleApprove}
                  disabled={actionLoading}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
