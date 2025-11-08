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
} from "@mui/material";
import { Search, FileDownload } from "@mui/icons-material";
import api from "../../services/api";
import AdminLayout from "../../components/AdminLayout";

export default function AllPayments() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [page, statusFilter]);

  const fetchPayments = async () => {
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
          status: statusFilter,
          search: search || undefined,
        },
      };

      const response = await api.get("/admin/payments", config);
      
      if (response.data.success) {
        setPayments(response.data.payments);
        setTotalPages(response.data.pagination.pages);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching payments:", error);
      if (error.response?.status === 401) {
        navigate("/admin/login");
      }
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchPayments();
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const exportToCSV = () => {
    // Simple CSV export
    const csvContent = [
      ["Student", "Reg No", "Amount", "Payment ID", "Status", "Date"],
      ...payments.map((p) => [
        p.userId?.name || "N/A",
        p.userId?.regno || "N/A",
        p.amount,
        p.paymentId,
        p.status,
        new Date(p.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="mb-6">
          <Typography variant="h4" className="!font-bold !text-gray-800 !mb-2">
            All Payments
          </Typography>
          <Typography variant="body1" className="!text-gray-600">
            View and manage all student fee payments
          </Typography>
        </Box>

        {/* Filters */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Box className="flex flex-wrap gap-4 items-end">
              <TextField
                label="Search"
                placeholder="Student name, reg no, or payment ID"
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                className="!bg-purple-600 !py-3"
                onClick={handleSearch}
              >
                Search
              </Button>

              <Button
                variant="outlined"
                className="!border-green-600 !text-green-600 !py-3"
                startIcon={<FileDownload />}
                onClick={exportToCSV}
              >
                Export CSV
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="!shadow-lg">
          <CardContent>
            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                Loading payments...
              </Typography>
            ) : payments.length === 0 ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                No payments found
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className="!bg-gray-50">
                        <TableCell className="!font-semibold">Student</TableCell>
                        <TableCell className="!font-semibold">Reg No</TableCell>
                        <TableCell className="!font-semibold">Amount</TableCell>
                        <TableCell className="!font-semibold">Payment ID</TableCell>
                        <TableCell className="!font-semibold">Method</TableCell>
                        <TableCell className="!font-semibold">Status</TableCell>
                        <TableCell className="!font-semibold">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment._id} className="hover:!bg-gray-50">
                          <TableCell>
                            <Box>
                              <Typography className="!font-medium">
                                {payment.userId?.name || "N/A"}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {payment.userId?.email || ""}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell className="!font-mono !text-sm">
                            {payment.userId?.regno || "N/A"}
                          </TableCell>
                          <TableCell className="!font-semibold !text-green-600">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell className="!font-mono !text-xs">
                            {payment.paymentId || "N/A"}
                          </TableCell>
                          <TableCell className="!capitalize">
                            {payment.method || "Online"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={payment.status}
                              size="small"
                              color={getStatusColor(payment.status)}
                              className="!font-medium !capitalize"
                            />
                          </TableCell>
                          <TableCell className="!text-sm !text-gray-600">
                            {formatDate(payment.createdAt)}
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
