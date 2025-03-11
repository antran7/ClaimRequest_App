import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  searchUsers,
  createUser,
  updateUser,
  changeUserStatus,
  fetchUser,
  deleteUser,
  changeUserRole,
  getEmployeeById,
  updateEmployee,
} from "../services/userService";
import Layout from "../../../shared/layouts/Layout";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import { User, Employee } from "../types/user";
import { Pagination } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Pencil, CircleX, Plus, Search, Lock, Unlock, Eye } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupOpen2, setPopupOpen2] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pageNum, setPageNum] = useState(1); //  Track current page
  const [pageSize] = useState(5); //  Items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [viewUser, setViewUser] = useState<User | null>(null); //View detail
  const [userId, setUserId] = useState("");
  const [employeeData, setEmployeeData] = useState<Employee>({
    _id: "",
    user_id: "",
    job_rank: "",
    contract_type: "",
    address: "",
    phone: "",
    full_name: "",
    avatar_url: "",
    department_code: "",
    salary: 0,
    start_date: "",
    end_date: "",
    updated_by: "",
    created_at: "",
    updated_at: "",
    is_deleted: false,
  });

  const roleMap: Record<string, string> = {
    A001: "Admin",
    A002: "Finance",
    A003: "Approval",
    A004: "Member",
  };

  const [form, setForm] = useState<{
    email: string;
    user_name: string;
    role_code: string;
    password?: string;
    confirmPassword?: "",
  }>({
    email: "",
    user_name: "",
    role_code: "A001",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
  let newErrors = {};

  if (!form.email.trim()) newErrors.email = "Email is required";
  if (!form.user_name.trim()) newErrors.user_name = "Username is required";
  if (!editingUser && !form.password.trim()) newErrors.password = "Password is required";
  if (!editingUser && form.password !== form.confirmPassword)
    newErrors.confirmPassword = "Passwords do not match";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Returns true if no errors
};
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    user: User | null;
    action: "delete" | "block" | null;
  }>({
    open: false,
    user: null,
    action: null,
  });
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(
        { keyword: searchTerm.trim() },
        { pageNum, pageSize }
      );
      console.log("Users type check:", Array.isArray(response.pageData)); // Should be true
      console.log("Parsed Users:", response.pageData); //  Debug users
      if (response?.pageData && response?.pageInfo) {
        setUsers(response.pageData); //  Correctly setting users
        setTotalPages(response.pageInfo.totalPages || 1); //  Fix pagination
      } else {
        toast.error("Invalid API response structure:", response);
        setUsers([]); // 🛠 Prevent crashes
      }
    } catch (error) {
      toast.error("Failed to fetch users", error);
      setUsers([]); // 🛠 Prevent UI crash
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (!validateForm()) return;
      if (editingUser) {
        // Check if role changed
        if (editingUser.role_code !== form.role_code) {
          await changeUserRole(editingUser._id, form.role_code);
        }

        // Updating an existing user
        await updateUser(editingUser._id, {
          email: form.email,
          user_name: form.user_name,
        });
      } else {
        // Creating a new user
        await createUser({
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
          password: form.password, // Password required for new user
        });
      }

      setPopupOpen(false); // Close popup after saving
      fetchUsers(); // Refresh the user list
    } catch (error) {
      toast.error("Failed to save user", error);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.user || !confirmDialog.action) return;
    try {
      if (confirmDialog.action === "block") {
        await changeUserStatus(
          confirmDialog.user._id,
          !confirmDialog.user.is_blocked
        );
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === confirmDialog.user!._id
              ? { ...u, is_blocked: !confirmDialog.user!.is_blocked }
              : u
          )
        );
      } else if (confirmDialog.action === "delete") {
        await deleteUser(confirmDialog.user._id);
        fetchUsers();
      }
    } catch (error) {
      toast.error(`Failed to ${confirmDialog.action} user`, error);
    } finally {
      setConfirmDialog({ open: false, user: null, action: null });
    }
  };

  const handleOpenEmployeeDetails = async (id: string) => {
    console.log("Fetching details for User ID:", id);

  if (!id) {
    toast.error("Invalid User ID");
    console.error("Invalid User ID: ID is missing");
    return; 
  }

    try {
      const response = await getEmployeeById(id);

      console.log("API Raw Response:", response);

      // Ensure response.data is correctly accessed
      const employee = response.data?.data ?? response.data ?? response;

      console.log("Fixed Response Data:", employee);

      if (!employee || Object.keys(employee).length === 0) {
        throw new Error("No employee data found");
      }

      // Ensure all fields exist in state
      setEmployeeData({
        _id: employee._id ?? "",
        user_id: employee.user_id ?? "",
        job_rank: employee.job_rank ?? "",
        contract_type: employee.contract_type ?? "",
        address: employee.address ?? "",
        avatar_url: employee.avatar_url ?? "",
        department_code: employee.department_code ?? "",
        end_date: employee.end_date ?? "",
        full_name: employee.full_name ?? "",
        is_deleted: employee.is_deleted ?? false,
        phone: employee.phone ?? "",
        salary: employee.salary ?? 0,
        start_date: employee.start_date ?? "",
      });
      setPopupOpen2(true);
    } catch (error) {
      console.error("Error fetching employee details:", error);
      toast.error(error.message || "Error fetching employee details");
    }
  };


  const handleSaveEmployeeDetails = async () => {
    try {
      if (!employeeData.created_at) {
        console.error("Error: created_at is missing!");
        return;
      }

      const updatedEmployeeData = {
        ...employeeData,
        created_at: new Date(employeeData.created_at), // Ensure it's a Date
        updated_at: new Date(),
      };

      console.log(
        "Sending to API:",
        JSON.stringify(updatedEmployeeData, null, 2)
      );

      await updateEmployee(userId, updatedEmployeeData);
      setPopupOpen2(false);
    } catch (error) {
      console.error("Error updating employee details:", error);
      toast.error("Error updating employee details");
    }
  };

  const handleRoleChange = async (userId: string, newRoleCode: string) => {
    if (!userId) return;
=======
  
 const handleSaveEmployeeDetails = async () => {
  try {

    const updatedEmployeeData = {
      ...employeeData,
    };


    const userToUpdate = users.find((u) => u._id === userId);
    if (!userToUpdate || userToUpdate.role_code === newRoleCode) return;

    try {
      await changeUserRole(userId, newRoleCode);

      // Cập nhật state để UI phản ánh ngay lập tức
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role_code: newRoleCode } : user
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);
    }
  };

  return (
    <Layout>
      <h1
        className="text-6xl p-4 font-mono bold "
        style={{ backgroundColor: "#90E0EF" }}
      >
        USER MANAGEMENT
      </h1>
      <div className="p-4 " style={{ backgroundColor: "#90E0EF" }}>
        <div className="flex justify-end items-center gap-4 mb-4">
          <div className="w-[250px] min-w-[150px] ">
            <div className="relative">
              <TextField
                label="Search by Username...."
                fullWidth
                margin="dense"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                variant="filled"
                style={{
                  border: "100px !important ",
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              />
              <Search className="absolute right-3 top-4" />
            </div>
          </div>
          <Dialog
            open={popupOpen}
            onClose={() => setPopupOpen(false)}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "12px",
                padding: "20px",
                width: "500px",
              },
            }}
          >
            <DialogTitle>
              <Typography variant="h6" fontWeight="bold" fontSize="27px">
                {editingUser ? "Edit User" : "Create  new user"}
              </Typography>
            </DialogTitle>

            <DialogContent>
              {/* Email Field */}
              Email
              <TextField
                type="email"
                fullWidth
                margin="dense"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  backgroundColor: "#E3F2FD",
                  borderRadius: "6px",
                  color: "gray",
                }}
              />
              {/* Username Field */}
              Username
              <TextField
                fullWidth
                margin="dense"
                value={form.user_name}
                onChange={(e) =>
                  setForm({ ...form, user_name: e.target.value })
                }
                error={!!errors.user_name}
                helperText={errors.user_name}
                sx={{
                  backgroundColor: "#E3F2FD",
                  borderRadius: "6px",
                  color: "gray",
                }}
              />
              {/* Role Dropdown */}
              Role
              <TextField
                select
                fullWidth
                margin="dense"
                value={form.role_code}
                onChange={(e) =>
                  setForm({ ...form, role_code: e.target.value })
                }
                sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" }}
              >
                <MenuItem value="A001">Admin</MenuItem>
                <MenuItem value="A002"> Finance</MenuItem>
                <MenuItem value="A003">Approval</MenuItem>
                <MenuItem value="A004">Member</MenuItem>
              </TextField>
              {/* Password Field (ONLY for Adding New User) */}
              <span style={{ visibility: editingUser ? "hidden" : "visible" }}>
                Password
              </span>
              {!editingUser && (
                <TextField
                  fullWidth
                  margin="dense"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  error={!!errors.password}
                  helperText={errors.password}
                  sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" }}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              )}
               {/* Confirm Password Field */}
                  Confirm Password
                  <TextField
                    fullWidth
                    margin="dense"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" }}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />

            </DialogContent>

            <DialogActions>
              <Button onClick={() => setPopupOpen(false)} color="error">
                Cancel
              </Button>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={Boolean(viewUser)}
            onClose={() => setViewUser(null)}
            sx={{}}
          >
            <DialogTitle>User Details</DialogTitle>
            <DialogContent>
              {viewUser && (
                <div>
                  <Typography>
                    <strong>UserID:</strong> {viewUser._id}
                  </Typography>
                  <Typography>
                    <strong>Username:</strong> {viewUser.user_name}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {viewUser.email}
                  </Typography>
                  <Typography>
                  <strong>Role:</strong> {roleMap[viewUser.role_code]}
                  </Typography>
                  <Typography>
                    <strong>Created at:</strong> {viewUser.created_at}
                  </Typography>
                  <Typography>
                    <strong>Updated at:</strong> {viewUser.updated_at}
                  </Typography>
                 
                 
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewUser(null)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setEditingUser(null); // Reset editing state
              setForm({
                email: "",
                user_name: "",
                role_code: "A001",
                password: "",
                confirmPassword:"",
              }); // Reset form
              setPopupOpen(true); // Open popup
            }}
            sx={{
              backgroundColor: "blue", // Màu cam
              color: "white", // Màu chữ trắng
              fontWeight: "bold",
              textTransform: "none", // Không in hoa
              borderRadius: "30px", // Bo tròn
              padding: "10px 20px", // Kích thước padding
              fontSize: "16px", // Cỡ chữ
              "&:hover": {
                backgroundColor: "Navy", // Màu khi hover
              },
              display: "flex",
              alignItems: "center",
              gap: "8px", // Khoảng cách giữa icon và chữ
            }}
          >
            <Plus />
            Create Account
          </Button>
        </div>

        <TableContainer
          component={Paper}
          className="mt-4"
          sx={{ borderRadius: "12px" }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#03045E" }}>
              <TableRow>
                <TableCell
                  sx={{
                    width: "20%",
                    fontWeight: "bold",
                    fontSize: "17px",
                    borderRight: "2px solid #ffff",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Username
                </TableCell>
                <TableCell
                  sx={{
                    width: "25%",
                    fontWeight: "bold",
                    fontSize: "17px",
                    borderRight: "2px solid #ffff",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    width: "10%",
                    fontWeight: "bold",
                    fontSize: "17px",
                    borderRight: "2px solid #ffff",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    width: "12%",
                    fontWeight: "bold",
                    fontSize: "17px",
                    borderRight: "2px solid #ffff",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Blocked
                </TableCell>
                <TableCell
                  sx={{
                    width: "18%",
                    fontWeight: "bold",
                    fontSize: "17px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{ borderBottom: "6px solid #90E0EF" }}
                >
                  <TableCell sx={{}}>{user.user_name}</TableCell>
                  <TableCell sx={{ textAlign: "left" }}>{user.email}</TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      borderRadius: "15px",

                      color:
                        user.role_code === "A001"
                          ? "#D32F2F" // Đỏ đậm
                          : user.role_code === "A002"
                          ? "#FBC02D" // Vàng đậm
                          : user.role_code === "A003"
                          ? "#388E3C" // Xanh lá đậm
                          : "#424242", // Xám đậm
                    }}
                  >
                    <Select
                      value={user.role_code}
                      onChange={(event) =>
                        handleRoleChange(user._id, event.target.value)
                      }
                      sx={{
                        fontWeight: "bold",
                        color: "inherit",
                        backgroundColor: "transparent",
                        "& .MuiSelect-icon": { color: "inherit" },
                      }}
                    >
                      <MenuItem value="A001" sx={{ color: "#D32F2F" }}>
                        Admin
                      </MenuItem>
                      <MenuItem value="A002" sx={{ color: "#FBC02D" }}>
                        Finance
                      </MenuItem>
                      <MenuItem value="A003" sx={{ color: "#388E3C" }}>
                        Approval
                      </MenuItem>
                      <MenuItem value="A004" sx={{ color: "black" }}>
                        Member
                      </MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      onClick={() =>
                        setConfirmDialog({ open: true, user, action: "block" })
                      }
                      variant="contained"
                      startIcon={
                        user.is_blocked ? (
                          <Lock size={16} />
                        ) : (
                          <Unlock size={16} />
                        )
                      }
                      sx={{
                        textTransform: "none", // Không viết hoa chữ
                        borderRadius: "12px", // Bo tròn góc
                        fontWeight: 600, // Chữ đậm
                        backgroundColor: user.is_blocked
                          ? "#FF3B30"
                          : "#34C759",
                        "&:hover": {
                          backgroundColor: user.is_blocked
                            ? "#D32F2F"
                            : "#2E7D32", // Màu khi hover
                        },
                      }}
                    >
                      {user.is_blocked ? "Locked" : "Unlocked"}
                    </Button>
                  </TableCell>

                  <TableCell sx={{ textAlign: "center" }}>
                    <Button onClick={() => setViewUser(user)}>
                      <Eye />
                    </Button>

                    <Button
                      color="inherit"
                      onClick={() => {
                        setEditingUser(user); // Set user being edited
                        setForm({
                          email: user.email,
                          user_name: user.user_name,
                          role_code: user.role_code,
                        });
                        setPopupOpen(true); // Open popup
                      }}
                    >
                      <Pencil size={18} />
                    </Button>

                    <Button
                      color="warning"
                      onClick={() =>
                        setConfirmDialog({ open: true, user, action: "delete" })
                      }
                    >
                      <CircleX size={18} />
                    </Button>

                    <Button
                    onClick={() => {
                      console.log("Selected User ID:", user._id); // ✅ Check if user.id exists
                      handleOpenEmployeeDetails(user._id);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Employees Details
                  </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Pagination
        count={totalPages}
        page={pageNum}
        onChange={(event, newPage) => setPageNum(newPage)} // Change page
        color="primary"
      />
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, user: null, action: null })
        }
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {confirmDialog.action === "delete"
              ? "delete"
              : confirmDialog.user?.is_blocked
              ? "unblock"
              : "block"}{" "}
            this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, user: null, action: null })
            }
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {popupOpen2 && (

        <Dialog open={popupOpen2} onClose={() => setPopupOpen2(false)}>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogContent>
            <TextField
              label="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              fullWidth
              margin="dense"
            />
            <Button
              onClick={() => handleOpenEmployeeDetails(userId)}
              variant="contained"
              color="primary"
              sx={{ marginTop: "10px" }}
            >
              Fetch Employee
            </Button>

            {/* Employee Fields */}
            {employeeData && (
              <>
                <TextField
                  label="Full Name"
                  value={employeeData.full_name}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      full_name: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="UserID"
                  value={employeeData.user_id}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      user_id: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Phone"
                  value={employeeData.phone}
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, phone: e.target.value })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Address"
                  value={employeeData.address}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      address: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Job Rank"
                  value={employeeData.job_rank}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      job_rank: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Department Code"
                  value={employeeData.department_code}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      department_code: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Avatar URL"
                  value={employeeData.avatar_url}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      avatar_url: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Contract Type"
                  value={employeeData.contract_type}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      contract_type: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Salary"
                  type="number"
                  value={employeeData.salary}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      salary: Number(e.target.value),
                    })
                  }
                  fullWidth
                  margin="dense"
                />
                <TextField
                  label="Start Date"
                  value={employeeData.start_date}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      start_date: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  value={employeeData.end_date}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      end_date: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Created Date"
                  value={employeeData.created_at}
                  onChange={(e) =>
                    setEmployeeData({
                      ...employeeData,
                      created_at: e.target.value,
                    })
                  }
                  fullWidth
                  margin="dense"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Updated by :"
                  value={employeeData._id}
                  onChange={(e) =>
                    setEmployeeData({ ...employeeData, _id: e.target.value })
                  }
                  fullWidth
                  margin="dense"
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPopupOpen2(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveEmployeeDetails} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
=======
  <Dialog open={popupOpen2} onClose={() => setPopupOpen2(false)}>
    <DialogTitle>Employee Details</DialogTitle>
    <DialogContent>
      {/* Employee Fields */}
      {employeeData && (
        <>
          <TextField
            label="Full Name"
            value={employeeData.full_name}
            onChange={(e) => setEmployeeData({ ...employeeData, full_name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="UserID"
            value={employeeData.user_id}
            onChange={(e) => setEmployeeData({ ...employeeData, user_id: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            value={employeeData.phone}
            onChange={(e) => setEmployeeData({ ...employeeData, phone: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address"
            value={employeeData.address}
            onChange={(e) => setEmployeeData({ ...employeeData, address: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Job Rank"
            value={employeeData.job_rank}
            onChange={(e) => setEmployeeData({ ...employeeData, job_rank: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Department Code"
            value={employeeData.department_code}
            onChange={(e) => setEmployeeData({ ...employeeData, department_code: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Avatar URL"
            value={employeeData.avatar_url}
            onChange={(e) => setEmployeeData({ ...employeeData, avatar_url: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Contract Type"
            value={employeeData.contract_type}
            onChange={(e) => setEmployeeData({ ...employeeData, contract_type: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Salary"
            type="number"
            value={employeeData.salary}
            onChange={(e) => setEmployeeData({ ...employeeData, salary: Number(e.target.value) })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Start Date"
            value={employeeData.start_date}
            onChange={(e) => setEmployeeData({ ...employeeData, start_date: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            value={employeeData.end_date}
            onChange={(e) => setEmployeeData({ ...employeeData, end_date: e.target.value })}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          
          
        </>

      )}
    </Layout>
  );
};

export default UserManagement;
