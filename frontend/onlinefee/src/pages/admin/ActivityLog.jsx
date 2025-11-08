import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
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
  Avatar,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from "@mui/material";
import {
  Search,
  Refresh,
  Login,
  Logout,
  Payment,
  Edit,
  Delete,
  Add,
  Visibility,
  Assessment,
  TrendingUp,
} from "@mui/icons-material";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

const API_URL = "http://localhost:5000/api";

const actionIcons = {
  login: <Login className="!text-green-600" />,
  logout: <Logout className="!text-gray-600" />,
  payment: <Payment className="!text-blue-600" />,
  fee_created: <Add className="!text-purple-600" />,
  fee_updated: <Edit className="!text-orange-600" />,
  fee_deleted: <Delete className="!text-red-600" />,
  view: <Visibility className="!text-indigo-600" />,
};

export default function ActivityLog() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalActivities: 0,
    todayActivities: 0,
    todayLogins: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, [page, actionFilter, userTypeFilter]);

  const fetchActivities = async () => {
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
          page,
          limit: 20,
          action: actionFilter !== "all" ? actionFilter : undefined,
          userType: userTypeFilter !== "all" ? userTypeFilter : undefined,
          search: search || undefined,
        },
      };

      const response = await axios.get(`${API_URL}/admin/activity-log`, config);

      if (response.data.success) {
        setActivities(response.data.activities);
        setTotalPages(response.data.pagination.pages);
        
        const today = new Date().toDateString();
        const todayActivities = response.data.activities.filter((a) =>
          new Date(a.createdAt).toDateString() === today
        );
        const todayLogins = todayActivities.filter((a) => a.action === "login");
        
        setStats({
          totalActivities: response.data.pagination.total,
          todayActivities: todayActivities.length,
          todayLogins: todayLogins.length,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchActivities();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionColor = (action) => {
    const colors = {
      login: "success",
      logout: "default",
      payment: "info",
      fee_created: "secondary",
      fee_updated: "warning",
      fee_deleted: "error",
    };
    return colors[action] || "default";
  };

  return (
    <AdminLayout>
      <Box>
        {/* Header */}
        <Box className="flex justify-between items-center mb-6">
          <Box>
            <Typography variant="h4" className="!font-bold !text-gray-800 !mb-1">
              Activity Log
            </Typography>
            <Typography variant="body2" className="!text-gray-600">
              Track all system activities and user actions
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton
              className="!bg-purple-100 !text-purple-600"
              onClick={fetchActivities}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="mb-6">
          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-blue-500 !to-blue-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.totalActivities}
                  </Typography>
                  <Typography variant="body2">Total Activities</Typography>
                </Box>
                <Assessment className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-green-500 !to-green-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.todayActivities}
                  </Typography>
                  <Typography variant="body2">Today's Activities</Typography>
                </Box>
                <TrendingUp className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="!p-4 !bg-gradient-to-br !from-purple-500 !to-purple-600 !text-white">
              <Box className="flex items-center justify-between">
                <Box>
                  <Typography variant="h5" className="!font-bold">
                    {stats.todayLogins}
                  </Typography>
                  <Typography variant="body2">Today's Logins</Typography>
                </Box>
                <Login className="!text-5xl !opacity-50" />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Filters */}
        <Card className="!shadow-lg !mb-6">
          <CardContent>
            <Box className="flex flex-wrap gap-4 items-end">
              <TextField
                label="Search"
                placeholder="Search by user or description..."
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
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={actionFilter}
                  label="Action Type"
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All Actions</MenuItem>
                  <MenuItem value="login">Login</MenuItem>
                  <MenuItem value="logout">Logout</MenuItem>
                  <MenuItem value="payment">Payment</MenuItem>
                  <MenuItem value="fee_created">Fee Created</MenuItem>
                  <MenuItem value="fee_updated">Fee Updated</MenuItem>
                  <MenuItem value="fee_deleted">Fee Deleted</MenuItem>
                </Select>
              </FormControl>

              <FormControl className="!min-w-[150px]">
                <InputLabel>User Type</InputLabel>
                <Select
                  value={userTypeFilter}
                  label="User Type"
                  onChange={(e) => {
                    setUserTypeFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="student">Students</MenuItem>
                  <MenuItem value="admin">Admins</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Activity Table */}
        <Card className="!shadow-lg">
          <CardContent>
            {loading ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                Loading activities...
              </Typography>
            ) : activities.length === 0 ? (
              <Typography className="!text-center !py-8 !text-gray-500">
                No activities found
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow className="!bg-gray-50">
                        <TableCell className="!font-semibold">Time</TableCell>
                        <TableCell className="!font-semibold">User</TableCell>
                        <TableCell className="!font-semibold">Type</TableCell>
                        <TableCell className="!font-semibold">Action</TableCell>
                        <TableCell className="!font-semibold">Description</TableCell>
                        <TableCell className="!font-semibold">IP Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activities.map((activity) => (
                        <TableRow key={activity._id} className="hover:!bg-gray-50">
                          <TableCell className="!text-sm !text-gray-600">
                            {formatDate(activity.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Box className="flex items-center gap-2">
                              <Avatar className="!w-8 !h-8 !bg-purple-600 !text-xs">
                                {activity.userId?.name?.charAt(0) || "U"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" className="!font-medium">
                                  {activity.userId?.name || "Unknown User"}
                                </Typography>
                                <Typography variant="caption" className="!text-gray-500">
                                  {activity.userId?.regno || activity.userId?.email || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={activity.userType}
                              size="small"
                              className="!capitalize"
                              color={activity.userType === "admin" ? "secondary" : "primary"}
                            />
                          </TableCell>
                          <TableCell>
                            <Box className="flex items-center gap-2">
                              {actionIcons[activity.action] || actionIcons.view}
                              <Chip
                                label={activity.action.replace("_", " ")}
                                size="small"
                                color={getActionColor(activity.action)}
                                className="!capitalize"
                              />
                            </Box>
                          </TableCell>
                          <TableCell className="!text-sm">
                            {activity.description}
                          </TableCell>
                          <TableCell className="!text-xs !font-mono !text-gray-500">
                            {activity.ipAddress || "N/A"}
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
