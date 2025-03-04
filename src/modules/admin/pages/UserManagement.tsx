import { useEffect, useState } from "react";
import { searchUsers, createUser, updateUser, changeUserStatus, fetchUser, deleteUser } from "../services/userService";
import Layout from "../../../shared/layouts/Layout";
import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from "@mui/material";
import { User } from "../types/user";
import { Pagination } from "@mui/material";


const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pageNum, setPageNum] = useState(1); //  Track current page
  const [pageSize] = useState(5); //  Items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [form, setForm] = useState<{ email: string; user_name: string; role_code: string; password?: string }>({
    email: "",
    user_name: "",
    role_code: "A001",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; user: User | null; action: "delete" | "block" | null }>({
    open: false,
    user: null,
    action: null,
  });
  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum,searchTerm]);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(
        { keyword: searchTerm.trim() }, 
        { pageNum, pageSize }
      )
      console.log("Users type check:", Array.isArray(response.pageData)); // Should be true
      console.log("Parsed Users:", response.pageData); //  Debug users
      if (response?.pageData && response?.pageInfo) {
        setUsers(response.pageData); //  Correctly setting users
        setTotalPages(response.pageInfo.totalPages || 1); //  Fix pagination
      } else {
        console.error("Invalid API response structure:", response);
        setUsers([]); // 🛠 Prevent crashes
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsers([]); // 🛠 Prevent UI crash
    } finally {
      setLoading(false);
    }
  };
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_code.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const handleSave = async () => {
    try {
      if (editingUser) {
        // Updating an existing user
        await updateUser(editingUser._id, {
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
        });
      } else {
        // Creating a new user
        await createUser({
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
          password: form.password, // Password required for new users
        });
      }
      setPopupOpen(false); // Close popup after saving
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  
  const handleConfirmAction = async () => {
    if (!confirmDialog.user || !confirmDialog.action) return;
    try {
      if (confirmDialog.action === "block") {
        await changeUserStatus(confirmDialog.user._id, !confirmDialog.user.is_blocked);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === confirmDialog.user!._id ? { ...u, is_blocked: !confirmDialog.user!.is_blocked } : u
          )
        );
      } else if (confirmDialog.action === "delete") {
        await deleteUser(confirmDialog.user._id);
        fetchUsers();
      }
    } catch (error) {
      console.error(`Failed to ${confirmDialog.action} user`, error);
    } finally {
      setConfirmDialog({ open: false, user: null, action: null });
    }
  };
  

  return (
    <Layout>
      <div className="p-4">
      <TextField
        label="Search by Username or RoleCode"
        variant="outlined"
        fullWidth
        margin="dense"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
        <Dialog open={popupOpen} onClose={() => setPopupOpen(false)}>
  <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
  <DialogContent>
    {/* Email Field */}
    <TextField
      label="Email"
      fullWidth
      margin="dense"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />

    {/* Username Field */}
    <TextField
      label="Username"
      fullWidth
      margin="dense"
      value={form.user_name}
      onChange={(e) => setForm({ ...form, user_name: e.target.value })}
    />

    {/* Role Dropdown */}
    <TextField
      select
      label="Role"
      fullWidth
      margin="dense"
      value={form.role_code}
      onChange={(e) => setForm({ ...form, role_code: e.target.value })}
      SelectProps={{ native: true }}
    >
      <option value="A001">A001</option>
      <option value="A002">A002</option>
      <option value="A003">A003</option>
      <option value="A004">A004</option>
    </TextField>

    {/* Password Field (ONLY for Adding New User) */}
    {!editingUser && (
      <TextField
        label="Password"
        fullWidth
        margin="dense"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setPopupOpen(false)} color="error">Cancel</Button>
    <Button onClick={handleSave} color="primary">Save</Button>
  </DialogActions>
</Dialog>

<Button 
  variant="contained" 
  color="primary" 
  onClick={() => {
    setEditingUser(null); // Reset editing state
    setForm({ email: "", user_name: "", role_code: "A001", password: "" }); // Reset form
    setPopupOpen(true); // Open popup
  }}
  style={{ marginBottom: "16px" }}
>
  Add New User
</Button>

        <TableContainer component={Paper} className="mt-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Blocked</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role_code}</TableCell>
                  <TableCell>{user.user_name}</TableCell>
                  <TableCell> <Button onClick={() => setConfirmDialog({ open: true, user, action: "block" })}>
                        {user.is_blocked ? "Locked" : "Unlocked"} </Button></TableCell>
                  <TableCell>
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
                        Edit
                      </Button>
                    <Button color="warning" onClick={() => setConfirmDialog({ open: true, user, action: "delete" })}>
                      Delete
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
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, user: null, action: null })}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {confirmDialog.action === "delete" ? "delete" : confirmDialog.user?.is_blocked ? "unblock" : "block"} this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, user: null, action: null })} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="success">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserManagement;

