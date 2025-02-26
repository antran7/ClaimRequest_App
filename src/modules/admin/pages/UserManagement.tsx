import { useState, useEffect } from "react";
import Modal from "./Modal";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import "./UserManagement.css";

interface User {
  id: number;
  staffName: string;
  email: string;
  role_code: "A001" | "A002" | "A003" | "A004";
  blocked: "Yes" | "No";
  created_at: string;
  updated_at: string;
}

const API_URL = "https://67b416e6392f4aa94fa93e19.mockapi.io/api/Request";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      console.log("Fetched data:", data);
      setUsers(
        Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              staffName: item.staffName || "Unknown",
              email: item.email || "",
              password: item.password || "",
              role: item.role || "Claimer",
              jobRank: item.jobRank || "PM",
              status: item.status || "Active",
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
            }))
          : []
      );
    } catch {
      showModal("Error", <p>Failed to fetch users.</p>);
    }
  };


  const getCurrentTimestamp = () => new Date().toLocaleString();

  const showModal = (
    title: string,
    content: React.ReactNode,
    confirmAction?: () => void
  ) => {
    setModalContent(
      <Modal
        isOpen={true}
        title={title}
        content={content}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmAction}
      />
    );
    setModalOpen(true);
  };

  const addUser = () => {
    let name = "";
    let email = "";
    let role_code: User["role_code"] = "A001";
    let blocked: User["blocked"] = "No";

    showModal(
      "Add New User",
      <div className="form-container">
        <label>Name: <input placeholder="Name" onChange={(e) => (name = e.target.value)} /></label>
        <label>Email: <input placeholder="Email" onChange={(e) => (email = e.target.value)} /></label>
        <label>Role Code:
          <select defaultValue={role_code} onChange={(e) => (role_code = e.target.value as User["role_code"]) }>
            {["A001", "A002", "A003", "A004"].map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>
        <label>Blocked:
          <select defaultValue={blocked} onChange={(e) => (blocked = e.target.value as User["blocked"]) }>
            {["Yes", "No"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>,
      async () => {
        if (!name || !email) return showModal("Error", <p>All fields are required.</p>);
        try {
          const timestamp = getCurrentTimestamp();
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              staffName: name,
              email,
              role_code,
              blocked,
              created_at: timestamp,
              updated_at: timestamp
            }),
          });
          if (!response.ok) throw new Error("Failed to add user");
          await fetchUsers();
          setModalOpen(false);
        } catch {
          showModal("Error", <p>Failed to add user.</p>);
        }
      }
    );
  };

  const editUser = (user: User) => {
    let updatedName = user.staffName;
    let updatedEmail = user.email;
    let updatedRoleCode = user.role_code;
    let updatedBlocked = user.blocked;

    showModal(
      "Edit User",
      <div className="form-container">
        <label>Name: <input defaultValue={user.staffName} onChange={(e) => (updatedName = e.target.value)} /></label>
        <label>Email: <input defaultValue={user.email} onChange={(e) => (updatedEmail = e.target.value)} /></label>
        <label>Role Code:
          <select defaultValue={user.role_code} onChange={(e) => (updatedRoleCode = e.target.value as User["role_code"])}>
            {["A001", "A002", "A003", "A004"].map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </label>
        <label>Blocked:
          <select defaultValue={user.blocked} onChange={(e) => (updatedBlocked = e.target.value as User["blocked"])}>
            {["Yes", "No"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>
      </div>,
      async () => {
        if (!updatedName || !updatedEmail) return showModal("Error", <p>All fields are required.</p>);
        try {
          const timestamp = getCurrentTimestamp();
          const response = await fetch(`${API_URL}/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...user,
              staffName: updatedName,
              email: updatedEmail,
              role_code: updatedRoleCode,
              blocked: updatedBlocked,
              updated_at: timestamp
            }),
          });
          if (!response.ok) throw new Error("Failed to update user");
          await fetchUsers();
          setModalOpen(false);
        } catch {
          showModal("Error", <p>Failed to update user.</p>);
        }
      }
    );
  };

  const deleteUser = (id: number) => {
    showModal("Confirm Delete", <p>Are you sure you want to delete this user?</p>, async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
        await fetchUsers();
        setModalOpen(false);
      } catch {
        showModal("Error", <p>Failed to delete user.</p>);
      }
    });
  };

  const toggleLockStatus = async (user: User) => {
    try {
      const newBlockedStatus = user.blocked === "Yes" ? "No" : "Yes";
      const timestamp = getCurrentTimestamp();
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, blocked: newBlockedStatus, updated_at: timestamp }),
      });
      if (!response.ok) throw new Error("Failed to change status");
      await fetchUsers();
    } catch {
      showModal("Error", <p>Failed to change user status.</p>);
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.staffName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-management-page">
      <Header />
      <div className="user-management-container">
        <h1>User Management</h1>
        <div className="controls">
          <button className="add-btn" onClick={addUser}>Add New User</button>
          <input type="text" placeholder="Search user..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role Code</th>
              <th>Blocked</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.staffName}</td>
                  <td>{user.email}</td>
                  <td>{user.role_code}</td>
                  <td>{user.blocked}</td>
                  <td>{user.created_at}</td>
                  <td>{user.updated_at}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => editUser(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                    <button className="lock-btn" onClick={() => toggleLockStatus(user)}>
                      {user.blocked === "Yes" ? "Unlock" : "Lock"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="no-users">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {modalOpen && modalContent}
      </div>
      <Footer />
    </div>
  );
}
