import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  searchUsers,
  createUser,
  updateUser,
  changeUserStatus,
  fetchUser,
  deleteUser,
} from "../services/userService";
import Layout from "../../../shared/layouts/Layout";
import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Typography

 } from "@mui/material";
import { User } from "../types/user";
import { Pagination } from "@mui/material";
import { Pencil } from 'lucide-react';
import { CircleX } from 'lucide-react';
import { Plus, Search } from "lucide-react";
import { Lock, Unlock } from "lucide-react";





const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pageNum, setPageNum] = useState(1); //  Track current page
  const [pageSize] = useState(5); //  Items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages from API
  const [form, setForm] = useState<{
    email: string;
    user_name: string;
    role_code: string;
    password?: string;
  }>({
    email: "",
    user_name: "",
    role_code: "A001",
    password: "",
  });
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
      if (editingUser) {
        // Updating an existing user
        await updateUser(editingUser._id, {
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
        });
        console.log("Updating user with:", updatedUser); // Debugging

        const response = await updateUser(editingUser._id, updatedUser);
        console.log("Update response:", response); // Debug API response

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editingUser._id
              ? { ...user, email: form.email, user_name: form.user_name, role_code: form.role_code }
              : user
          )
        );
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

  return (
    <Layout>
      <h1 className="text-6xl p-4 font-mono bold " style={{ backgroundColor: "#90E0EF" }}>USER MANAGEMENT</h1>
      <div className="p-4 " style={{ backgroundColor: "#90E0EF" }}>
        <div className="flex justify-end items-center gap-4 mb-4">
      <div className="w-[250px] min-w-[150px]  ">
        
      <TextField
        label="Search by Username...."
        variant="outlined"
        fullWidth
        margin="dense"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        
        size="small"
        sx={{
          
        }}
        
    
      
      />
      </div>
        <Dialog open={popupOpen} onClose={() => setPopupOpen(false)}
          sx={{ "& .MuiPaper-root": { borderRadius: "12px", padding: "20px", width: "500px" } }}>
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
      sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" ,color:"gray" }}
    />

    {/* Username Field */}
    Username
    <TextField
      
      fullWidth
      margin="dense"
      value={form.user_name}
      onChange={(e) => setForm({ ...form, user_name: e.target.value })}
      sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" ,color:"gray" }}
    />

    {/* Role Dropdown */}
    Role
    <TextField
      select
      
      fullWidth
      margin="dense"
      value={form.role_code}
      onChange={(e) => setForm({ ...form, role_code: e.target.value })}
      sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" }}
    >
      <option value="A001">A001</option>
      <option value="A002">A002</option>
      <option value="A003">A003</option>
      <option value="A004">A004</option>
    </TextField>

    {/* Password Field (ONLY for Adding New User) */}
    Password
    {!editingUser && (
      <TextField
       
        fullWidth
        margin="dense"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        sx={{ backgroundColor: "#E3F2FD", borderRadius: "6px" }}
      />
    )}
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

<Button 
  variant="contained" 
  color="primary" 
  onClick={() => {
    setEditingUser(null); // Reset editing state
    setForm({ email: "", user_name: "", role_code: "A001", password: "" }); // Reset form
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
  <Plus/>
  Create Account
</Button>
</div>

        <TableContainer component={Paper} className="mt-4" sx={{  borderRadius:"12px"  }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#03045E" , }}>
              <TableRow >
              <TableCell sx={{  fontWeight: "bold" , fontSize:'17px', borderRight: "2px solid #ffff" , textAlign: "center" , color:"white" }}>Username</TableCell>
                <TableCell sx={{  fontWeight: "bold", fontSize:'17px', borderRight: "2px solid #ffff" , textAlign: "center" , color:"white"  }}>Email</TableCell>
                <TableCell sx={{  fontWeight: "bold" , fontSize:'17px' , borderRight: "2px solid #ffff", textAlign: "center" , color:"white"  }}>Role</TableCell> 
                <TableCell sx={{  fontWeight: "bold", fontSize:'17px' , borderRight: "2px solid #ffff" , textAlign: "center" , color:"white" }}>Blocked</TableCell>
                <TableCell sx={{  fontWeight: "bold" , fontSize:'17px' , textAlign: "center", color:"white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}  sx={{ borderBottom: "6px solid #90E0EF" }}  >
                  <TableCell sx={{ textAlign: "center"}}>{user.user_name}</TableCell>
                  <TableCell sx={{ textAlign: "center"}}>{user.email}</TableCell>
                  <TableCell sx={{ textAlign: "center"}}>{user.role_code}</TableCell>
                  
                  <TableCell sx={{ textAlign: "center"}}> 
                  <Button
    onClick={() => setConfirmDialog({ open: true, user, action: "block" })}
    variant="contained" 
    startIcon={user.is_blocked ? <Lock size={16} /> : <Unlock size={16} />}
    
    sx={{
      
      textTransform: "none", // Không viết hoa chữ
      borderRadius: "12px", // Bo tròn góc
      fontWeight: 600, // Chữ đậm
      backgroundColor: user.is_blocked ? "#FF3B30" : "#34C759",
      "&:hover": {
        backgroundColor: user.is_blocked ? "#D32F2F" : "#2E7D32", // Màu khi hover
      }

    }}
  >
    {user.is_blocked ? "Locked" : "Unlocked"}
  </Button>
  
                         </TableCell>
                         

                  <TableCell sx={{ textAlign: "center"}}>

                    
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

                     
                    <Button color="warning" onClick={() => setConfirmDialog({ open: true, user, action: "delete" })}>
                    <CircleX size={18} />
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
      {/* <Waves
        lineColor="#fff"
        backgroundColor="rgba(175, 96, 96, 0.2)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      /> */}
    </Layout>
  );
};

export default UserManagement;
