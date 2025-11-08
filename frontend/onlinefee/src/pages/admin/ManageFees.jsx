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
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import {
  Search,
  Add,
  Close,
  Edit,
  Delete,
  MoneyOff,
} from "@mui/icons-material";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const API_URL = "http://localhost:5000/api";

const categories = [
  "Tuition",
  "Examination",
  "Library",
  "Laboratory",
  "Sports",
  "Transportation",
  "Hostel",
  "Miscellaneous",
];

export default function ManageFees() {
  const navigate = useNavigate();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    feeName: "",
    category: "",
    amount: "",
    lateFee: "",
    dueDate: "",
    status: "Active",
    description: "",
    applicableClasses: [],
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(`${API_URL}/admin/fees`, config);
      if (response.data.success) {
        setFees(response.data.fees || []);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching fees:", error);
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setFormData({
      feeName: "",
      category: "",
      amount: "",
      lateFee: "",
      dueDate: "",
      status: "Active",
      description: "",
      applicableClasses: [],
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClassChange = (year) => {
    const currentClasses = formData.applicableClasses;
    if (currentClasses.includes(year)) {
      setFormData({
        ...formData,
        applicableClasses: currentClasses.filter((c) => c !== year),
      });
    } else {
      setFormData({
        ...formData,
        applicableClasses: [...currentClasses, year],
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${API_URL}/admin/fees`,
        formData,
        config
      );

      if (response.data.success) {
        fetchFees();
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error creating fee:", error);
      alert(error.response?.data?.message || "Error creating fee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fee?")) return;

    try {
      const token = localStorage.getItem("admin_token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      await axios.delete(`${API_URL}/admin/fees/${id}`, config);
      fetchFees();
    } catch (error) {
      console.error("Error deleting fee:", error);
    }
  };

  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.feeName?.toLowerCase().includes(search.toLowerCase()) ||
      fee.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "All Categories" || fee.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="!font-bold !text-gray-800 !mb-1">
              Manage Fees
            </Typography>
            <Typography variant="body2" className="!text-gray-600">
              {fees.length} total fees • {fees.filter(f => f.status === "Active").length} active
            </Typography>
          </Box>
          <Button
            variant="contained"
            className="!bg-blue-600 !py-3 !px-6"
            startIcon={<Add />}
            onClick={handleOpenDialog}
          >
            Add New Fee
          </Button>
        </Box>

        {/* Search and Filter */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Box className="flex gap-4 items-center">
              <TextField
                placeholder="Search fees by name or category..."
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
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="All Categories">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Fees List */}
        <Card className="!shadow-lg">
          <CardContent>
            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                Loading fees...
              </Typography>
            ) : filteredFees.length === 0 ? (
              <Box className="text-center py-12">
                <MoneyOff className="!text-8xl !text-gray-300 !mb-4" />
                <Typography variant="h6" className="!text-gray-500 !mb-2">
                  No fees found
                </Typography>
                <Typography variant="body2" className="!text-gray-400 !mb-4">
                  Create your first fee to get started.
                </Typography>
                <Button
                  variant="contained"
                  className="!bg-blue-600"
                  startIcon={<Add />}
                  onClick={handleOpenDialog}
                >
                  Add New Fee
                </Button>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow className="!bg-gray-50">
                      <TableCell className="!font-semibold">Fee Name</TableCell>
                      <TableCell className="!font-semibold">Category</TableCell>
                      <TableCell className="!font-semibold">Amount</TableCell>
                      <TableCell className="!font-semibold">Late Fee</TableCell>
                      <TableCell className="!font-semibold">Due Date</TableCell>
                      <TableCell className="!font-semibold">Status</TableCell>
                      <TableCell className="!font-semibold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredFees.map((fee) => (
                      <TableRow key={fee._id} className="hover:!bg-gray-50">
                        <TableCell className="!font-medium">{fee.feeName}</TableCell>
                        <TableCell>
                          <Chip label={fee.category} size="small" className="!bg-purple-100 !text-purple-800" />
                        </TableCell>
                        <TableCell className="!font-semibold !text-green-600">
                          ₹{fee.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell className="!text-orange-600">
                          ₹{fee.lateFee?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell className="!text-sm">
                          {new Date(fee.dueDate).toLocaleDateString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={fee.status}
                            size="small"
                            color={fee.status === "Active" ? "success" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Box className="flex gap-2">
                            <IconButton size="small" className="!text-blue-600">
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              className="!text-red-600"
                              onClick={() => handleDelete(fee._id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Add Fee Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            className: "!bg-gray-900 !text-white",
          }}
        >
          <DialogTitle className="!flex !justify-between !items-center !bg-gray-900 !text-white">
            <Typography variant="h5" className="!font-bold !text-purple-400">
              Add New Fee
            </Typography>
            <IconButton onClick={handleCloseDialog} className="!text-white">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className="!bg-gray-900 !pt-6">
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                label="Fee Name *"
                name="feeName"
                value={formData.feeName}
                onChange={handleChange}
                placeholder="e.g., Tuition Fee"
                fullWidth
                required
                InputLabelProps={{ className: "!text-gray-400" }}
                InputProps={{ className: "!text-white !bg-gray-800" }}
              />
              <FormControl fullWidth required>
                <InputLabel className="!text-gray-400">Category *</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category *"
                  className="!text-white !bg-gray-800"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Amount (₹) *"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                fullWidth
                required
                InputLabelProps={{ className: "!text-gray-400" }}
                InputProps={{ className: "!text-white !bg-gray-800" }}
              />
              <TextField
                label="Due Date *"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true, className: "!text-gray-400" }}
                InputProps={{ className: "!text-white !bg-gray-800" }}
              />
              <TextField
                label="Late Fee (₹)"
                name="lateFee"
                type="number"
                value={formData.lateFee}
                onChange={handleChange}
                placeholder="0.00"
                fullWidth
                InputLabelProps={{ className: "!text-gray-400" }}
                InputProps={{ className: "!text-white !bg-gray-800" }}
              />
              <FormControl fullWidth>
                <InputLabel className="!text-gray-400">Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  className="!text-white !bg-gray-800"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of this fee..."
                fullWidth
                multiline
                rows={3}
                className="!col-span-2"
                InputLabelProps={{ className: "!text-gray-400" }}
                InputProps={{ className: "!text-white !bg-gray-800" }}
              />
            </Box>

            {/* Applicable Classes */}
            <Box className="mt-6">
              <Typography variant="body2" className="!text-gray-400 !mb-2">
                Applicable Classes
              </Typography>
              <FormGroup row>
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "All Classes"].map((year) => (
                  <FormControlLabel
                    key={year}
                    control={
                      <Checkbox
                        checked={formData.applicableClasses.includes(year)}
                        onChange={() => handleClassChange(year)}
                        className="!text-purple-400"
                      />
                    }
                    label={year}
                    className="!text-white"
                  />
                ))}
              </FormGroup>
            </Box>
          </DialogContent>
          <DialogActions className="!bg-gray-900 !p-4">
            <Button onClick={handleCloseDialog} className="!text-gray-400">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              className="!bg-purple-600"
              disabled={!formData.feeName || !formData.category || !formData.amount || !formData.dueDate}
            >
              Create Fee
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </AdminLayout>
  );
}
