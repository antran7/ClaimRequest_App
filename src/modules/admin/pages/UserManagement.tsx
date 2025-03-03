import { useEffect, useState } from "react";
import { searchUsers, createUser, updateUser, changeUserStatus, fetchUser, deleteUser } from "../services/userService";
import Layout from "../../../shared/layouts/Layout";
import { Button, Table, Input, Select } from "antd";
import { User , PageInfo , SearchResponse} from "../types/user"; 
import { message } from "antd";  



const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<{ email: string; user_name: string; role_code: string; password?: string }>({
    email: "",
    user_name: "",
    role_code: "A001",
    password: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchUsers(
        { email: searchTerm.trim() }, // ✅ Send search term
        { pageNum: 1, pageSize: 10 }
      );
      setUsers(response); // ✅ Update users
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };
  

  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await searchUsers(
  //       { email: searchTerm }, 
  //       { pageNum: 1, pageSize: 10 }
  //     );
  //     console.log("API Response:", response); // ✅ Check what API returns
  //     const data: User[] = response as User[];
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Failed to fetch users", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadUsers = async () => {
    try {
      const usersData = await searchUsers({}, { page: 1, size: 10 }); // Adjust pagination as needed
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };
  

  // const handleSave = async () => {
  //   try {
  //     console.log("Form Data Before Sending:", form);
  //     if (editingUser) {
  //       await updateUser(editingUser._id, { email: form.email, user_name: form.user_name });
  //       message.success("User updated successfully");
  //     } else {
  //       await createUser(form);
  //       message.success("User created successfully");
  //     }
  
  //     setPopupOpen(false);
  //     loadUsers();  // ✅ Reload users after adding or editing
  //   } catch (error) {
  //     console.error("Failed to save user", error);
  //     console.error("Server Response:", error.response?.data);
  //   }
  // };



  const handleSave = async () => {
    try {
      console.log("Editing User:", editingUser); // Debugging
  
      if (editingUser && !editingUser._id) {
        console.error("User ID is missing for edit.");
        return;
      }
  
      if (editingUser) {
        // Editing existing user
        await updateUser(editingUser._id, {
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
        });
      } else {
        // Creating new user
        await createUser({
          email: form.email,
          user_name: form.user_name,
          role_code: form.role_code,
          password: form.password,
        });
      }
  
      setPopupOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };
  

  const handleBlockToggle = async (user: User) => {
    try {
      await changeUserStatus(user._id, !user.is_blocked);
  
      // ✅ Update the blocked status locally without re-fetching
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, is_blocked: !user.is_blocked } : u
        )
      );
    } catch (error) {
      console.error("Failed to change user status", error);
    }
  };
  

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      fetchUsers(); // ✅ Refresh list
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };
  
  

  return (
    <Layout>
      <div className="p-4">
        <Input
          placeholder="Search by email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onPressEnter={fetchUsers}
        />
        <Button
  onClick={() => {
    setEditingUser(null);
    setForm({ email: "", user_name: "", role_code: "A001" }); // Reset form
    setPopupOpen(true);
  }}
>
  Add New User
</Button>

        <Table 
          dataSource={users} 
          rowKey="id" 
          loading={loading} 
          columns={[
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Username", dataIndex: "user_name", key: "user_name" },
            { 
              title: "Blocked", 
              dataIndex: "is_blocked", 
              key: "is_blocked",
              render: (is_blocked) => (is_blocked ? "Yes" : "No")
            },
            {
              title: "Actions",
              key: "actions",
              render: (_, user) => (
                <>
           <Button
  onClick={async () => {
    try {
      console.log("Editing user:", user); // Debugging log
      if (!user._id) {
        console.error("User ID is missing for edit.");
        return;
      }

      const userData = await fetchUser(user._id);

      if (!userData) {
        console.error("User data is null or undefined");
        return;
      }

      setEditingUser({
        _id: userData._id,  // Ensure _id is stored
        email: userData.email ?? "",
        user_name: userData.user_name ?? "",
        role_code: userData.role_code ?? "A001",
      });

      setPopupOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  }}
>
  Edit
</Button>

        <Button onClick={() => handleBlockToggle(user)}>
                   {user.is_blocked ? "Unblock" : "Block"}
        </Button>

                  <Button danger onClick={() => handleDelete(user._id)}>Delete</Button>

                </>
              )
            }
          ]} 
        />
        {popupOpen && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 shadow-lg rounded">
            <Input 
              value={form.email} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })} 
              placeholder="Email" 
            />
            <Input 
              value={form.user_name} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, user_name: e.target.value })} 
              placeholder="Username" 
            />
            {!editingUser && (
              <Input 
                type="password" 
                value={form.password ?? ""} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, password: e.target.value })} 
                placeholder="Password" 
              />
            )}
            <Select value={form.role_code} onChange={(val: string) => setForm({ ...form, role_code: val })}>
              <Select.Option value="A001">Admin</Select.Option>
              <Select.Option value="A002">User</Select.Option>
              <Select.Option value="A003">Financer</Select.Option>
              <Select.Option value="A004">Approver</Select.Option>
            </Select>
            <Button onClick={handleSave}>{editingUser ? "Update" : "Create"}</Button>
            <Button onClick={() => setPopupOpen(false)}>Close</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
