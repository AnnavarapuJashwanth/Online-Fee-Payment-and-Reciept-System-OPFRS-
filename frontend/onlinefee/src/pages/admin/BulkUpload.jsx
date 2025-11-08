import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  CloudUpload,
  Download,
  CheckCircle,
  Error,
  Warning,
} from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function BulkUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Upload CSV", "Validate Data", "Import Complete"];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setUploadResult(null);
      setActiveStep(0);
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    setActiveStep(1);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await api.post("/admin/bulk-upload", formData);

      if (response.data.success) {
        setUploadResult(response.data);
        setActiveStep(2);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadResult({
        success: false,
        message: error.response?.data?.message || "Upload failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `Student ID,Name,Email,Phone,Year,Semester,Branch,Section,Category
231FA04001,John Doe,john@example.com,9876543210,1st Year,1st Semester,Computer Science and Engineering,A,Category A
231FA04002,Jane Smith,jane@example.com,9876543211,1st Year,1st Semester,Computer Science and Engineering,A,Category A
231FA04003,Bob Johnson,bob@example.com,9876543212,2nd Year,3rd Semester,Electronics and Communication Engineering,B,Category B`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student_upload_sample.csv";
    a.click();
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Bulk Upload
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Upload student data in bulk using CSV files
          </Typography>
        </Box>

        {/* Stepper */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Typography variant="h6" className="!font-semibold !mb-4">
              Instructions
            </Typography>
            <Box className="space-y-2">
              <Typography variant="body2" className="!text-gray-700">
                1. Download the sample CSV template to see the required format
              </Typography>
              <Typography variant="body2" className="!text-gray-700">
                2. Fill in your student data following the same format
              </Typography>
              <Typography variant="body2" className="!text-gray-700">
                3. Upload the CSV file using the upload button below
              </Typography>
              <Typography variant="body2" className="!text-gray-700">
                4. Review the validation results and confirm the import
              </Typography>
            </Box>
            <Button
              variant="outlined"
              className="!mt-4 !border-blue-600 !text-blue-600"
              startIcon={<Download />}
              onClick={downloadSampleCSV}
            >
              Download Sample CSV
            </Button>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Typography variant="h6" className="!font-semibold !mb-4">
              Upload CSV File
            </Typography>

            <Paper
              className="!p-8 !border-2 !border-dashed !border-gray-300 !bg-gray-50 !text-center !cursor-pointer hover:!border-purple-500 !transition-all"
              onClick={() => document.getElementById("csv-upload").click()}
            >
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <CloudUpload className="!text-6xl !text-gray-400 !mb-4" />
              <Typography variant="h6" className="!text-gray-700 !mb-2">
                {file ? file.name : "Click to browse or drag and drop"}
              </Typography>
              <Typography variant="body2" className="!text-gray-500">
                CSV files only (Max 5MB)
              </Typography>
            </Paper>

            {file && (
              <Box className="mt-4">
                <Alert severity="info" className="!mb-4">
                  File selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  className="!bg-gradient-to-r !from-purple-600 !to-indigo-600 !py-3"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload and Process"}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Upload Results */}
        {uploadResult && (
          <Card className="!shadow-lg">
            <CardContent>
              <Typography variant="h6" className="!font-semibold !mb-4">
                Upload Results
              </Typography>

              {uploadResult.success ? (
                <>
                  <Alert severity="success" icon={<CheckCircle />} className="!mb-4">
                    Upload completed successfully!
                  </Alert>

                  <Box className="grid grid-cols-3 gap-4 mb-6">
                    <Paper className="!p-4 !bg-green-50">
                      <Typography variant="h4" className="!font-bold !text-green-700">
                        {uploadResult.imported || 0}
                      </Typography>
                      <Typography variant="body2" className="!text-green-600">
                        Successfully Imported
                      </Typography>
                    </Paper>

                    <Paper className="!p-4 !bg-yellow-50">
                      <Typography variant="h4" className="!font-bold !text-yellow-700">
                        {uploadResult.skipped || 0}
                      </Typography>
                      <Typography variant="body2" className="!text-yellow-600">
                        Skipped (Duplicates)
                      </Typography>
                    </Paper>

                    <Paper className="!p-4 !bg-red-50">
                      <Typography variant="h4" className="!font-bold !text-red-700">
                        {uploadResult.errors || 0}
                      </Typography>
                      <Typography variant="body2" className="!text-red-600">
                        Errors
                      </Typography>
                    </Paper>
                  </Box>

                  {uploadResult.details && uploadResult.details.length > 0 && (
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow className="!bg-gray-50">
                            <TableCell className="!font-semibold">Row</TableCell>
                            <TableCell className="!font-semibold">Student ID</TableCell>
                            <TableCell className="!font-semibold">Name</TableCell>
                            <TableCell className="!font-semibold">Status</TableCell>
                            <TableCell className="!font-semibold">Message</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {uploadResult.details.map((detail, index) => (
                            <TableRow key={index}>
                              <TableCell>{detail.row}</TableCell>
                              <TableCell className="!font-mono">{detail.studentId}</TableCell>
                              <TableCell>{detail.name}</TableCell>
                              <TableCell>
                                <Chip
                                  label={detail.status}
                                  size="small"
                                  color={
                                    detail.status === "success"
                                      ? "success"
                                      : detail.status === "skipped"
                                      ? "warning"
                                      : "error"
                                  }
                                />
                              </TableCell>
                              <TableCell className="!text-sm">{detail.message}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </>
              ) : (
                <Alert severity="error" icon={<Error />}>
                  {uploadResult.message || "Upload failed. Please check your file and try again."}
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </AdminLayout>
  );
}
