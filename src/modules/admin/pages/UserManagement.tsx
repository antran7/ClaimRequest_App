import { useState, useEffect } from "react";
import "./UserManagement.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Locked";
}

const API_URL = "https://67b416e6392f4aa94fa93e19.mockapi.io/api/Request";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Add new user to API
  const addUser = async () => {
    const name = prompt("Enter name:");
    const email = prompt("Enter email:");
    const role = prompt("Enter role:");
    if (name && email && role) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, role, status: "Active" }),
        });
        if (!response.ok) throw new Error("Failed to add user");
        await fetchUsers(); // Refresh list
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Error adding user.");
      }
    }
  };

  // Edit user in API
  const editUser = async (id: number) => {
    const userToEdit = users.find(user => user.id === id);
    if (!userToEdit) return;

    const newName = prompt("Enter new name:", userToEdit.name);
    const newEmail = prompt("Enter new email:", userToEdit.email);
    const newRole = prompt("Enter new role:", userToEdit.role);

    if (newName && newEmail && newRole) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userToEdit, name: newName, email: newEmail, role: newRole }),
        });
        if (!response.ok) throw new Error("Failed to edit user");
        await fetchUsers(); // Refresh list
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Error editing user.");
      }
    }
  };

  // Delete user from API
  const deleteUser = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete user");
        await fetchUsers(); // Refresh list
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Error deleting user.");
      }
    }
  };

  // Lock/Unlock user in API
  const toggleLockUser = async (id: number) => {
    const userToUpdate = users.find(user => user.id === id);
    if (!userToUpdate) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userToUpdate,
          status: userToUpdate.status === "Active" ? "Locked" : "Active",
        }),
      });
      if (!response.ok) throw new Error("Failed to update user status");
      await fetchUsers(); // Refresh list
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error updating status.");
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="user-management-container">
      <div className="user-management">
        <h1>User Management</h1>
        <button className="add-user-btn" onClick={addUser}>Add New User</button>
        <input
          type="text"
          placeholder="Search user..."
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => editUser(user.id)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteUser(user.id)}>Delete</button>
                  <button className="lock-btn" onClick={() => toggleLockUser(user.id)}>
                    {user.status === "Active" ? "Lock" : "Unlock"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
