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
  Pagination,
  Grid,
} from "@mui/material";
import { Search, CheckCircle, Warning, Cancel, HourglassEmpty } from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function StudentStatus() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    fullyPaid: 0,
    partiallyPaid: 0,
    notStarted: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, [page, yearFilter]);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          limit: 20,
          year: yearFilter,
          search: search || undefined,
        },
      };

      const response = await api.get("/admin/students", config);
      
      if (response.data.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.pages);
        
        // Calculate stats
        const fullyPaid = response.data.students.filter(s => s.feeStatus === "Fully Paid").length;
        const partiallyPaid = response.data.students.filter(s => s.feeStatus === "Partially Paid").length;
        const notStarted = response.data.students.filter(s => s.feeStatus === "Not Started").length;
        const pending = response.data.students.filter(s => s.feeStatus === "Pending").length;
        
        setStats({
          fullyPaid,
          partiallyPaid,
          notStarted,
          overdue: pending,
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchStudents();
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Fully Paid":
        return <CheckCircle className="!text-green-500" />;
      case "Partially Paid":
        return <Warning className="!text-yellow-500" />;
      case "Pending":
        return <HourglassEmpty className="!text-orange-500" />;
      default:
        return <Cancel className="!text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Fully Paid":
        return "success";
      case "Partially Paid":
        return "warning";
      case "Pending":
        return "info";
      default:
        return "error";
    }
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            Student Status
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            Track student fee payment status
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-green-50 !border !border-green-200">
              <CardContent>
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="h4" className="!font-bold !text-green-700">
                      {stats.fullyPaid}
                    </Typography>
                    <Typography variant="body2" className="!text-green-600">
                      Fully Paid
                    </Typography>
                  </Box>
                  <CheckCircle className="!text-5xl !text-green-500" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-yellow-50 !border !border-yellow-200">
              <CardContent>
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="h4" className="!font-bold !text-yellow-700">
                      {stats.partiallyPaid}
                    </Typography>
                    <Typography variant="body2" className="!text-yellow-600">
                      Partially Paid
                    </Typography>
                  </Box>
                  <Warning className="!text-5xl !text-yellow-500" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-orange-50 !border !border-orange-200">
              <CardContent>
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="h4" className="!font-bold !text-orange-700">
                      {stats.notStarted}
                    </Typography>
                    <Typography variant="body2" className="!text-orange-600">
                      Not Started
                    </Typography>
                  </Box>
                  <HourglassEmpty className="!text-5xl !text-orange-500" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="!bg-red-50 !border !border-red-200">
              <CardContent>
                <Box className="flex items-center justify-between">
                  <Box>
                    <Typography variant="h4" className="!font-bold !text-red-700">
                      {stats.overdue}
                    </Typography>
                    <Typography variant="body2" className="!text-red-600">
                      Overdue
                    </Typography>
                  </Box>
                  <Cancel className="!text-5xl !text-red-500" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Box className="flex flex-wrap gap-4 items-end">
              <TextField
                label="Search"
                placeholder="Student name, reg no, or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="!flex-1 !min-w-[300px]"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl className="!min-w-[150px]">
                <InputLabel>Year</InputLabel>
                <Select
                  value={yearFilter}
                  label="Year"
                  onChange={(e) => {
                    setYearFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All Years</MenuItem>
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                className="!bg-purple-600 !py-3"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card className="!shadow-lg">
          <CardContent>
            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                Loading students...
              </Typography>
            ) : students.length === 0 ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                No students found
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className="!bg-gray-50">
                        <TableCell className="!font-semibold">Student</TableCell>
                        <TableCell className="!font-semibold">Reg No</TableCell>
                        <TableCell className="!font-semibold">Year</TableCell>
                        <TableCell className="!font-semibold">Total Paid</TableCell>
                        <TableCell className="!font-semibold">Pending</TableCell>
                        <TableCell className="!font-semibold">Status</TableCell>
                        <TableCell className="!font-semibold">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student._id} className="hover:!bg-gray-50">
                          <TableCell>
                            <Box>
                              <Typography className="!font-medium">
                                {student.name}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {student.email}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell className="!font-mono !text-sm">
                            {student.regno}
                          </TableCell>
                          <TableCell>{student.year}</TableCell>
                          <TableCell className="!font-semibold !text-green-600">
                            {formatCurrency(student.totalPaid || 0)}
                          </TableCell>
                          <TableCell className="!font-semibold !text-orange-600">
                            {formatCurrency(student.totalPending || 0)}
                          </TableCell>
                          <TableCell>
                            <Box className="flex items-center gap-2">
                              {getStatusIcon(student.feeStatus)}
                              <Chip
                                label={student.feeStatus}
                                size="small"
                                color={getStatusColor(student.feeStatus)}
                                className="!font-medium"
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              className="!text-purple-600 !border-purple-600"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <Box className="flex justify-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </AdminLayout>
  );
}
