import { useState, useEffect } from "react";
import Modal from "./Modal";
import Header from "../../../shared/components/Header";
import Footer from "../../../shared/components/Footer";
import "./UserManagement.css";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Claimer" | "Approver" | "Financer";
  jobRank: "PM" | "QA" | "Tester" | "Technical Lead" | "BA" | "Dev" | "Tech Consultancy";
  status: "Active" | "Locked";
  created_at: string;
  updated_at: string;
}

const API_URL = "https://67b416e6392f4aa94fa93e19.mockapi.io/api/Request";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      showModal("Error", <p>Failed to fetch users.</p>);
    }
  };

  const getCurrentTimestamp = () => new Date().toLocaleString();

  const showModal = (
    title: string,
    content: JSX.Element,
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
    let password = "";
    let role: User["role"] = "Claimer";
    let jobRank: User["jobRank"] = "PM";

    showModal(
      "Add New User",
      <div className="form-container">
        <label>Name: <input placeholder="Name" onChange={(e) => (name = e.target.value)} /></label>
        <label>Email: <input placeholder="Email" onChange={(e) => (email = e.target.value)} /></label>
        <label>Password: <input type="password" placeholder="Password" onChange={(e) => (password = e.target.value)} /></label>
        <label>Role:
          <select defaultValue={role} onChange={(e) => (role = e.target.value as User["role"])}>
            {['Admin', 'Claimer', 'Approver', 'Financer'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>Job Rank:
          <select defaultValue={jobRank} onChange={(e) => (jobRank = e.target.value as User["jobRank"])}>
            {["PM", "QA", "Tester", "Technical Lead", "BA", "Dev", "Tech Consultancy"].map((rank) => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </label>
      </div>,
      async () => {
        if (!name || !email || !password) return showModal("Error", <p>All fields are required.</p>);
        try {
          const timestamp = getCurrentTimestamp();
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role, jobRank, status: "Active", created_at: timestamp, updated_at: timestamp }),
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
    let updatedName = user.name;
    let updatedEmail = user.email;
    let updatedPassword = user.password;
    let updatedRole = user.role;
    let updatedJobRank = user.jobRank;

    showModal(
      "Edit User",
      <div className="form-container">
        <label>Name: <input defaultValue={user.name} onChange={(e) => (updatedName = e.target.value)} /></label>
        <label>Email: <input defaultValue={user.email} onChange={(e) => (updatedEmail = e.target.value)} /></label>
        <label>Password: <input type="password" defaultValue={user.password} onChange={(e) => (updatedPassword = e.target.value)} /></label>
        <label>Role:
          <select defaultValue={user.role} onChange={(e) => (updatedRole = e.target.value as User["role"])}>
            {['Admin', 'Claimer', 'Approver', 'Financer'].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>Job Rank:
          <select defaultValue={user.jobRank} onChange={(e) => (updatedJobRank = e.target.value as User["jobRank"])}>
            {["PM", "QA", "Tester", "Technical Lead", "BA", "Dev", "Tech Consultancy"].map((rank) => (
              <option key={rank} value={rank}>{rank}</option>
            ))}
          </select>
        </label>
      </div>,
      async () => {
        if (!updatedName || !updatedEmail || !updatedPassword) return showModal("Error", <p>All fields are required.</p>);
        try {
          const timestamp = getCurrentTimestamp();
          const response = await fetch(`${API_URL}/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...user, name: updatedName, email: updatedEmail, password: updatedPassword, role: updatedRole, jobRank: updatedJobRank, updated_at: timestamp }),
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
      const newStatus = user.status === "Active" ? "Locked" : "Active";
      const timestamp = getCurrentTimestamp();
      const response = await fetch(`${API_URL}/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, status: newStatus, updated_at: timestamp }),
      });
      if (!response.ok) throw new Error("Failed to change status");
      await fetchUsers();
    } catch {
      showModal("Error", <p>Failed to change user status.</p>);
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name ?? "").toLowerCase().includes(search.toLowerCase())
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
              <th>Password</th>
              <th>Role</th>
              <th>Job Rank</th>
              <th>Status</th>
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
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.role}</td>
                  <td>{user.jobRank}</td>
                  <td>{user.status}</td>
                  <td>{user.created_at}</td>
                  <td>{user.updated_at}</td>
                  <td className="action-buttons">
                    <button className="edit-btn" onClick={() => editUser(user)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                    <button className="lock-btn" onClick={() => toggleLockStatus(user)}>{user.status === "Active" ? "Lock" : "Unlock"}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="no-users">No users found.</td>
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
