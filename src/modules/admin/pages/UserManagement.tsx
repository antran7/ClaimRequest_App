import { useEffect, useState } from "react";
import { searchUsers, createUser, updateUser, changeUserStatus } from "../services/userService";
import Layout from "../../../shared/layouts/Layout";
import { Button, Table, Input, Select } from "antd";

interface User {
  id: string;
  email: string;
  user_name: string;
  role_code: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  token_version: number;
}

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
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data: User[] = await searchUsers({ searchCondition: { email: searchTerm }, pageInfo: { pageNum: 1, pageSize: 10 } });
      console.log("Fetched Users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, { email: form.email, user_name: form.user_name });
      } else {
        await createUser({ ...form, password: form.password ?? "" });
      }
      fetchUsers();
      setPopupOpen(false);
    } catch (error) {
      console.error("Failed to save user", error);
    }
  };

  const handleBlockToggle = async (id: string, isBlocked: boolean) => {
    try {
      await changeUserStatus(id, !isBlocked);
      fetchUsers();
    } catch (error) {
      console.error("Failed to change user status", error);
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
        <Button onClick={() => { setEditingUser(null); setPopupOpen(true); }}>Add New User</Button>
        <Table 
          dataSource={users} 
          rowKey="id" 
          loading={loading} 
          columns={[
            { title: "Email", dataIndex: "email", key: "email" },
            { title: "Username", dataIndex: "user_name", key: "user_name" },
            { title: "Role", dataIndex: "role_code", key: "role_code" },
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
                  <Button onClick={() => { 
                    setEditingUser(user); 
                    setForm({ email: user.email, user_name: user.user_name, role_code: user.role_code }); 
                    setPopupOpen(true); 
                  }}>Edit</Button>
                  <Button onClick={() => handleBlockToggle(user.id, user.is_blocked)}>
                    {user.is_blocked ? "Unblock" : "Block"}
                  </Button>
                  <Button danger>Delete</Button>
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
              <Select.Option value="A002">Claimer</Select.Option>
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
